import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend";
import { useCart } from "../contexts/CartContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();
  const imageUrl = product.image?.getDirectURL();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      data-ocid={`catalog.product.item.${index + 1}`}
      className="group"
    >
      <Link to="/product/$id" params={{ id: product.id }}>
        <div className="bg-card rounded-lg overflow-hidden border border-border card-hover shadow-card">
          {/* Image */}
          <div
            className="relative overflow-hidden bg-muted"
            style={{ aspectRatio: "4/3" }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <svg
                  viewBox="0 0 80 60"
                  className="w-24 h-24 text-muted-foreground/30"
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
            {/* Scale badge */}
            <div className="absolute top-2 left-2">
              <span className="scale-badge text-white text-[10px] font-body font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
                {product.scaleSize}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-foreground text-base leading-tight truncate mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 font-body">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-lg text-foreground">
                ${Number(product.price).toLocaleString()}
              </span>
              <Button
                size="sm"
                onClick={handleAddToCart}
                data-ocid="catalog.product.card.button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 h-8"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
