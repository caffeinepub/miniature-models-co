import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

interface SampleProduct {
  id: string;
  name: string;
  description: string;
  scaleSize: string;
  price: number;
  image: string;
}

interface SampleProductCardProps {
  product: SampleProduct;
  index: number;
}

export function SampleProductCard({ product, index }: SampleProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      data-ocid={`catalog.product.item.${index + 1}`}
      className="group"
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border card-hover shadow-card">
        {/* Image */}
        <div
          className="relative overflow-hidden bg-muted"
          style={{ aspectRatio: "4/3" }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Scale badge */}
          <div className="absolute top-2 left-2">
            <span className="scale-badge text-white text-[10px] font-body font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
              {product.scaleSize}
            </span>
          </div>
          {/* Sample badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold opacity-80"
            >
              Sample
            </Badge>
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
              ${product.price.toLocaleString()}
            </span>
            <Button
              size="sm"
              disabled
              data-ocid="catalog.product.card.button"
              className="text-xs gap-1.5 h-8 opacity-60 cursor-not-allowed"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
