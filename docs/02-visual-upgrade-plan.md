# Plan 2: 视觉系统与首页动效升级

## 目标

在发布系统稳定之后，再升级视觉表现。这个计划聚焦站点气质、深色视觉系统、首页视觉签名和动效体验，不处理内容元数据和发布流程。

目标不是做普通博客模板，而是让站点更像“个人项目实验室 + 工程知识档案”。

## 设计方向

关键词：

- 工程感
- 知识流
- 实验室
- 深色电影感
- 克制但有记忆点

推荐主视觉：

- 首页首屏使用一个生成式动态背景，表现“节点、路径、流动光场、知识网络”。
- 内容区保持高可读性，不把动效铺满全站。
- 文章页和项目页以深色静态质感为主，减少干扰。

## Phase 1: 视觉审计和约束确认

先检查当前页面类型和 CSS 结构：

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/layouts/ContentLayout.astro`
- `src/components/EntryCard.astro`
- `src/pages/index.astro`
- `src/pages/en/index.astro`
- `src/pages/posts/index.astro`
- `src/pages/projects/index.astro`
- `src/pages/lab.astro`
- `src/pages/about.astro`

需要先确认：

- 哪些 class 是全站共用。
- 哪些样式只服务首页。
- 哪些页面已有动效或脚本依赖。
- Mermaid 在深色背景下的可读性。
- 移动端是否存在文本溢出。

这一阶段只读代码，不做大改。

## Phase 2: 深色设计令牌

重写 `src/styles/global.css` 的基础变量，但不要一开始重写所有组件。

建议令牌方向：

```css
:root {
  --bg: #07080b;
  --surface: #101319;
  --surface-strong: #171b23;
  --ink: #f4efe7;
  --muted: #a7adba;
  --line: rgba(255, 255, 255, 0.12);
  --accent: #64d2ff;
  --accent-strong: #f4b84a;
}
```

注意：

- 不要让整站只剩一种蓝紫色。
- 避免大面积紫蓝渐变。
- 控制 glow 使用范围，只在 hover、重点按钮、首页 Hero 中使用。
- 正文阅读区优先保证对比度和行距。

## Phase 3: 全站基础组件重塑

逐步调整这些组件样式：

- `body`
- `.site-header`
- `.brand`
- `nav a`
- `.button`
- `.entry-card`
- `.card-meta`
- `.page-header`
- `.content-shell`
- `.content-hero`
- `.prose`
- `.tag-cloud`
- `.search-panel`
- `.search-result`
- `.project-meta-panel`

视觉策略：

- 卡片使用 8px 或更小圆角。
- 不做卡片套卡片。
- 页面区域保持完整布局，不把 section 做成漂浮卡片。
- 按钮和导航增加轻微描边、背景、hover 位移。
- 标题可以更有气质，但正文要稳。
- 所有移动端文本必须不溢出、不互相遮挡。

## Phase 4: Mermaid 深色适配

修改 `src/layouts/BaseLayout.astro` 中的 Mermaid 初始化。

当前类似：

```ts
mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
```

建议改为：

```ts
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
});
```

如果默认 dark 不协调，再升级到自定义 themeVariables。

需要验证：

- `src/content/posts/zh/engineering-architecture-overview.mdx` 中的 Mermaid 图可读。
- 深色背景下节点、箭头、文字对比足够。

## Phase 5: 首页 Hero 结构改造

目标文件：

- `src/pages/index.astro`
- `src/pages/en/index.astro`

首页 Hero 需要留出动效层：

```astro
<section class="hero-section hero-with-field">
  <HeroField />
  <div class="hero-content">
    ...
  </div>
</section>
```

要求：

- 动效层绝对定位铺满首屏。
- 文本层在动效之上。
- 文本不要放进厚重卡片。
- 可以用轻微 text-shadow 或背景遮罩保证可读性。
- 首屏底部要露出下一段内容的提示，不要做完全封死的满屏海报。

## Phase 6: HeroField 动效组件

新增：

- `src/components/HeroField.astro`

技术建议：

- 优先使用原生 Canvas/WebGL2。
- 不先引入 Three.js，除非后续明确需要 3D 场景、模型、相机或复杂交互。
- 动效只放首页，不进入文章详情页。

效果方向：

- 深色背景上的流动光场。
- 少量节点粒子和连线，表现知识网络。
- 鼠标移动时轻微响应。
- 不做强烈闪烁和高频运动。

必须支持降级：

- `prefers-reduced-motion: reduce` 时展示静态背景。
- WebGL 不可用时展示静态 CSS 背景。
- 页面不可见时暂停动画。
- Hero 滚出视口时暂停动画。
- 移动端降低粒子数量和绘制成本。

## Phase 7: 性能和可访问性收尾

需要检查：

- 首页首次加载是否明显变慢。
- 动效是否影响文字阅读。
- 移动端是否卡顿。
- `prefers-reduced-motion` 是否生效。
- 键盘导航仍然可用。
- 搜索页输入和过滤按钮不被视觉样式影响。

构建检查：

```sh
npm run build
```

本地预览：

```sh
npm run dev
```

## 验收标准

- `npm run build` 通过。
- 首页有明确、可记忆的视觉签名。
- Posts、Projects、Tags、Search、About、Lab 页面在深色主题下都可读。
- Mermaid 图在深色主题下可读。
- 首页动效在桌面端流畅。
- 移动端没有文本溢出、遮挡或按钮布局破裂。
- 开启 reduced motion 时首页不播放动态动画。
- WebGL 不可用时页面仍然能正常显示。

## 建议提交拆分

1. `Audit and prepare visual system`
2. `Apply dark design tokens`
3. `Restyle shared components`
4. `Adapt Mermaid for dark theme`
5. `Add homepage hero field structure`
6. `Add generative HeroField animation`
7. `Polish responsive and reduced-motion states`

## 不在本轮做的事

- 不引入 CMS。
- 不加入评论系统。
- 不做登录。
- 不把动效扩展到所有页面。
- 不在视觉重构中顺手改内容模型。
- 不大规模重写页面结构，除非现有结构阻碍视觉实现。

