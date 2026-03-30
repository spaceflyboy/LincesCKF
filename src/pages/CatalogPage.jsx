import { useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function CatalogPage() {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [
    { id: "all", label: t("catalog.all") },
    { id: "blouses", label: t("catalog.blouses") },
    { id: "dresses", label: t("catalog.dresses") },
    { id: "shirts", label: t("catalog.shirts") },
    { id: "scarves", label: t("catalog.scarves") },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeFilter === "all" || p.category === activeFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-800 mb-2">
            {t("catalog.title")}
          </h1>
          <p className="text-navy-400">{t("catalog.subtitle")}</p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? "bg-navy-800 text-white shadow-md"
                  : "bg-white text-navy-600 hover:bg-navy-50 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-navy-400 text-lg">{t("catalog.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
