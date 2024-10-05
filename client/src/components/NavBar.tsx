import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function NavBar({ children }: Props) {
  return (
    <>
      <header className="fixed top-0 bg-white w-full font-sans h-30 drop-shadow-sm z-20">
        <div className="flex justify-between align-middle p-5">
          <nav className="text-2xl text-gray-600 font-bold text-center">
            Recipe Finder
          </nav>
          <nav>{children}</nav>
        </div>
      </header>
      <div className="h-30 w-full">lol</div>
    </>
  );
}

export default NavBar;
