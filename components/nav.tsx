import React from "react";

type NavProps = {
  setTheme: (theme: string) => void;
  theme: string;
};
export const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];
export function Nav({ setTheme, theme }: NavProps) {
  return (
    <div className="navbar bg-secondary mb-5" data-theme={theme}>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">
          North Country Cooling
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li tabIndex={0}>
            <a>
              Themes
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100 z-10">
              {themes.map((theme) => (
                <li key={theme}>
                  <a
                    onClick={() => setTheme(theme)}
                    className="btn btn-ghost normal-case text-xl"
                  >
                    {theme}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <a href="tel:802-249-4858">802-249-4858</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
