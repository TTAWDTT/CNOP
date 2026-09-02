import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" href="/">
        CNOP
      </Link>
      <p>Markdown knowledge base</p>
      <a href="https://github.com/TTAWDTT/CNOP" rel="noreferrer" target="_blank">
        GitHub
      </a>
    </header>
  );
}
