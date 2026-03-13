import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { SampleProductCard } from "../components/SampleProductCard";
import { useProducts } from "../hooks/useQueries";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export const SAMPLE_PRODUCTS = [
  {
    id: "sample-1",
    name: "Ferrari 250 GTO",
    description:
      "Authentic 1:18 scale replica of the iconic 1962 Ferrari 250 GTO, one of the most coveted sports cars ever built.",
    scaleSize: "1:18",
    price: 1200,
    image: "/assets/generated/ferrari-250-gto.dim_800x600.jpg",
  },
  {
    id: "sample-2",
    name: "Porsche 917K",
    description:
      "Die-cast replica of the legendary Le Mans-winning Porsche 917K with opening hood and detailed cockpit.",
    scaleSize: "1:18",
    price: 980,
    image: "/assets/generated/porsche-917k.dim_800x600.jpg",
  },
  {
    id: "sample-3",
    name: "Mercedes 300SL Gullwing",
    description:
      "Precision 1:43 scale model of the iconic 1955 Mercedes-Benz 300SL Gullwing with opening doors.",
    scaleSize: "1:43",
    price: 750,
    image: "/assets/generated/mercedes-300sl.dim_800x600.jpg",
  },
  {
    id: "sample-4",
    name: "Lamborghini Miura",
    description:
      "Stunning 1:43 die-cast of the 1966 Lamborghini Miura P400, the original supercar that defined an era.",
    scaleSize: "1:43",
    price: 680,
    image: "/assets/generated/lamborghini-miura.dim_800x600.jpg",
  },
  {
    id: "sample-5",
    name: "Jaguar E-Type",
    description:
      "Exquisite 1:18 scale model of the 1961 Jaguar E-Type Series 1, called the most beautiful car ever made.",
    scaleSize: "1:18",
    price: 890,
    image: "/assets/generated/jaguar-etype.dim_800x600.jpg",
  },
  {
    id: "sample-6",
    name: "Ferrari F40",
    description: "Ferrari F40 replica papercraft",
    scaleSize: "1:1",
    price: 12,
    image: "/assets/generated/ferrari-f40-papercraft.dim_800x600.jpg",
  },
  {
    id: "sample-7",
    name: "Nissan GTR Skyline",
    description: "Nissan GTR skyline replica papercraft",
    scaleSize: "1:1",
    price: 12,
    image: "/assets/generated/nissan-gtr-skyline-papercraft.dim_800x600.jpg",
  },
];

export function CatalogPage() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");

  const hasRealProducts = products && products.length > 0;

  const filtered = hasRealProducts
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.scaleSize.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    : SAMPLE_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.scaleSize.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      );

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 360 }}>
        <img
          src="/assets/generated/hero-banner.dim_1600x500.jpg"
          alt="Miniature Models Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 container mx-auto px-4 flex flex-col justify-center h-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.25em] text-white/70 font-body font-semibold mb-4 block">
              Precision Die-Cast Collectibles
            </span>
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-4"
              style={{ maxWidth: 560 }}
            >
              The Finest Scale
              <br />
              <em className="text-accent not-italic">Model Cars</em>
            </h1>
            <p className="text-white/75 font-body text-base max-w-md leading-relaxed">
              Authentic replicas of legendary automobiles, crafted with
              meticulous attention to detail for the passionate collector.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catalog */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Our Collection
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {isLoading ? "Loading..." : `${filtered.length} models available`}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="catalog.search_input"
            />
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="catalog.loading_state"
          >
            {SKELETON_IDS.map((id) => (
              <div
                key={id}
                className="bg-card rounded-lg overflow-hidden border border-border"
              >
                <Skeleton className="w-full" style={{ aspectRatio: "4/3" }} />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex justify-between pt-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-ocid="catalog.empty_state">
            <div className="inline-flex w-16 h-16 rounded-full bg-muted items-center justify-center mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No models found
            </h3>
            <p className="text-muted-foreground text-sm">
              {search
                ? `No results for "${search}"`
                : "The collection is empty."}
            </p>
          </div>
        ) : hasRealProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(filtered as typeof products).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <SampleProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
