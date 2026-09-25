"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { UTILITIES, type UtilityCategory } from "@/config/utilities";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<UtilityCategory | "all">("all");

  // Client-side filtering (Privacy-first: no server requests)
  const filteredUtilities = useMemo(() => {
    return Object.values(UTILITIES).filter((utility) => {
      const matchesSearch = 
        utility.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        utility.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === "all" || utility.category === activeCategory;

      return utility.status === "live" && matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories: (UtilityCategory | "all")[] = ["all", "developer", "text", "image", "calculator", "generator"];

  function getCategoryLabel(cat: UtilityCategory | "all") {
    if (cat === "all") return "All Utilities";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* 1. Hero & Search-First Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            BUMIVERSA
          </h1>
          <p className="mt-3 text-xl font-medium text-zinc-600">
            Global Utility Network
          </p>
          
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="What do you want to do? (e.g., JSON, Base64, JWT...)"
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* 3. Dynamic Toolshelf Grid */}
        <div className="space-y-6">
          {filteredUtilities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-12 text-center">
              <p className="text-zinc-500">No utilities found matching &quot;{searchQuery}&quot;.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-2 text-sm font-medium text-zinc-900 underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUtilities.map((utility) => (
                <Link 
                  key={utility.id} 
                  href={`/tools/${utility.id}`}
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-400 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-700/10">
                      {utility.category}
                    </span>
                    <svg className="h-5 w-5 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <h2 className="mt-3 text-lg font-semibold text-zinc-900">
                    {utility.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
                    {utility.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 4. Privacy Baseline Footer */}
        <div className="mt-16 border-t border-zinc-100 pt-8 text-center">
          <div className="mx-auto flex max-w-md items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Privacy-first Architecture</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                All tools process data locally in your browser. We do not upload, store, or transmit your data to any server.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

