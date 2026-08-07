import { useState, useEffect, useCallback } from "react";
import { FaTruck, FaHeadset, FaTag, FaWhatsapp, FaTimes } from "react-icons/fa";
import { MdCall } from "react-icons/md";

const MESSAGES = [
  { icon: FaTruck, text: "Free delivery on orders over ₦50,000" },
  { icon: FaTag, text: "New arrivals dropping every week" },
  { icon: FaHeadset, text: "Support available 9am–9pm daily" },
];

const ROTATE_INTERVAL = 4500;

const TopNav = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [isEntering, setIsEntering] = useState(true);

  const advance = useCallback(() => {
    setIsEntering(false);
    // let the exit transition finish before swapping content
    window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
      setIsEntering(true);
    }, 250);
  }, []);

  useEffect(() => {
    const interval = setInterval(advance, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [advance]);

  if (!isVisible) return null;

  const Icon = MESSAGES[index].icon;

  return (
    <div className="relative bg-linear-to-r from-[#f2592b] via-[#f2592b] to-[#e0742c] text-white">
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between gap-4">
        {/* Rotating message */}
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 min-w-0 flex-1"
        >
          <span
            className={`flex items-center gap-2 text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-250 ${
              isEntering
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1"
            }`}
          >
            <Icon className="text-[13px] shrink-0 opacity-90" />
            <span className="truncate">{MESSAGES[index].text}</span>
          </span>
        </div>

        {/* Contact + links — desktop only */}
        <div className="hidden lg:flex items-center gap-5 text-xs shrink-0">
          <a
            href="tel:+2347033360836"
            className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
          >
            <MdCall className="text-sm" />
            0703 336 0836
          </a>

          <a
            href="https://wa.me/2348139318929"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
          >
            <FaWhatsapp className="text-sm" />
            0813 931 8929
          </a>
          <span className="w-px h-3.5 bg-white/25" aria-hidden="true" />
          <a
            href="/contact"
            className="text-white/85 hover:text-white transition-colors"
          >
            Help
          </a>
          <a
            href="/orders"
            className="text-white/85 hover:text-white transition-colors"
          >
            Track Order
          </a>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement"
          className="p-1 -mr-1 text-white/70 hover:text-white transition-colors shrink-0"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default TopNav;
