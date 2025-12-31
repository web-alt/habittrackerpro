import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { HeroSection } from './components/HeroSection';
import { CustomerForm } from './components/CustomerForm';
import { HowItWorks } from './components/HowItWorks';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Shield } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!showAdmin ? (
        <>
          <main>
            <HeroSection />
            <CustomerForm />
            <HowItWorks />
            <TrustSection />
          </main>
          <Footer />
          {/* Admin Access Button */}
          <div className="fixed bottom-4 right-4 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdmin(true)}
              className="h-10 w-10 rounded-full shadow-lg"
              title="Admin Access"
            >
              <Shield className="h-5 w-5" />
            </Button>
          </div>
        </>
      ) : (
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      )}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppContent />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}

export default App;
