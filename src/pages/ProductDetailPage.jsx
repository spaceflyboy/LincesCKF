import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Check, ArrowLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-navy-800 mb-2">
            {t("productDetail.notFound")}
          </h1>
          <Link
            to="/catalog"
            className="text-gold-500 hover:text-gold-600 font-medium text-sm"
          >
            {t("productDetail.backToCatalog")}
          </Link>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
          <Link to="/" className="hover:text-gold-500 transition-colors">
            {t("nav.home")}
          </Link>
          <ChevronRight size={14} />
          <Link to="/catalog" className="hover:text-gold-500 transition-colors">
            {t("nav.catalog")}
          </Link>
          <ChevronRight size={14} />
          <span className="text-navy-700 font-medium">
            {product.name[language]}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in-up">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img
              src={product.image}
              alt={product.name[language]}
              className="w-full aspect-square object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-gold-50 text-gold-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 w-fit">
              {t(`catalog.${product.category}`)}
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-800 mb-4">
              {product.name[language]}
            </h1>

            <p className="text-navy-500 leading-relaxed mb-6 text-base">
              {product.description[language]}
            </p>

            <p className="text-3xl font-bold text-navy-800 mb-8">
              ${product.price.toFixed(2)}
            </p>

            <button
              onClick={handleAdd}
              disabled={added}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm transition-all cursor-pointer w-full sm:w-auto ${
                added ? "bg-green-500 text-white" : "btn-gold text-white"
              }`}
            >
              {added ? (
                <>
                  <Check size={18} />
                  {t("catalog.added")}
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  {t("catalog.addToCart")}
                </>
              )}
            </button>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-gold-500 transition-colors mt-6"
            >
              <ArrowLeft size={16} />
              {t("productDetail.backToCatalog")}
            </Link>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold text-navy-800 mb-6">
              {t("productDetail.relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="product-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 block"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={p.image}
                      alt={p.name[language]}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-navy-800 mb-1">
                      {p.name[language]}
                    </h3>
                    <span className="text-lg font-bold text-navy-800">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
