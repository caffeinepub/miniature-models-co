import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useProduct } from "../hooks/useQueries";

export function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const { data: product, isLoading, isError } = useProduct(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-5 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton
            className="w-full rounded-lg"
            style={{ aspectRatio: "4/3" }}
          />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/" className="text-primary underline mt-2 inline-block">
          Back to catalog
        </Link>
      </main>
    );
  }

  const imageUrl = product.image?.getDirectURL();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Collection
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-lg overflow-hidden bg-secondary border border-border"
          style={{ aspectRatio: "4/3" }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                viewBox="0 0 80 60"
                className="w-32 h-24 text-muted-foreground/30"
                fill="currentColor"
                aria-hidden="true"
                role="img"
              >
                <title>Car placeholder</title>
                <rect x="5" y="20" width="70" height="28" rx="6" />
                <rect x="15" y="12" width="30" height="16" rx="4" />
                <circle cx="20" cy="52" r="8" />
                <circle cx="60" cy="52" r="8" />
              </svg>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-center"
        >
          <Badge
            variant="secondary"
            className="w-fit mb-3 font-body font-semibold text-xs tracking-wider uppercase"
          >
            Scale {product.scaleSize}
          </Badge>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-muted-foreground font-body leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="border-t border-border pt-6">
            <div className="text-3xl font-display font-bold text-foreground mb-6">
              ${Number(product.price).toLocaleString()}
            </div>

            {/* Qty selector */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Math.min(99, Number(e.target.value))))
                  }
                  className="w-14 h-10 text-center font-body font-semibold bg-card text-foreground border-x border-border focus:outline-none"
                  data-ocid="product.quantity_input"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              data-ocid="product.add_button"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
