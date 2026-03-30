import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const { t } = useLanguage();
  const featuredProducts = products.filter((p) => p.featured);

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

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-800 mb-3">
              {t("featured.title")}
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
    </div>
  );
}
