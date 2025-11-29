import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface GitHubStarsProps {
  repo: string;
}

export const GitHubStars = ({ repo }: GitHubStarsProps) => {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, [repo]);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg shadow-sm">
        <Star className="w-4 h-4 text-muted-foreground animate-pulse" />
        <span className="text-sm font-medium text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-smooth hover:border-primary group"
    >
      <Star className="w-4 h-4 text-accent fill-accent group-hover:scale-110 transition-smooth" />
      <span className="text-sm font-semibold text-foreground">
        {stars?.toLocaleString() || "0"}
      </span>
      <span className="text-sm text-muted-foreground">stars</span>
    </a>
  );
};
