import { useEffect, useRef } from "react";
import {Link} from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mapImg from "../assets/map-img.jpg";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 100, suffix: "%", label: "Satisfactions Clients" },
  { value: 500, suffix: "+", label: "Property sells" },
  { value: 150, suffix: "+", label: "Countries & Cities" },
  { value: 200, suffix: "+", label: "Positive reviews", display: "2,00+" },
];

const StatsAndDiscover = () => {
  const countersRef = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      countersRef.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].value;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            const formatted =
              i === 3
                ? Math.floor(obj.val).toLocaleString("en-IN") // "2,00" style
                : Math.floor(obj.val);
            el.textContent = formatted + stats[i].suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="container">
    <section ref={sectionRef} className="bg-white mt-30">

      {/* ── Stats Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-y-8 mb-22">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-stretch gap-6">
            <div className="flex flex-col gap-1">
              <span
                ref={(el) => (countersRef.current[i] = el)}
                className="text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none"
              >
                0{stat.suffix}
              </span>
              <span className="text-sm text-gray-500 mt-1">{stat.label}</span>
            </div>
            {i < stats.length - 1 && (
              <div className="hidden sm:block w-px bg-gray-200 self-stretch mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* ── Discover Card ── */}
      <div className="overflow-hidden flex flex-col lg:flex-row">

        {/* Map Image */}
        <div className="w-full lg:w-1/2 h-72 lg:h-auto relative">
          <img
            src={mapImg}
            alt="Dream Home Location"
            className="w-full h-full object-cover rounded-3xl"
          />
          {/* Dream Home pin overlay */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-white">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                  fill="#ef4444" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 21V12h6v9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="bg-green-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
              Dream Home 😊
            </div>
            <div className="w-0.5 h-3 bg-green-400 rounded-full" />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-14 py-10 lg:py-16">
          <h2 className="heading-lg mb-4">
            Discover Properties with<br className="hidden lg:block" /> the Best Value
          </h2>
          <p className="text-gray-500 text-sm lg:text-base leading-relaxed mb-8 max-w-sm">
            From minimalist interiors to compact solutions, small spaces inspire big
            ideas, proving that you don't need much room.
          </p>
          <div>
            <Link to="/allProperties" className="btn-secondary">
              Find Best Properties
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
    </div>
  );
};

export default StatsAndDiscover;