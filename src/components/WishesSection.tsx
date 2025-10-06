import { Gift, Flower2 } from "lucide-react";

export default function WishesSection() {
    return (
        <section
            id="wishes"
            className="text-olivewood py-16 px-4 flex flex-col items-center"
        >
            <div className="max-w-5xl text-center">
                <h2 className="text-3xl md:text-4xl text-olivewood mb-10">Пожелания</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 gap-8">
                    {/* Flowers Card */}
                    <div className="bg-wedding-white p-8 border border-sand shadow-xl rounded-md flex flex-col items-center">
                        <Flower2 className="w-10 h-10 text-sage mb-4" />
                        <h3 className="text-2xl font-medium mb-3">Без цветя</h3>
                        <p className="text-bark leading-relaxed">
                            Цветята ще увяхнат, но усмивките ви ще останат в сърцата ни.
                            Молим ви, не носете цветя – вашето присъствие е най-големият подарък.
                        </p>
                    </div>

                    {/* Gifts Card */}
                    <div className="bg-wedding-white p-8 border border-sand shadow-xl rounded-md flex flex-col items-center">
                        <Gift className="w-10 h-10 text-sage mb-4" />
                        <h3 className="text-2xl font-medium mb-3">Подаръци</h3>
                        <p className="text-bark leading-relaxed">
                            Вместо цветя или предметни подаръци, ще се радваме на
                            <span className="font-medium text-sage"> паричен подарък</span>,
                            който ще ни помогне да създадем още красиви спомени заедно.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
