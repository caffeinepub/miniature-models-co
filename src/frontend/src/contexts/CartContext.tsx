import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product } from "../backend";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = "miniature_models_cart";

function serializeCart(items: CartItem[]): string {
  return JSON.stringify(
    items.map((i) => ({
      product: {
        ...i.product,
        price: i.product.price.toString(),
        createdAt: i.product.createdAt.toString(),
        image: i.product.image ? i.product.image.getDirectURL() : undefined,
      },
      quantity: i.quantity,
    })),
  );
}

function deserializeCart(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw) as Array<{
      product: {
        id: string;
        name: string;
        description: string;
        scaleSize: string;
        price: string;
        createdAt: string;
        image?: string;
      };
      quantity: number;
    }>;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ExternalBlob } = require("../backend") as {
      ExternalBlob: typeof import("../backend").ExternalBlob;
    };
    return parsed.map((i) => ({
      product: {
        ...i.product,
        price: BigInt(i.product.price),
        createdAt: BigInt(i.product.createdAt),
        image: i.product.image
          ? ExternalBlob.fromURL(i.product.image)
          : undefined,
      } as Product,
      quantity: i.quantity,
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? deserializeCart(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, serializeCart(items));
  }, [items]);

  const addItem = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: qty } : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce(
    (s, i) => s + Number(i.product.price) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
