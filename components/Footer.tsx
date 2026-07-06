import Link from "next/link";

export default function Footer() {
  return (
    <footer className="ndc-fade border-t border-neutral-200 px-[26px] py-[90px] md:px-[88px]">
      <div className="mb-[72px] text-[11px] text-neutral-500">
        Home　/　Projects
      </div>

      <div className="grid grid-cols-1 gap-[80px] md:grid-cols-3">
        <nav className="text-[32px] leading-[1.12] text-neutral-500 md:text-[38px]">
          <Link href="/" className="block hover:text-black">
            Home
          </Link>
          <a href="/#design" className="block hover:text-black">
            Design
          </a>
          <a href="/#research" className="block hover:text-black">
            Research
          </a>
          <a href="/#visual work" className="block hover:text-black">
            Visual Work
          </a>
          <Link href="/admin" className="block hover:text-black">
            Admin
          </Link>
        </nav>

        <div />

        <div className="text-[12px] leading-[2] text-neutral-600">
          <p>Landscape Architecture</p>
          <p>Design Practice</p>
          <p>Research</p>
          <p>Media · Events · Photography</p>
          <p>Personal Portfolio</p>
        </div>
      </div>
    </footer>
  );
}