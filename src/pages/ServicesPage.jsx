import { Link } from "react-router-dom";
import {
  MessageCircle,
  Pencil,
  Factory,
  Truck,
  Star,
  Shield,
  Settings,
  Award,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  const steps = [
    {
      num: 1,
      icon: MessageCircle,
      title: t("services.step1Title"),
      desc: t("services.step1Desc"),
    },
    {
      num: 2,
      icon: Pencil,
      title: t("services.step2Title"),
      desc: t("services.step2Desc"),
    },
    {
      num: 3,
      icon: Factory,
      title: t("services.step3Title"),
      desc: t("services.step3Desc"),
    },
    {
      num: 4,
      icon: Truck,
      title: t("services.step4Title"),
      desc: t("services.step4Desc"),
    },
  ];

  const features = [
    {
      icon: Star,
      title: t("services.feature1"),
      desc: t("services.feature1Desc"),
    },
    {
      icon: Award,
      title: t("services.feature2"),
      desc: t("services.feature2Desc"),
    },
    {
      icon: Settings,
      title: t("services.feature3"),
      desc: t("services.feature3Desc"),
    },
    {
      icon: Shield,
      title: t("services.feature4"),
      desc: t("services.feature4Desc"),
    },
  ];

  return (
    <div>
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/services_hero.png"
            alt="Manufacturing services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-900/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4 animate-fade-in-up">
            {t("services.title")}
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.num}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gold-50 rounded-full flex items-center justify-center">
                  <step.icon size={28} className="text-gold-500" />
                </div>
                <div className="text-xs font-bold text-gold-500 mb-1 uppercase tracking-widest">
                  {t("services.stepLabel")} {step.num}
                </div>
                <h3 className="text-lg font-serif font-semibold text-navy-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-navy-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="btn-gold text-white px-10 py-3 rounded-lg font-semibold text-sm inline-block"
            >
              {t("services.requestQuote")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-navy-800 mb-3">
              {t("services.whyChoose")}
            </h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={22} className="text-gold-400" />
                </div>
                <h3 className="text-base font-semibold text-navy-800 mb-2 font-sans">
                  {feature.title}
                </h3>
                <p className="text-sm text-navy-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
