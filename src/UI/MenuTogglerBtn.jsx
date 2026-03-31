import React from "react";

const MenuTogglerBtn = ({ isMenuOpen }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md p-2
                 text-zinc-950 dark:text-gray-300
                 hover:bg-zinc-300/60 dark:hover:bg-zinc-800/60
                 transition-colors"
      aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isMenuOpen}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={
            isMenuOpen
              ? "M6 18L18 6M6 6l12 12"
              : "M9 6l6 6-6 6"
          }
        />
      </svg>
    </button>
  );
};

export default MenuTogglerBtn;