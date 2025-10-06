import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Wine, Award, Utensils } from "lucide-react";

const timeline = [
    { time: "16:00", title: "Welcome Drink", description: "Гранд хотел Пловдив – площад „Централен“ №1", icon: Wine },
    { time: "17:00", title: "Сватбена церемония", description: "Гранд хотел Пловдив – площад „Централен“ №1", icon: Award },
    { time: "18:00", title: "Сватбена вечеря", description: "Гранд хотел Пловдив – площад „Централен“ №1", icon: Utensils },
];

export default function WeddingTimeline() {
    const [progress, setProgress] = useState(0);
    const timelineRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current || !itemsRef.current.length) return;

            const firstItem = itemsRef.current[0].getBoundingClientRect();
            const lastItem = itemsRef.current[itemsRef.current.length - 1].getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const totalHeight = lastItem.bottom - firstItem.top;
            const scrolled = Math.min(Math.max(0, windowHeight / 2 - firstItem.top) / totalHeight, 1);

            setProgress(scrolled);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getCircleColor = (idx) => {
        return idx / (timeline.length - 1) <= progress ? "bg-olivewood" : "bg-sage";
    };

    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            <h2 className="text-center text-3xl md:text-4xl mb-4 text-olivewood">
                Сватбена програма
            </h2>

            <div ref={timelineRef} className="relative">
                {/* Desktop vertical line */}
                <div
                    className="absolute top-0 left-1/2 w-1 -translate-x-1/2 bg-sand/50 rounded-full hidden sm:block z-0"
                    style={{
                        top: itemsRef.current.length
                            ? itemsRef.current[0].offsetTop + itemsRef.current[0].offsetHeight / 2
                            : 0,
                        height: itemsRef.current.length
                            ? itemsRef.current[itemsRef.current.length - 1].offsetTop +
                            itemsRef.current[itemsRef.current.length - 1].offsetHeight / 2 -
                            (itemsRef.current[0].offsetTop + itemsRef.current[0].offsetHeight / 2)
                            : "100%",
                    }}
                >
                    <motion.div
                        className="absolute left-0 top-0 w-full bg-olivewood rounded-full"
                        style={{ height: `${progress * 100}%` }}
                    />
                </div>

                {/* Mobile vertical line */}
                <div
                    className="absolute left-8 w-1 bg-sand/50 rounded-full sm:hidden"
                    style={{
                        top: itemsRef.current.length
                            ? itemsRef.current[0].offsetTop + itemsRef.current[0].offsetHeight / 2
                            : 0,
                        height: itemsRef.current.length
                            ? itemsRef.current[itemsRef.current.length - 1].offsetTop +
                            itemsRef.current[itemsRef.current.length - 1].offsetHeight / 2 -
                            (itemsRef.current[0].offsetTop + itemsRef.current[0].offsetHeight / 2)
                            : "100%",
                    }}
                >
                    <motion.div
                        className="absolute left-0 top-0 w-full bg-olivewood rounded-full"
                        style={{
                            height: `${progress * 100}%`,
                            transformOrigin: "top",
                        }}
                    />
                </div>

                {/* Timeline items */}
                <div className="flex flex-col gap-12 sm:gap-32">
                    {timeline.map((item, idx) => {
                        const isLeft = idx % 2 === 0;
                        const IconComponent = item.icon;

                        return (
                            <motion.div
                                key={idx}
                                ref={(el) => (itemsRef.current[idx] = el)}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative flex sm:justify-between items-start sm:items-center"
                            >
                                {/* Circle marker */}
                                <div
                                    className={`absolute sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-sand z-20 shadow-md ${getCircleColor(
                                        idx
                                    )}`}
                                    style={{
                                        left: window.innerWidth < 640 ? "34px" : undefined,
                                        top: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />

                                {/* Card */}
                                <div
                                    className={`p-6 rounded-2xl shadow-xl bg-wedding-white/90 backdrop-blur-sm border border-sand/50 w-full sm:w-[40%] ${isLeft
                                        ? "sm:mr-auto sm:text-right max-sm:ml-16"
                                        : "sm:ml-auto sm:text-left max-sm:ml-16"
                                        }`}
                                >
                                    <div
                                        className={`flex items-center gap-4 flex-row ${isLeft ? "sm:flex-row-reverse" : "sm:flex-row"
                                            }`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-sage flex items-center justify-center">
                                            <IconComponent className="w-6 h-6 text-olivewood" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-sage font-semibold">{item.time}</p>
                                            <h4 className="text-lg font-bold text-olivewood">{item.title}</h4>
                                            <p className="text-bark text-sm mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* <div className="h-12 sm:h-32" /> */}
            </div>
        </div>
    );
}
