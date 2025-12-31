import { CheckCircle2, Shield, Zap, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const features = [
  {
    icon: CheckCircle2,
    title: 'One-time payment',
    description: 'Pay once, use forever',
  },
  {
    icon: Shield,
    title: 'No subscription',
    description: 'No recurring charges',
  },
  {
    icon: Zap,
    title: 'Simple and beginner-friendly',
    description: 'Easy to use for everyone',
  },
  {
    icon: Users,
    title: 'Designed for students',
    description: 'Perfect for daily use',
  },
];

export function TrustSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Habit Tracker Pro?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, affordable, and designed with you in mind
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 shadow-md transition-all hover:shadow-lg hover:border-primary/30"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trust Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border-2 border-primary/20 bg-card px-6 py-3 shadow-lg">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Secure • Instant Delivery • Email Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
