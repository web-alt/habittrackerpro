import { Mail, CreditCard, Download } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const steps = [
  {
    icon: Mail,
    title: 'Enter your details',
    description: 'Provide your email ID and mobile number',
    step: '1',
  },
  {
    icon: CreditCard,
    title: 'Pay ₹29 via UPI',
    description: 'Complete payment using any UPI app',
    step: '2',
  },
  {
    icon: Download,
    title: 'Receive via email',
    description: 'Get Habit Tracker Pro in your inbox',
    step: '3',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-accent/5 via-background to-primary/5 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with Habit Tracker Pro in three simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-2 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Step Number Badge */}
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                        <Icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div className="text-6xl font-bold text-primary/10">
                        {step.step}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Connector Lines (Desktop) */}
          <div className="hidden md:block relative -mt-8">
            <div className="absolute left-1/6 right-1/6 top-0 flex justify-between">
              <div className="h-0.5 w-1/3 bg-gradient-to-r from-primary/30 to-accent/30" />
              <div className="h-0.5 w-1/3 bg-gradient-to-r from-accent/30 to-primary/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
