import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display font-semibold text-foreground">
              Miniature Models Co.
            </span>
            <span className="text-xs text-muted-foreground">
              Precision die-cast models for discerning collectors
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              &copy; {year}. Built with{" "}
              <Heart className="w-3 h-3 fill-primary text-primary" /> using{" "}
              <a
                href={utmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
