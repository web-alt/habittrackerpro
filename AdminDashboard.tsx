import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Download, LogOut, Lock, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { useGetAllCustomerContacts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface AdminDashboardProps {
  onClose: () => void;
}

interface LoginForm {
  password: string;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [passwordVerified, setPasswordVerified] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  // Only fetch data when both password is verified and user is authenticated
  const { data: contacts, isLoading, error, refetch } = useGetAllCustomerContacts(
    passwordVerified && isAuthenticated
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>();

  // Refetch data when authentication state changes
  useEffect(() => {
    if (passwordVerified && isAuthenticated) {
      refetch();
    }
  }, [passwordVerified, isAuthenticated, refetch]);

  const onPasswordSubmit = (data: LoginForm) => {
    if (data.password === 'admin123') {
      setPasswordVerified(true);
      toast.success('Password verified!');
      
      // If not authenticated with II, prompt to login
      if (!isAuthenticated) {
        toast.info('Please login with Internet Identity to access admin features');
      }
    } else {
      setError('password', { message: 'Incorrect password' });
      toast.error('Incorrect password');
    }
  };

  const handleInternetIdentityLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Failed to login with Internet Identity');
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    setPasswordVerified(false);
    toast.success('Logged out successfully');
  };

  const downloadCSV = () => {
    if (!contacts || contacts.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['Email', 'Mobile', 'Submission Date'];
    const rows = contacts.map((contact) => [
      contact.email,
      contact.mobile,
      new Date(Number(contact.timestamp) / 1000000).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customer-contacts-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV file downloaded successfully!');
  };

  const isFullyAuthenticated = passwordVerified && isAuthenticated;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Habit Tracker Pro</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Password Verification Form */}
        {!passwordVerified ? (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter admin password to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Verify Password
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : !isAuthenticated ? (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Internet Identity Login Required</CardTitle>
              <CardDescription>
                Please login with Internet Identity to access admin features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Admin access requires authentication with Internet Identity for secure access to customer data.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={handleInternetIdentityLogin} 
                className="w-full"
                disabled={loginStatus === 'logging-in'}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login with Internet Identity'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setPasswordVerified(false)} 
                className="w-full"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button onClick={downloadCSV} disabled={!contacts || contacts.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Contacts</CardTitle>
                <CardDescription>
                  {contacts ? `${contacts.length} total submissions` : 'Loading...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {error instanceof Error 
                        ? error.message.includes('Unauthorized') 
                          ? 'Access denied. You need admin permissions to view this data. Please ensure you are logged in with an admin account.'
                          : `Failed to load customer data: ${error.message}`
                        : 'Failed to load customer data. Please try again.'}
                    </AlertDescription>
                  </Alert>
                ) : !contacts || contacts.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No customer submissions yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Email</TableHead>
                          <TableHead className="min-w-[120px]">Mobile</TableHead>
                          <TableHead className="min-w-[180px]">Submission Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{contact.email}</TableCell>
                            <TableCell>{contact.mobile}</TableCell>
                            <TableCell>
                              {new Date(Number(contact.timestamp) / 1000000).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
