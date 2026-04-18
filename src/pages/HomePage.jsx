import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Tag } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { apiGetHomeData } from "../utils/api";
import ProductCard from "../components/ProductCard";

function mapProduct(p) {
  return {
    id: p.id,
    name: { en: p.name_en, es: p.name_es },
    description: { en: p.description_en, es: p.description_es },
    price: parseFloat(p.price),
    category: p.category,
    image: p.image,
    featured: p.featured,
    sizes: p.sizes,
  };
}

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await apiGetHomeData();
      setFeaturedProducts((data.featuredProducts || []).map(mapProduct));
      setRecommendedProducts((data.recommendedProducts || []).map(mapProduct));
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch homepage data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero_silk.png"
            alt="Luxury silk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 via-navy-900/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-white mb-4 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="btn-gold text-white px-8 py-3 rounded-lg font-semibold text-sm flex items-center gap-2"
              >
                {t("hero.shopCollection")}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all"
              >
                {t("hero.ourServices")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by category — from database */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-navy-800 mb-10">
            {t("home.shopByCategory")}
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                  className="group rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-6 text-center shadow-sm hover:border-gold-300 hover:bg-white hover:shadow-md transition-all"
                >
                  <span className="text-sm font-semibold capitalize tracking-wide text-navy-700 group-hover:text-gold-600">
                    {t(`catalog.${cat.name}`) !== `catalog.${cat.name}`
                      ? t(`catalog.${cat.name}`)
                      : cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special offers — spotlight on featured inventory */}
      <section className="py-16 bg-gradient-to-b from-gold-50 to-white border-y border-gold-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-semibold uppercase tracking-wider mb-2">
                <Tag size={14} />
                {t("home.offersBadge")}
              </div>
              <h2 className="text-3xl font-serif font-bold text-navy-800">
                {t("home.specialOffers")}
              </h2>
              <p className="text-navy-500 mt-2 max-w-xl text-sm leading-relaxed">
                {t("home.specialOffersDesc")}
              </p>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-navy-800 font-semibold text-sm hover:text-gold-600 shrink-0"
            >
              {t("home.viewOffers")}
              <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={`offer-${product.id}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-800 mb-3">
              {t("featured.title")}
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-gold-500 font-semibold hover:text-gold-600 transition-colors"
            >
              {t("featured.viewAll")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Data-driven recommendations (top-rated from API) */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={14} />
              {t("home.personalizedBadge")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-800 mb-3">
              {t("home.recommendedTitle")}
            </h2>
            <p className="text-navy-500 text-sm max-w-2xl mx-auto leading-relaxed">
              {t("home.recommendedDesc")}
            </p>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {recommendedProducts.map((product) => (
                <ProductCard key={`rec-${product.id}`} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
