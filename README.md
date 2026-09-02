# CNOP

CNOP 是一个以 Markdown 为内容源的个人知识库，页面采用克制的 wiki 风格：白色背景、衬线字体、蓝色链接、清晰的层级和尽量少的装饰。

## 本地开发

```bash
bun install
bun run dev
```

启动后访问 <http://127.0.0.1:3001>。

生产构建使用：

```bash
bun run build
```

静态文件会生成到 `out/`，GitHub Actions 会将它部署到 GitHub Pages。

## 添加文档

所有文章放在 `content/` 下，支持任意层级的文件夹和 `.md` 文件，例如：

```text
content/
├── README.md
├── guides/
│   └── writing.md
└── research/
    └── cnop.md
```

文件夹会自动出现在左侧目录树中，Markdown 文件会自动生成对应的文章页面。文章中的第一个一级标题会作为页面标题；二级和三级标题会自动生成文章右侧目录。

当前支持标题、段落、列表、引用、代码块、行内代码、链接、图片和基础 KaTeX 数学公式。正文图片会保持较大的展示尺寸，背景图不会被用于页面装饰。

图片资源放在 `public/` 下，例如 `public/images/figure.png`，然后在 Markdown 中写 `![示意图](images/figure.png)`。构建时会自动为生产环境补上 `/CNOP` 前缀。

## 在线地址

- 仓库：<https://github.com/TTAWDTT/CNOP>
- GitHub Pages：<https://ttawdtt.github.io/CNOP/>

推送到 `main` 分支，或在 Actions 中手动运行 `Deploy CNOP to GitHub Pages`，即可触发部署。
