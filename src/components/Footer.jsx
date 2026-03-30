import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="text-xl font-serif font-bold text-white">
                Linces'
              </span>
              <span className="text-xl font-serif font-bold text-gold-400">
                CKF
              </span>
            </Link>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4 font-sans">
              {t("footer.catalog")}
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/catalog"
                className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
              >
                {t("nav.catalog")}
              </Link>
              <Link
                to="/services"
                className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
              >
                {t("nav.services")}
              </Link>
              <Link
                to="/custom-orders"
                className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
              >
                {t("nav.customOrders")}
              </Link>
              <Link
                to="/about"
                className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
              >
                {t("nav.aboutUs")}
              </Link>
              <Link
                to="/contact"
                className="text-sm text-navy-300 hover:text-gold-400 transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4 font-sans">
              {t("footer.followUs")}
            </h3>
            <div className="flex gap-4 justify-end">
              <a
                href="#"
                className="text-navy-300 hover:text-gold-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-navy-300 hover:text-gold-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-navy-300 hover:text-gold-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-8 pt-8 text-center">
          <p className="text-xs text-navy-400">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
