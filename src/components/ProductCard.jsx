import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Check } from "lucide-react";
import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <Link
        to={`/product/${product.id}`}
        className="block aspect-square overflow-hidden bg-gray-50"
      >
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-lg font-semibold text-navy-800 mb-1 hover:text-gold-500 transition-colors">
            {product.name[language]}
          </h3>
        </Link>
        <p className="text-sm text-navy-400 mb-3 line-clamp-2">
          {product.description[language]}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-navy-800">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={added}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              added ? "bg-green-500 text-white" : "btn-gold text-white"
            }`}
          >
            {added ? (
              <>
                <Check size={16} />
                {t("catalog.added")}
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                {t("catalog.addToCart")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.shape({
      en: PropTypes.string.isRequired,
      es: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.shape({
      en: PropTypes.string.isRequired,
      es: PropTypes.string.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    featured: PropTypes.bool,
  }).isRequired,
};
