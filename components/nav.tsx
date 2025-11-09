import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

type NavProps = {};
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
export function Nav({}: NavProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="navbar bg-neutral flex-col sm:flex-row mb-5"
      data-theme={theme}
    >
      <div className="navbar-start">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl invisible w-0 sm:visible sm:w-auto bg-neutral text-neutral-content"
        >
          North Country Cooling
        </Link>
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl visible w-auto sm:invisible sm:w-0 bg-neutral text-neutral-content"
        >
          NCC
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost text-neutral-content">
            Theme: {theme}
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow">
            {themes.map((themeOption) => (
              <li key={themeOption}>
                <a
                  onClick={() => setTheme(themeOption)}
                  className={themeOption === theme ? "active" : ""}
                >
                  {themeOption}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/contact"
          className="btn btn-primary ml-5"
        >
          Contact Me!
        </Link>
      </div>
    </div>
  );
}
