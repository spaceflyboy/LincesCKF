import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <h1 className="text-8xl font-serif font-bold text-gold-500 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-serif font-bold text-navy-800 mb-2">
          {t("notFound.title")}
        </h2>
        <p className="text-navy-400 mb-8 text-sm">{t("notFound.message")}</p>
        <Link
          to="/"
          className="btn-gold text-white px-8 py-3 rounded-lg font-semibold text-sm inline-flex items-center gap-2"
        >
          <Home size={18} />
          {t("notFound.goHome")}
        </Link>
      </div>
    </div>
  );
}
