import Link from "next/link";

type NavbarProps = {
  variant?: "dark" | "light";
};

export default function Navbar({
  variant = "dark",
}: NavbarProps) {
  const isLight = variant === "light";

  return (
    <header
      className="
        absolute
        left-0
        right-0
        top-0
        z-[100]
        bg-transparent
      "
    >
      <div className="flex h-[80px] items-center justify-between px-[28px] md:px-[48px]">
        <Link
          href="/"
          className={`
            text-[15px]
            font-light
            tracking-[0.28em]
            hover:opacity-60
            ${isLight ? "text-white" : "text-[#111]"}
          `}
        >
          JOEY
        </Link>

        <nav
          className={`
            hidden
            gap-[42px]
            text-[11px]
            uppercase
            tracking-[0.22em]
            md:flex
            ${isLight ? "text-white" : "text-[#111]"}
          `}
        >
          <a href="/#design" className="hover:opacity-60">Design</a>
          <a href="/#research" className="hover:opacity-60">Research</a>
          <a href="/#visual work" className="hover:opacity-60">Visual Work</a>
          <Link href="/about" className="hover:opacity-60">About</Link>
          <Link href="/admin" className="hover:opacity-60">Admin</Link>
        </nav>
      </div>
    </header>
  );
}