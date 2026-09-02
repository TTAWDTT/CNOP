import type { GetStaticProps } from "next";

import Link from "next/link";

import { DocumentLayout } from "@/components/document-layout";
import { SiteHeader } from "@/components/site-header";
import { getDirectoryTree, getDocuments, type DirectoryNode, type DocumentMeta } from "@/lib/docs";

export default function HomePage({ documents, tree }: { documents: DocumentMeta[]; tree: DirectoryNode }) {
  return (
    <>
      <SiteHeader />
      <DocumentLayout activeSlug="" tree={tree}>
        <section className="home-page">
          <p className="eyebrow">Personal documentation</p>
          <h1>CNOP</h1>
          <p className="home-page__lead">
            一个以 Markdown 为内容源的个人知识库。文件夹负责组织内容，文档负责保存想法。
          </p>
          <div className="home-page__rule" />
          <h2>文档</h2>
          <ul className="home-document-list">
            {documents.map((document) => (
              <li key={document.slug}>
                <Link href={`/doc/${document.slug}`}>
                  <span>{document.title}</span>
                  <small>
                    {document.relativePath}
                    {document.date ? ` · ${document.date}` : ""}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </DocumentLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => ({
  props: { documents: getDocuments(), tree: getDirectoryTree() },
});
