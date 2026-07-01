# 内容发布指南

这份指南记录 Dewflow Lab 后续新增、修改和发布内容的固定流程。

## 内容目录

正式发布稿放在：

- `src/content/posts/zh`
- `src/content/posts/en`
- `src/content/projects/zh`
- `src/content/projects/en`

原始笔记放在：

- `source-notes/obsidian`

站点真正读取的是 `src/content` 下的 MDX 文件，不会直接读取 Obsidian 原始笔记。

## 新建文章

推荐用脚手架生成文章骨架：

```sh
npm run new:post -- --title "发布流程升级" --slug publishing-workflow
```

生成英文文章：

```sh
npm run new:post -- --title "Publishing Workflow" --slug publishing-workflow --lang en
```

新建项目复盘：

```sh
npm run new:project -- --title "个人站升级" --slug personal-site-upgrade
```

脚手架默认生成 `draft: true`，生产构建不会发布草稿。内容准备好后，把它改成：

```yaml
draft: false
```

## Frontmatter 字段

文章推荐字段：

```yaml
title: 文章标题
description: 一句话摘要
date: 2026-07-01
updatedDate: 2026-07-01
tags: ['Astro', '发布流程']
featured: false
draft: true
lang: zh
translationKey: publishing-workflow
series: 个人站建设
sourceNote: source-notes/obsidian/example.md
cover: /images/example.png
coverAlt: 封面说明
changelog:
  - date: 2026-07-01
    note: 创建草稿
```

字段说明：

- `title`：文章标题。
- `description`：列表、搜索和 SEO 描述。
- `date`：首次发布时间，也是默认排序依据。
- `updatedDate`：内容明显修订时更新；如果和 `date` 同一天，页面不会额外强调。
- `tags`：标签页和搜索使用。
- `featured`：是否进入精选内容逻辑。
- `draft`：草稿开关；生产构建会过滤 `draft: true`。
- `lang`：`zh` 或 `en`。
- `translationKey`：中英文对应内容使用同一个 key。
- `series`：文章所属系列。
- `sourceNote`：对应的原始 Obsidian 笔记路径，仅用于维护。
- `cover` / `coverAlt`：预留给后续封面图。
- `changelog`：文章级更新记录。

项目复盘额外字段：

```yaml
status: shipped
stack: ['Astro', 'MDX', 'Cloudflare Pages']
links:
  - label: 线上站点
    url: https://example.com
```

`status` 可选：

- `idea`
- `building`
- `shipped`
- `archived`

## 从 Obsidian 整理成发布稿

建议流程：

1. 在 `source-notes/obsidian` 中保留原始笔记。
2. 用脚手架在 `src/content/posts/zh` 生成 MDX 发布稿。
3. 把原始笔记内容复制到 MDX 正文。
4. 增加清晰标题层级：`##`、`###`。
5. 补充 `description`、`tags`、`series` 和 `sourceNote`。
6. 删除只适合个人记录、不适合公开阅读的碎片。
7. 需要图表时使用 Mermaid 代码块。
8. 需要图片时放到 `public/images`，正文用 `/images/...` 引用。

## 修改已发布文章

小修正：

- 直接修改正文。
- 不一定要更新 `updatedDate`。

明显修订：

- 修改正文。
- 更新 `updatedDate`。
- 在 `changelog` 追加一条记录。

示例：

```yaml
updatedDate: 2026-07-01
changelog:
  - date: 2026-06-07
    note: 初版发布
  - date: 2026-07-01
    note: 补充发布流程和草稿说明
```

## 站点更新记录

站点自身功能、设计和内容系统变化放在：

- `src/content/site-updates/zh`
- `src/content/site-updates/en`

页面地址：

- `/updates`
- `/en/updates`

这部分是给人看的版本时间线。真实代码版本仍以 Git commit 为准。

## 本地验证

开发预览：

```sh
npm run dev
```

生产构建验证：

```sh
npm run build
```

发布前至少跑一次 `npm run build`。

## 发布

```sh
git status
git add .
git commit -m "Add new post"
git push
```

推送到 GitHub `main` 后，Cloudflare Pages 会自动执行 `npm run build` 并发布 `dist`。

