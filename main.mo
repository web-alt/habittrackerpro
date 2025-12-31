import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();

  // Customer contact type
  type CustomerContact = {
    email : Text;
    mobile : Text;
    timestamp : Time.Time;
  };

  module CustomerContact {
    public func compare(contact1 : CustomerContact, contact2 : CustomerContact) : Order.Order {
      Int.compare(contact1.timestamp, contact2.timestamp);
    };
  };

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let customerContactsMap = Map.empty<Principal, CustomerContact>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access Control Functions
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Validation functions
  func validateEmail(email : Text) : Bool {
    let chars = email.toArray();
    let atIndex = chars.indexOf('@');

    switch (atIndex) {
      case (null) { false };
      case (?idx) {
        let dotIndex = chars.indexOf('.');
        switch (dotIndex) {
          case (null) { false };
          case (?dotIdx) { dotIdx > idx };
        };
      };
    };
  };

  func validateMobile(mobile : Text) : Bool {
    let chars = mobile.toArray();
    chars.size() == 10 and chars.all(func(ch) { ch.isDigit() });
  };

  // Customer Contact Form Section 
  // Public function - accessible to all (including guests)
  public shared ({ caller }) func saveCustomerContact(email : Text, mobile : Text) : async () {
    if (not validateEmail(email)) {
      Runtime.trap("Invalid email format. Must contain '@' and a valid domain.");
    };
    if (not validateMobile(mobile)) {
      Runtime.trap("Invalid mobile number. Must be 10 digits.");
    };

    let contact : CustomerContact = {
      email;
      mobile;
      timestamp = Time.now();
    };

    customerContactsMap.add(caller, contact);
  };

  public query ({ caller }) func getCustomerContact(user : Principal) : async ?CustomerContact {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own contact information");
    };
    customerContactsMap.get(user);
  };

  // Admin-only function for viewing all customer contacts in dashboard
  public query ({ caller }) func getAllCustomerContacts() : async [CustomerContact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all customer contacts");
    };
    customerContactsMap.values().toArray().sort();
  };
};
