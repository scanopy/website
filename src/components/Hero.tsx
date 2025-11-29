import { Button } from "@/components/ui/button";
import { GitHubStars } from "@/components/GitHubStars";
import { Github, BookOpen, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10 blur-3xl" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* GitHub Stars Badge */}
          <div className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-1000 delay-150">
            <GitHubStars repo="mayanayza/netvisor" />
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Network Discovery,
            <br />
            Beautifully Automated
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            Automatically discover and visually document your network infrastructure. 
            NetVisor turns complex networks into clear, living documentation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-elevated hover:shadow-glow transition-smooth group"
              asChild
            >
              <a href="#pricing">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-smooth" />
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 hover:border-primary hover:bg-primary/5 transition-smooth group"
              asChild
            >
              <a
                href="https://github.com/mayanayza/netvisor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 w-5 h-5 group-hover:scale-110 transition-smooth" />
                View on GitHub
              </a>
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="text-lg px-8 py-6 hover:bg-secondary transition-smooth group"
              asChild
            >
              <a
                href="https://github.com/mayanayza/netvisor#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="mr-2 w-5 h-5 group-hover:scale-110 transition-smooth" />
                Documentation
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
