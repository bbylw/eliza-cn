import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { GithubLogoIcon as GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { ListIcon as List } from "@phosphor-icons/react/dist/csr/List";
import { XIcon as X } from "@phosphor-icons/react/dist/csr/X";
import { useEffect, useState } from "react";

const links = [
  { href: "#product", label: "产品" },
  { href: "#capabilities", label: "能力" },
  { href: "#framework", label: "框架" },
  { href: "#inference", label: "本地推理" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-3 rounded-md"
          aria-label="elizaOS 首页"
        >
          <span
            className="grid size-8 grid-cols-2 gap-0.5 rounded-lg bg-signal-400 p-1.5"
            aria-hidden="true"
          >
            <span className="rounded-[2px] bg-ink-950" />
            <span className="rounded-[2px] bg-ink-950/45" />
            <span className="rounded-[2px] bg-ink-950/45" />
            <span className="rounded-[2px] bg-ink-950" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.02em]">
            eliza<span className="text-signal-400">OS</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="主导航">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-mist-300 hover:text-mist-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="https://github.com/elizaOS/eliza"
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-mist-300 hover:border-white/20 hover:bg-white/5 hover:text-mist-100"
            aria-label="打开 elizaOS GitHub"
          >
            <GithubLogo size={19} weight="regular" />
          </a>
          <a
            href="https://docs.elizaos.ai/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-mist-100 px-5 text-sm font-semibold text-ink-950 hover:bg-signal-400 active:scale-[0.98]"
          >
            打开 Eliza
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-mist-100 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
        >
          {menuOpen ? <X size={20} /> : <List size={21} />}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-18 min-h-[calc(100dvh-4.5rem)] border-t border-white/8 bg-ink-950 px-5 py-8 lg:hidden"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col"
            aria-label="移动端导航"
          >
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/8 py-5 text-2xl font-medium tracking-tight text-mist-100"
              >
                {link.label}
                <span className="font-mono text-xs text-mist-500">
                  0{index + 1}
                </span>
              </a>
            ))}
            <a
              href="https://docs.elizaos.ai/"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-signal-400 px-6 font-semibold text-ink-950"
            >
              阅读文档
              <ArrowUpRight size={17} weight="bold" />
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
