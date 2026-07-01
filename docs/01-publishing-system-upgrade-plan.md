# Plan 1: 发布系统与内容元数据升级

## 目标

先解决“无从下手”和“更新记录不清楚”的问题。这个计划只处理内容模型、发布流程、脚手架和站点更新时间线，不做大视觉重构。

完成后，新增文章应该变成一条稳定流程：

```text
写原始笔记
-> 生成 MDX 发布稿
-> 填元数据
-> 本地预览和构建
-> git commit / push
-> Cloudflare Pages 自动发布
```

## 当前基础

- 项目目录：`E:\codex_blog\personal-site`
- 技术栈：Astro + Content Collections + MDX + TypeScript + CSS
- 正式内容目录：
  - `src/content/posts/zh`
  - `src/content/posts/en`
  - `src/content/projects/zh`
  - `src/content/projects/en`
- 原始笔记目录：`source-notes/obsidian`
- 部署方式：GitHub `main` 分支推送后，Cloudflare Pages 自动执行 `npm run build`
- 当前已有字段：`title`、`description`、`date`、`updatedDate`、`cover`、`tags`、`featured`、`lang`、`translationKey`

## Phase 1: 扩展内容元数据

修改 `src/content.config.ts`，在 `posts` 和 `projects` 中增加长期维护需要的字段。

建议字段：

```yaml
draft: false
series: 个人站建设
sourceNote: source-notes/obsidian/xxx.md
coverAlt: 封面说明
changelog:
  - date: 2026-07-01
    note: 初版发布
```

字段含义：

- `draft`：草稿控制，防止未完成内容进入正式构建。
- `series`：文章系列，后续可扩展系列页。
- `sourceNote`：记录发布稿来自哪篇原始笔记，主要给作者维护使用，不建议直接生成公开链接。
- `coverAlt`：为后续封面图和可访问性做准备。
- `changelog`：文章级更新记录，用于记录一次内容修订的原因。

建议 schema：

```ts
const changelogSchema = z.object({
  date: z.coerce.date(),
  note: z.string(),
});
```

然后在 posts/projects schema 中添加：

```ts
draft: z.boolean().default(false),
series: z.string().optional(),
sourceNote: z.string().optional(),
coverAlt: z.string().optional(),
changelog: z.array(changelogSchema).default([]),
```

## Phase 2: 接入更新时间展示

修改以下文件：

- `src/layouts/ContentLayout.astro`
- `src/components/EntryCard.astro`
- `src/pages/posts/[...slug].astro`
- `src/pages/en/posts/[...slug].astro`
- `src/pages/projects/[...slug].astro`
- `src/pages/en/projects/[...slug].astro`

详情页展示规则：

- 始终显示 `date`，文案为“发布于”。
- 当 `updatedDate` 存在且和 `date` 不是同一天时，显示“更新于”。
- 当 `series` 存在时，在元信息区展示系列名。
- 当 `changelog` 存在时，在文章底部展示“更新记录”。

列表卡片展示规则：

- 默认仍以 `date` 排序。
- 如果 `updatedDate` 存在且晚于 `date`，卡片上用次级样式显示“更新于”。
- 不要让更新时间抢过标题和摘要的视觉层级。

## Phase 3: 草稿过滤

新增或扩展 `src/utils/content.ts`，提供统一过滤函数，例如：

```ts
export function isPublished(entry: ContentEntry) {
  return !entry.data.draft || !import.meta.env.PROD;
}
```

然后替换所有读取 posts/projects 的页面逻辑：

- `src/pages/index.astro`
- `src/pages/en/index.astro`
- `src/pages/posts/index.astro`
- `src/pages/en/posts/index.astro`
- `src/pages/posts/[...slug].astro`
- `src/pages/en/posts/[...slug].astro`
- `src/pages/projects/index.astro`
- `src/pages/en/projects/index.astro`
- `src/pages/projects/[...slug].astro`
- `src/pages/en/projects/[...slug].astro`
- `src/pages/tags/index.astro`
- `src/pages/en/tags/index.astro`
- `src/pages/tags/[tag].astro`
- `src/pages/en/tags/[tag].astro`
- `src/pages/search.astro`
- `src/pages/en/search.astro`

目标：

- 本地开发可以看到草稿，便于预览。
- 生产构建不输出 `draft: true` 的内容。

注意：详情页的 `getStaticPaths()` 也必须过滤草稿，否则草稿仍会生成静态页面。

## Phase 4: 新增内容脚手架

新增脚本：

- `scripts/new-entry.mjs`

新增 npm scripts：

```json
{
  "new:post": "node scripts/new-entry.mjs --type post",
  "new:project": "node scripts/new-entry.mjs --type project"
}
```

推荐用法：

```sh
npm run new:post -- --title "发布流程升级" --slug publishing-workflow
npm run new:post -- --title "发布流程升级" --slug publishing-workflow --lang zh
npm run new:project -- --title "个人站升级" --slug personal-site-upgrade
```

脚本规则：

- `--type` 支持 `post` / `project`。
- `--lang` 默认 `zh`，可传 `en`。
- `--title` 必填。
- `--slug` 推荐手动传；如果没有传，用日期兜底，例如 `2026-07-01-new-post`。
- 创建前检查目标文件是否存在，禁止覆盖。
- 自动写入完整 frontmatter。
- 输出创建的绝对路径。

暂时不要做中文转拼音。这个功能边界多，容易引入额外依赖；手动 slug 更稳定。

## Phase 5: 站点更新时间线

新增内容集合或数据文件，用于记录站点自身演进。

推荐新增集合：

- `src/content/site-updates`

新增页面：

- `src/pages/updates.astro`
- `src/pages/en/updates.astro` 可后置，不必第一轮强求。

site update frontmatter 示例：

```yaml
title: 发布系统元数据升级
description: 增加草稿、系列、来源笔记和文章更新记录。
date: 2026-07-01
tags: ['站点更新', '内容系统']
type: feature
```

`type` 可选值建议：

- `feature`
- `design`
- `content`
- `maintenance`

页面展示方式：

- 按 `date` 倒序。
- 使用时间线样式。
- 每条展示标题、日期、类型、摘要、标签。

这个页面解决的是“给人看的版本记录”。Git 仍然是底层真实版本记录。

## Phase 6: 文档化发布流程

新增或更新文档：

- `docs/content-publishing-guide.md`

内容包括：

- 新文章创建命令。
- frontmatter 字段说明。
- Obsidian 原始笔记到 MDX 发布稿的整理规则。
- 图片放置规则：`public/images/...`。
- 本地验证命令：`npm run build`。
- 发布命令：`git add` / `git commit` / `git push`。

## 验收标准

- `npm run build` 通过。
- 新增一篇 `draft: true` 测试文章时，生产构建不生成对应详情页。
- 新增一篇正式文章时，能出现在首页、文章列表、标签页、搜索页。
- `updatedDate` 能在详情页和列表卡片展示。
- 文章底部能展示 `changelog`。
- `npm run new:post -- --title "测试文章" --slug test-post` 能生成合法 MDX。
- `/updates` 能展示站点更新记录。

## 建议提交拆分

1. `Add content metadata fields`
2. `Show updated dates and changelog`
3. `Filter draft content from production builds`
4. `Add content scaffolding script`
5. `Add site updates timeline`
6. `Document publishing workflow`

