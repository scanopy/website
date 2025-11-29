import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

interface Service {
  name: string;
  category: string;
  description: string;
  discovery_pattern: string;
  logo_url: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/services.json")
      .then((res) => res.json())
      .then((data: Service[]) => {
        setServices(data);
        const uniqueCategories = Array.from(new Set(data.map((s) => s.category)));
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Failed to load services:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <a href="/">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </a>
          </Button>
          
          <h1 className="font-display text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NetVisor
          </h1>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Badge variant="secondary" className="mb-4">
                <Code2 className="w-3 h-3 mr-1" />
                Service Detection
              </Badge>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Supported Services
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                NetVisor automatically detects and documents {services.length}+ services 
                running on your network. Here's what we can discover for you.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {categories.map((category) => {
              const categoryServices = services.filter((s) => s.category === category);
              
              return (
                <div key={category} className="mb-16">
                  <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {category}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {categoryServices.length}
                    </Badge>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service, index) => (
                      <Card
                        key={index}
                        className="gradient-card border border-border/50 hover:border-primary/50 transition-smooth hover:shadow-elevated group animate-in fade-in slide-in-from-bottom-4 duration-700"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CardHeader className="space-y-4">
                          <div className="flex items-center gap-4">
                            {service.logo_url && (
                              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                  src={service.logo_url}
                                  alt={`${service.name} logo`}
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                          </div>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Discovery Pattern
                            </p>
                            <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto text-foreground/80">
                              {service.discovery_pattern}
                            </code>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            {services.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Missing a Service?
              </h2>
              <p className="text-lg text-muted-foreground">
                We're constantly adding support for new services. 
                Request a new service detection or contribute to the project on GitHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a
                    href="https://github.com/mayanayza/netvisor/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Request a Service
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://github.com/mayanayza/netvisor"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contribute on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
