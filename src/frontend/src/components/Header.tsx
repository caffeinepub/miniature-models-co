import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Settings, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export function Header() {
  const { totalCount } = useCart();
  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();

  // Show Admin link if user is admin, or if not logged in yet (so they can log in via /admin)
  const showAdminLink = isAdmin || !identity;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.home_link"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">
              M
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-semibold text-base text-foreground tracking-tight">
              Miniature Models
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-body">
              Co.
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            data-ocid="nav.home_link"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Catalog
          </Link>
          {showAdminLink && (
            <Link to="/admin" data-ocid="nav.admin_link">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {showAdminLink && (
            <Link to="/admin" data-ocid="nav.admin_link" className="md:hidden">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          )}
          <Link
            to="/cart"
            data-ocid="nav.cart_link"
            className="relative flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {totalCount > 0 && (
              <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                {totalCount > 99 ? "99+" : totalCount}
              </Badge>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
