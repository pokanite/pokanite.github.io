import { useTranslation } from "react-i18next";

export interface HeroSectionParams {
  name1: string;
  name2: string;
  location: string
  date: string;
  day: string;

}

export function HeroSection({ name1, name2, location }: HeroSectionParams) {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-parchment to-sand relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-olive/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-bark/5 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
          <div className="w-16 h-0.5 bg-sage mx-auto mb-8"></div>

          <div className="space-y-6 mb-12">
            <p className="text-lg md:text-xl text-sage uppercase tracking-wide">
              Заедно със своите семейства
            </p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl text-olivewood tracking-tight">
              {name1} и {name2}
            </h1>

            <p className="text-xl md:text-2xl text-bark max-w-2xl mx-auto leading-relaxed">
              имат удоволствието да ви поканят на тяхната сватба
            </p>
          </div>

          <div className="bg-wedding-white/90 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-xl border border-sand/50 max-w-md mx-auto">
            <div className="space-y-">
              <div className="text-sm uppercase tracking-wider text-sage">Запазете датата</div>
              <div className="text-3xl md:text-4xl text-olivewood">15 юни 2024</div>
              <div className="text-lg text-bark">Събота • 16:00</div>
              <div className="text-sm text-sage">{location}</div>
            </div>
          </div>
        </div>

        <div className="w-16 h-0.5 bg-sage mx-auto"></div>
      </div>
    </section>
  );
}
