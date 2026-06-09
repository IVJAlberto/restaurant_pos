import React from "react";

const MenuTogglerBtn = ({ isMenuOpen }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md p-2
                 text-primary-foreground 
                 transition-colors"
      aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isMenuOpen}
    >
      <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  className="w-6 h-6"
  aria-hidden="true"
>
  {isMenuOpen ? (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 6L18 18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 6L6 18"
      />
    </>
  ) : (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7H20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12H20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 17H20"
      />
    </>
  )}
</svg>
    </button>
  );
};

export default MenuTogglerBtn;