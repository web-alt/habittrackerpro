import { CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                <span>Digital Product</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Build Better Habits,{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  One Day at a Time
                </span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Habit Tracker Pro helps you stay consistent using a simple, powerful tracker.
              </p>
            </div>

            {/* Price Badge */}
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <div className="inline-flex items-baseline gap-2 rounded-2xl bg-card border-2 border-primary/20 px-8 py-4 shadow-lg">
                <span className="text-5xl font-bold text-primary">₹29</span>
                <span className="text-lg text-muted-foreground">only</span>
              </div>
              <p className="text-sm text-muted-foreground">One-time payment • No subscription</p>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/10 bg-card shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5">
                <video
                  src="/assets/habit tracker.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
