import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ThumbsUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingPlan {
  name: string;
  id: string;
  description: string;
  icon: string;
  color: string;
  metadata: {
    features: Record<string, boolean>;
    is_commercial: boolean;
  };
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface PricingData {
  billing_plans: PricingPlan[];
  features: Feature[];
}

const iconMap: Record<string, any> = {
  ThumbsUp,
  Zap,
};

export const Pricing = () => {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);

  useEffect(() => {
    fetch("/data/pricing.json")
      .then((res) => res.json())
      .then((data) => setPricingData(data))
      .catch((err) => console.error("Failed to load pricing data:", err));
  }, []);

  if (!pricingData) {
    return (
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading pricing...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for you. All plans include core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingData.billing_plans.map((plan, index) => {
            const Icon = iconMap[plan.icon] || ThumbsUp;
            const planFeatures = pricingData.features.filter(
              (feature) => plan.metadata.features[feature.id]
            );

            return (
              <Card
                key={plan.id}
                className={`gradient-card border border-border/50 hover:border-primary/50 transition-smooth hover:shadow-elevated group animate-in fade-in slide-in-from-bottom-4 duration-700 ${
                  index === 1 ? "ring-2 ring-primary/20" : ""
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    {index === 1 && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {planFeatures.length > 0 && (
                    <ul className="space-y-3">
                      {planFeatures.map((feature) => (
                        <li key={feature.id} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{feature.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    className="w-full"
                    variant={index === 1 ? "default" : "outline"}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
