import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";

export function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();

  const handleCheckout = () => {
    toast.info("Checkout coming soon!");
  };

  if (items.length === 0) {
    return (
      <main
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="cart.empty_state"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Browse our collection and add some models to get started.
          </p>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/">Browse Collection</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => {
              const imageUrl = item.product.image?.getDirectURL();
              return (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  data-ocid={`cart.item.${i + 1}`}
                  className="flex gap-4 bg-card rounded-lg border border-border p-4"
                >
                  {/* Image */}
                  <div className="w-24 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mt-0.5">
                      Scale {item.product.scaleSize}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center border border-border rounded overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                        data-ocid={`cart.item.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <span className="font-display font-bold text-foreground">
                      $
                      {(
                        Number(item.product.price) * item.quantity
                      ).toLocaleString()}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      ${Number(item.product.price).toLocaleString()} each
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Order Summary
            </h2>
            <Separator className="mb-4" />
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">
                  Calculated at checkout
                </span>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="flex justify-between font-display font-bold text-lg mb-6">
              <span>Total</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <Button
              onClick={handleCheckout}
              data-ocid="cart.checkout_button"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Proceed to Checkout
            </Button>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
