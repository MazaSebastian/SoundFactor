"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import ProductCard, { type ProductCardData } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TopProductsCarouselProps {
    products: ProductCardData[];
}

export default function TopProductsCarousel({ products }: TopProductsCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!products || products.length === 0) return null;

    const getVisibleProducts = () => {
        const visible = [];
        const n = products.length;
        for (let offset = -2; offset <= 2; offset++) {
            const index = (activeIndex + offset + n) % n;
            visible.push({ product: products[index], offset });
        }
        return visible;
    };

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % products.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.x < -50) {
            handlePrev();
        } else if (info.offset.x > 50) {
            handleNext();
        }
    };

    return (
        <div
            className="relative w-full max-w-[100vw] mx-auto h-screen flex items-center justify-center overflow-hidden"
            style={{ perspective: "1000px" }}
        >
            <AnimatePresence initial={false} mode="popLayout">
                {products.map((product, index) => {
                    // Calculate the shortest circular offset
                    let offset = index - activeIndex;
                    if (offset > Math.floor(products.length / 2)) {
                        offset -= products.length;
                    } else if (offset < -Math.floor(products.length / 2)) {
                        offset += products.length;
                    }

                    // Limit visible items to +/- 2 to avoid clutter
                    if (Math.abs(offset) > 2) return null;

                    const abs = Math.abs(offset);
                    const sign = Math.sign(offset);

                    // Position calculations matching Apple styling:
                    // Center: x=0, rot=0, scale=1
                    // +/- 1: 220px offset
                    // +/- 2: 380px offset
                    const xOffset = abs === 1 ? 220 : abs === 2 ? 380 : 0;
                    const x = sign * xOffset;
                    const rotateY = sign * -25;
                    const scale = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.75;
                    const zIndex = 50 - abs * 10;
                    const opacity = abs === 2 ? 0.3 : abs === 1 ? 0.7 : 1;

                    return (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                                x: sign ? sign * 500 : 0,
                                rotateY: sign * -45
                            }}
                            animate={{ opacity, scale, x, rotateY, zIndex }}
                            exit={{
                                opacity: 0,
                                scale: 0.5,
                                x: sign ? sign * 500 : 0,
                                rotateY: sign * -45,
                                zIndex: 0
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                mass: 1
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            onClick={() => {
                                if (offset !== 0) {
                                    setActiveIndex((prev) => (prev + offset + products.length) % products.length);
                                }
                            }}
                            className="absolute w-[280px] md:w-[340px] h-fit cursor-pointer will-change-transform"
                            style={{
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <div
                                className={`w-full h-full relative rounded-2xl transition-all duration-300 ${abs === 0 ? "filter-none shadow-2xl shadow-[var(--neon-green)]/20" : "grayscale-[40%]"
                                    }`}
                                style={{
                                    pointerEvents: offset === 0 ? "auto" : "none",
                                    backgroundColor: "var(--bg-primary)"
                                }}
                            >
                                <div className="pointer-events-none absolute inset-0 rounded-2xl z-50">
                                    {abs !== 0 && (
                                        <div className="w-full h-full bg-gradient-to-tr from-black/20 to-transparent rounded-2xl md:bg-black/40" />
                                    )}
                                </div>
                                <ProductCard product={product} />
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Manual Navigation buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-4 md:left-12 z-[100] p-3 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white hover:border-[var(--neon-green)] hover:bg-black/80 backdrop-blur-md transition-all hidden md:block"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 md:right-12 z-[100] p-3 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white hover:border-[var(--neon-green)] hover:bg-black/80 backdrop-blur-md transition-all hidden md:block"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

        </div>
    );
}
