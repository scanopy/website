import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Network Engineer",
    company: "TechCorp",
    content: "NetVisor has transformed how we document our infrastructure. What used to take days now happens automatically in minutes.",
    initials: "AC",
  },
  {
    name: "Sarah Johnson",
    role: "IT Director",
    company: "Global Systems Inc",
    content: "The visual diagrams are incredible. Finally, a tool that makes network documentation accessible to everyone on our team.",
    initials: "SJ",
  },
  {
    name: "Michael Rodriguez",
    role: "DevOps Lead",
    company: "CloudScale",
    content: "Real-time monitoring and automatic service detection saved us from a major outage. NetVisor paid for itself in the first week.",
    initials: "MR",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Loved by Network Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what professionals are saying about NetVisor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="gradient-card border border-border/50 hover:border-primary/50 transition-smooth hover:shadow-elevated group animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 space-y-6">
                <Quote className="w-8 h-8 text-primary/30 group-hover:text-primary/50 transition-smooth" />
                
                <p className="text-foreground leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
