import React from "react";
import sgcLogoImg from "../assets/images/sgc_logo_transparent.png";

interface SGCLogoProps {
  variant?: "emblem" | "horizontal" | "vertical" | "full";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "custom";
  className?: string;
  showSubtitle?: boolean;
}

export const SGCLogo: React.FC<SGCLogoProps> = ({
  variant = "horizontal",
  size = "md",
  className = "",
  showSubtitle = true,
}) => {
  // Size presets
  const emblemSizes = {
    xs: "w-7 h-7",
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
    "2xl": "w-28 h-28",
    custom: "",
  };

  const textSizes = {
    xs: { title: "text-xs", sub: "text-[9px]", tracking: "tracking-wider" },
    sm: {
      title: "text-sm font-black",
      sub: "text-[10px]",
      tracking: "tracking-widest",
    },
    md: {
      title: "text-base font-black sm:text-lg",
      sub: "text-[11px]",
      tracking: "tracking-widest",
    },
    lg: {
      title: "text-xl font-black sm:text-2xl",
      sub: "text-xs",
      tracking: "tracking-widest",
    },
    xl: {
      title: "text-2xl font-black sm:text-3xl",
      sub: "text-sm",
      tracking: "tracking-widest",
    },
    "2xl": {
      title: "text-3xl font-black sm:text-4xl",
      sub: "text-base",
      tracking: "tracking-widest",
    },
    custom: { title: "", sub: "", tracking: "" },
  };

  const renderEmblem = (customClass = "") => (
    <div
      className={`relative shrink-0 ${customClass || emblemSizes[size] || "w-10 h-10"}`}
    >
      <img
        src={sgcLogoImg}
        alt="SGC Logo"
        className="w-full h-full object-contain drop-shadow-sm select-none dark:invert dark:hue-rotate-180 dark:contrast-125"
      />
    </div>
  );

  // Variant: Emblem only
  if (variant === "emblem") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  // Variant: Vertical Stack (Like the uploaded original image)
  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {renderEmblem(
          size === "2xl"
            ? "w-32 h-32 sm:w-40 sm:h-40"
            : size === "xl"
              ? "w-24 h-24 sm:w-28 sm:h-28"
              : "w-16 h-16 sm:w-20 sm:h-20",
        )}

        <div className="mt-3">
          <h1
            className={`font-display font-black tracking-wider text-slate-900 dark:text-white uppercase leading-tight ${textSizes[size].title}`}
          >
            SEWA GENSET CIREBON
          </h1>

          {showSubtitle && (
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[2px] w-6 sm:w-10 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
              <span
                className={`font-extrabold tracking-widest text-amber-600 dark:text-amber-500 uppercase ${textSizes[size].sub}`}
              >
                INDONESIA
              </span>
              <span className="h-[2px] w-6 sm:w-10 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant: Full image-like presentation
  if (variant === "full") {
    return (
      <div
        className={`flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}
      >
        {renderEmblem("w-28 h-28 sm:w-36 sm:h-36")}
        <div className="mt-4">
          <div className="font-display font-black text-lg sm:text-2xl text-slate-900 dark:text-white tracking-wide uppercase leading-none">
            SEWA GENSET CIREBON
          </div>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="h-[2.5px] w-8 sm:w-16 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
            <span className="font-black text-xs sm:text-sm tracking-widest text-amber-600 dark:text-amber-500 uppercase">
              INDONESIA
            </span>
            <span className="h-[2.5px] w-8 sm:w-16 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
          </div>
        </div>
      </div>
    );
  }

  // Default Variant: Horizontal Navbar/Footer Style
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {renderEmblem()}

      <div className="flex flex-col">
        <div className="flex items-center justify-center leading-none">
          <span
            className={`font-display font-black text-slate-900 dark:text-white uppercase tracking-tight ${textSizes[size].title}`}
          >
            SEWA GENSET CIREBON
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center justify-center gap-1.5 mt-1 leading-none">
            <span className="h-[1.5px] w-3 sm:w-5 bg-amber-600 dark:bg-amber-500 rounded-full"></span>

            <span
              className={`font-extrabold tracking-widest text-amber-600 dark:text-amber-500 uppercase ${textSizes[size].sub}`}
            >
              INDONESIA
            </span>

            <span className="h-[1.5px] w-3 sm:w-5 bg-amber-600 dark:bg-amber-500 rounded-full"></span>
          </div>
        )}
      </div>
    </div>
  );
};
