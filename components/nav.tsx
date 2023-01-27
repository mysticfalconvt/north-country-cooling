import { useTheme } from "next-themes";
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
    <div className="navbar bg-neutral mb-5" data-theme={theme}>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl  invisible sm:visible bg-neutral text-neutral-content">
          North Country Cooling
        </a>
      </div>
      <div className="flex-none ">
        <ul className="menu menu-horizontal px-1">
          <li tabIndex={0}>
            <a className="text-neutral-content">
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
            </a>
            <ul className="p-2 bg-base-200 z-10">
              {themes.map((theme) => (
                <li key={theme}>
                  <a
                    onClick={() => setTheme(theme)}
                    className="btn btn-ghost normal-case text-xl text-base-content"
                  >
                    {theme}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <a href="tel:802-249-4858" className="text-neutral-content ml-5">
              802-249-4858
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
