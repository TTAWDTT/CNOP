import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  const assetPrefix = process.env.NODE_ENV === "production" ? "/CNOP" : "";

  return (
    <header className="site-header">
      <Link className="site-header__brand" href="/">
        <Image alt="CNOP 头像" className="site-header__avatar" height={32} priority src={`${assetPrefix}/avatar.png`} unoptimized width={32} />
        <span>CNOP</span>
      </Link>
      <p>Markdown knowledge base</p>
      <a href="https://github.com/TTAWDTT/CNOP" rel="noreferrer" target="_blank">
        GitHub
      </a>
    </header>
  );
}
