import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { apiGetProducts } from "../utils/api";
import ProductCard from "../components/ProductCard";

export default function CatalogPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const categories = [
    { id: "all", label: t("catalog.all") },
    { id: "blouses", label: t("catalog.blouses") },
    { id: "dresses", label: t("catalog.dresses") },
    { id: "shirts", label: t("catalog.shirts") },
    { id: "scarves", label: t("catalog.scarves") },
  ];

  useEffect(() => {
    if (!categoryParam) return;
    const match = categories.find((c) => c.id === categoryParam);
    if (match) setActiveFilter(match.id);
  }, [categoryParam]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch products from backend API whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search input
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery, sortBy, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiGetProducts({
        category: activeFilter,
        search: searchQuery,
        sort: sortBy,
        page: pagination.page,
        limit: 12,
      });

      // Map backend product format to frontend format
      const mapped = data.products.map((p) => ({
        id: p.id,
        name: { en: p.name_en, es: p.name_es },
        description: { en: p.description_en, es: p.description_es },
        price: parseFloat(p.price),
        category: p.category,
        image: p.image,
        featured: p.featured,
        sizes: p.sizes,
      }));
      setProducts(mapped);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.pagination.totalPages,
      }));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination when filter/search changes
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

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
              onChange={handleSearchChange}
              placeholder={t("catalog.searchPlaceholder")}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange(cat.id)}
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

        {/* Sort controls */}
        <div className="flex justify-end mb-6">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-navy-600 focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="animate-fade-in-up">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination((prev) => ({ ...prev, page }))}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      pagination.page === page
                        ? "bg-navy-800 text-white"
                        : "bg-white text-navy-600 border border-gray-200 hover:bg-navy-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-navy-400 text-lg">{t("catalog.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
