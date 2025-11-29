import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NetVisor
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Services
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Pricing
            </a>
            <a
              href="https://github.com/mayanayza/netvisor#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            >
              Docs
            </a>
          </div>

          <Button size="sm" asChild>
            <a href="#pricing">Get Started</a>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <Hero />
      
      <div id="features">
        <Features />
      </div>

      <Testimonials />
      
      <Pricing />

      <Footer />
    </div>
  );
};

export default Index;
