"use client";

import { useRef, useState, useEffect, useCallback, useMemo, memo, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GlossaryTerm } from "@/lib/glossary";

interface GlossaryFilterProps {
  terms: GlossaryTerm[];
  categories: string[];
}

const GlossaryCard = memo(function GlossaryCard({ item }: { item: GlossaryTerm }) {
  return (
    <div className="relative group">
      <Link
        href={`/glossary/${item.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Read definition for ${item.term}`}
      >
        <span className="sr-only">Read definition for {item.term}</span>
      </Link>
      <Card className="hover:border-primary/50 transition-colors h-full flex flex-col group-hover:border-primary/50">
        <CardHeader className="pb-3">
          <dt className="text-lg font-semibold leading-none tracking-tight">
            {item.term}
          </dt>
          <span className="text-xs text-muted-foreground/60 mt-1.5">
            {item.category}
          </span>
        </CardHeader>
        <CardContent className="flex-grow">
          <dd className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {item.definition}
          </dd>
        </CardContent>
      </Card>
    </div>
  );
});

export function GlossaryFilter({ terms, categories }: GlossaryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [isPending, startTransition] = useTransition();

  const allCategories = useMemo(() => ["All", ...categories], [categories]);

  const filteredTerms = useMemo(
    () =>
      activeCategory === "All"
        ? terms
        : terms.filter((t) => t.category === activeCategory),
    [activeCategory, terms]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: terms.length };
    for (const t of terms) {
      const cat = t.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [terms]);

  const updateSlider = useCallback(() => {
    const activeButton = buttonRefs.current.get(activeCategory);
    const container = tabsRef.current;
    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      setSliderStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    updateSlider();
  }, [updateSlider]);

  const handleCategoryClick = useCallback((category: string) => {
    startTransition(() => {
      setActiveCategory(category);
    });
  }, []);



  return (
    <>
      {/* Segmented Filter Tabs */}
      <div className="flex justify-center mb-12">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Glossary categories"
          className="relative inline-flex items-center rounded-lg border border-border/60 bg-secondary/20 p-1"
        >
          {/* Sliding highlight */}
          <div
            className="absolute top-1 bottom-1 rounded-md bg-primary shadow-sm transition-all duration-300 ease-out z-0 pointer-events-none"
            style={sliderStyle}
          />

          {allCategories.map((category) => (
            <button
              key={category}
              id={`category-tab-${category.toLowerCase().replace(/\s+/g, "-")}`}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls="glossary-terms-grid"
              ref={(el) => {
                if (el) buttonRefs.current.set(category, el);
              }}
              onClick={() => handleCategoryClick(category)}
              className={`
                relative z-10 px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer
                ${
                  activeCategory === category
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {category}
              <span
                className={`ml-1.5 text-xs tabular-nums ${
                  activeCategory === category
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground/50"
                }`}
              >
                {categoryCounts[category] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <dl
        id="glossary-terms-grid"
        role="tabpanel"
        aria-labelledby={`category-tab-${activeCategory.toLowerCase().replace(/\s+/g, "-")}`}
        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-opacity duration-150 ${isPending ? 'opacity-60' : 'opacity-100'}`}
      >
        {filteredTerms.map((item) => (
          <GlossaryCard key={item.slug} item={item} />
        ))}
      </dl>

      {/* Count indicator */}
      <p className="text-center text-sm text-muted-foreground/50 mt-8">
        Showing {filteredTerms.length} of {terms.length} terms
      </p>
    </>
  );
}
