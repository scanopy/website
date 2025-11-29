import { Network, Eye, Zap, Shield, GitBranch, FileCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Network,
    title: "Auto-Discovery",
    description: "Automatically scan and discover all devices on your network in seconds",
  },
  {
    icon: Eye,
    title: "Visual Documentation",
    description: "Transform complex network data into beautiful, easy-to-understand diagrams",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Keep your network documentation current with live monitoring and updates",
  },
  {
    icon: Shield,
    title: "Security Insights",
    description: "Identify vulnerabilities and maintain security compliance across your infrastructure",
  },
  {
    icon: GitBranch,
    title: "Service Detection",
    description: "Detect 100+ services running on your network automatically",
  },
  {
    icon: FileCode,
    title: "Export & API",
    description: "Export data in multiple formats or integrate via our comprehensive API",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to document, monitor, and secure your network infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="gradient-card border border-border/50 hover:border-primary/50 transition-smooth hover:shadow-elevated group animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
