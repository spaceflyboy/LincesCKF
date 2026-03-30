import { Target, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-navy-800 mb-2">
            {t("about.title")}
          </h1>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg mb-10">
          <img
            src="/images/about_workshop.png"
            alt="Linces'CKF Workshop"
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4 mb-10">
          <p className="text-navy-600 leading-relaxed">{t("about.story")}</p>
          <p className="text-navy-600 leading-relaxed">{t("about.story2")}</p>
          <p className="text-navy-600 leading-relaxed">{t("about.story3")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-gold-50 rounded-lg flex items-center justify-center mb-4">
              <Target size={24} className="text-gold-500" />
            </div>
            <h2 className="text-xl font-serif font-bold text-navy-800 mb-3">
              {t("about.mission")}
            </h2>
            <p className="text-sm text-navy-500 leading-relaxed">
              {t("about.missionText")}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-gold-50 rounded-lg flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-gold-500" />
            </div>
            <h2 className="text-xl font-serif font-bold text-navy-800 mb-3">
              {t("about.vision")}
            </h2>
            <p className="text-sm text-navy-500 leading-relaxed">
              {t("about.visionText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
