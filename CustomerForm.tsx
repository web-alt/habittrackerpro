import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, CreditCard, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { useSaveCustomerData } from '../hooks/useQueries';

interface FormData {
  email: string;
  mobile: string;
}

export function CustomerForm() {
  const [showPayment, setShowPayment] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const { mutate: saveCustomerData, isPending } = useSaveCustomerData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    saveCustomerData(
      { email: data.email, mobile: data.mobile },
      {
        onSuccess: () => {
          setShowPayment(true);
          toast.success('Details saved! Please proceed with payment.');
          // Smooth scroll to payment section
          setTimeout(() => {
            document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        },
        onError: (error) => {
          toast.error('Failed to save details. Please try again.');
          console.error('Error saving customer data:', error);
        },
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUPI(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleProceedToPayment = () => {
    const upiLink = 'upi://pay?pa=shreekumaran@fam&pn=Habit%20Tracker%20Pro&am=29&cu=INR';
    window.open(upiLink, '_blank');
    toast.success('Opening UPI payment link...');
  };

  return (
    <section id="customer-form" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="space-y-8">
          {/* Form Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">Get Your Habit Tracker Pro</CardTitle>
              <CardDescription className="text-base">
                Enter your details to receive the product via email after payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10 h-12 text-base"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      disabled={showPayment}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Mobile Field */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-base">
                    Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="9876543210"
                      className="pl-10 h-12 text-base"
                      {...register('mobile', {
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Invalid mobile number (10 digits starting with 6-9)',
                        },
                      })}
                      disabled={showPayment}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-sm text-destructive">{errors.mobile.message}</p>
                  )}
                </div>

                {/* Info Alert */}
                <Alert className="bg-primary/5 border-primary/20">
                  <Mail className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    Your product will be delivered to this email address.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                {!showPayment && (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Continue
                      </>
                    )}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Payment Section */}
          {showPayment && (
            <Card id="payment-section" className="border-2 border-primary/30 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="space-y-2 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardTitle className="text-2xl sm:text-3xl flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  Payment Details
                </CardTitle>
                <CardDescription className="text-base">
                  Complete your payment using UPI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Proceed to Payment Button */}
                <Button
                  onClick={handleProceedToPayment}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Proceed to Payment (₹29)
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or pay manually
                    </span>
                  </div>
                </div>

                {/* UPI Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-card p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">UPI ID</p>
                      <p className="text-lg font-bold text-foreground">shreekumaran@fam</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('shreekumaran@fam')}
                      className="gap-2"
                    >
                      {copiedUPI ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-card p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold text-primary">₹29</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center py-4">
                  <div className="rounded-xl border-2 border-primary/20 bg-white p-4 shadow-lg">
                    <img
                      src="/assets/image.png"
                      alt="UPI QR Code"
                      className="h-48 w-48 sm:h-56 sm:w-56"
                    />
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      Scan to pay with any UPI app
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 rounded-lg bg-accent/5 p-4">
                  <p className="font-semibold text-foreground">Payment Instructions:</p>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">1.</span>
                      <span>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">2.</span>
                      <span>Scan the QR code or use the UPI ID: shreekumaran@fam</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">3.</span>
                      <span>Enter amount: ₹29</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">4.</span>
                      <span>Complete the payment</span>
                    </li>
                  </ol>
                </div>

                {/* Confirmation Message */}
                <Alert className="border-2 border-primary/30 bg-primary/5">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <AlertDescription className="text-sm">
                    <p className="font-semibold text-foreground">
                      After successful payment, Habit Tracker Pro will be sent to your email.
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Email: {getValues('email')}
                    </p>
                    <p className="mt-1 text-xs text-destructive font-medium">
                      Please ensure your email ID is correct before making payment.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
