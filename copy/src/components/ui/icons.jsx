import React from "react";

export const BurgerIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect width="18" height="2" x="3" y="6" rx="1" />
      <rect width="18" height="2" x="3" y="11" rx="1" />
      <rect width="18" height="2" x="3" y="16" rx="1" />
    </svg>
  );
};

export const PizzaIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 11h.01" />
      <path d="M11 15h.01" />
      <path d="M16 16h.01" />
      <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
      <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
    </svg>
  );
};

export const ChickenIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.5 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M8.44 11.44 6.92 16c-.24.65.16 1.36.84 1.47 2.19.36 4.44.33 6.63-.09.68-.13 1.07-.86.82-1.5l-1.39-3.44" />
      <path d="M13.5 7.5a4 4 0 0 0-6-3.458" />
    </svg>
  );
};

export const FriesIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 11h.01" />
      <path d="M16 16h.01" />
      <path d="M17 2H7l-4 6 10 14 10-14-4-6Z" />
      <path d="m5 8 2 3" />
      <path d="m19 8-2 3" />
      <path d="m12 17-1-6" />
      <path d="m12 17 1-6" />
    </svg>
  );
};

export const DrinkIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" />
      <path d="M5 8h14" />
      <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
      <path d="m12 8 1-6h2" />
    </svg>
  );
};

export const SaladIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 21h10" />
      <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
      <path d="M11.34 11.34a3 3 0 0 0-1.14-1.65c-.29-.19-.62-.33-.95-.44" />
      <path d="m2 12 2.5-4.5L7 12" />
      <path d="m17 12 2.5-4.5L22 12" />
      <path d="m12 12 2-3.5 2 3.5" />
    </svg>
  );
};

export const SushiIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22c6.23-.05 11.25-7.16 11.95-16" />
      <path d="M19 18.55A21.5 21.5 0 0 1 12 22a21.5 21.5 0 0 1-7-3.45" />
      <path d="M12 22a30 30 0 0 1-7-1.81" />
      <path d="M12 22a30 30 0 0 0 7-1.81" />
      <path d="M4.32 10.96A25 25 0 0 1 12 9.17a25 25 0 0 1 7.68 1.79" />
      <path d="M22 8a60 60 0 0 0-10-1 60 60 0 0 0-10 1" />
      <path d="M4 8c.59-5.68 4.24-8 8-8s7.41 2.32 8 8" />
    </svg>
  );
};

export const FastFoodIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9" />
      <path d="M7 9h10" />
      <path d="M12 13v5" />
      <path d="M2 11 8.5 3c.83-.83 1.17-.83 2 0L17 9" />
      <path d="M22 11 8.5 3" />
    </svg>
  );
};

export const LovableIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
};
