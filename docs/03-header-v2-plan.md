# Plan 3: Header V2 - 玻璃导航轨道与滚动状态

## 目标

在首页首屏动效已经落地之后，升级全站顶部导航，让顶部栏不再像一条普通的深色边框栏，而是成为连接首页动效和内容页面的稳定导航层。

这一轮只处理 Header，不继续扩大到全站卡片、内容页排版或新的动效系统。

核心目标：

- 顶部栏从“窄条边框”升级为“玻璃导航轨道”。
- 首页首屏顶部更轻，减少对 HeroField 的压迫。
- 页面滚动后顶部栏增强可读性和边界感。
- 导航 hover、active、移动端布局更精致。
- 保持键盘导航、无障碍语义和 Astro 页面切换稳定。

## 当前问题

当前顶部栏主要样式在：

- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`

当前结构：

```astro
<header class="site-header">
  <a class="brand" href="/">Dewflow Lab</a>
  <nav aria-label="Primary navigation">
    ...
  </nav>
</header>
```

当前视觉特点：

- `.site-header` 是 sticky。
- 宽度被限制在 `1120px` 内容容器内。
- 有固定半透明深色背景。
- 使用普通 `border-bottom`。
- 所有页面状态一致，没有顶部透明态和滚动后增强态。

问题：

- 在首页首屏上，顶部栏和 HeroField 动效缺少视觉融合。
- 普通底边框比较硬，和当前生成式光场不协调。
- 导航按钮 hover 还偏基础，没有形成站点记忆点。
- 移动端导航换行后占用高度偏大，首屏压缩明显。

## 设计方向

关键词：

- glass rail
- sticky shell
- subtle glow
- scroll-aware
- restrained lab interface

建议方向：

- Header 外层改成全宽 sticky 层。
- Header 内部增加 `.site-header-inner`，继续限制在 `1120px`。
- 背景使用半透明深色 + `backdrop-filter`。
- 底部边线改为渐变光线，而不是普通 border。
- 顶部初始状态更透明，滚动后增加背景、描边、阴影。
- 导航按钮使用低亮度玻璃 hover，不做厚重 pill。

## Phase 1: 结构轻量调整

目标文件：

- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`

建议结构：

```astro
<header class="site-header" data-site-header>
  <div class="site-header-inner">
    <a class="brand" href="/">Dewflow Lab</a>
    <nav class="site-nav" aria-label="Primary navigation">
      ...
    </nav>
  </div>
</header>
```

注意：

- 不改变导航链接内容。
- 不改变中英文切换逻辑。
- 保留 `header` 和 `nav` 语义。
- 不引入新的路由或组件抽象，除非后续 Header 继续复杂化。

## Phase 2: 玻璃轨道样式

建议样式方向：

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  background: rgba(7, 8, 11, 0.46);
  backdrop-filter: blur(18px);
}

.site-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100, 210, 255, 0.42), transparent);
}

.site-header-inner {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
```

视觉约束：

- 不做大面积渐变背景。
- 不使用装饰性光球。
- 边线和 glow 要非常轻。
- Header 不能遮挡首屏正文。
- Header 高度要稳定，hover 不能导致布局跳动。

## Phase 3: 滚动状态

在 `BaseLayout.astro` 的客户端脚本中增加轻量滚动状态。

建议行为：

- 页面顶部：`site-header` 保持轻透明。
- `scrollY > 12` 后：增加 `.is-scrolled`。
- 使用 `requestAnimationFrame` 节流。
- 支持 Astro 页面切换后的重新初始化。

建议代码方向：

```js
let headerScrollHandler;

function setupHeaderState() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  updateHeaderState();
  headerScrollHandler = updateHeaderState;
  window.addEventListener('scroll', headerScrollHandler, { passive: true });
}
```

需要注意：

- 当前 `BaseLayout.astro` 已经有 section dot 的清理逻辑。
- Header 的 scroll listener 也要有清理，避免 Astro ClientRouter 页面切换后重复绑定。
- 不使用 GSAP 或其他动画库。

## Phase 4: 导航状态与交互

导航按钮建议：

- 默认态：透明、文字低对比但可读。
- hover/focus-visible：轻微玻璃底、边线、文字变亮。
- 当前页面 active：使用细线或微弱光点，不要厚重背景。

可选 active 方案：

- 根据 `Astro.url.pathname` 给当前链接加 `aria-current="page"`。
- 对 `/posts`、`/projects`、`/updates` 等一级路径做匹配。
- 首页 brand 不一定需要 active。

注意：

- `focus-visible` 必须清晰。
- hover 不改变按钮尺寸。
- 移动端触控区域不能小于当前尺寸。

## Phase 5: 移动端布局

当前移动端 header 会变成上下两行，导航自然换行。

建议升级为：

- 品牌仍在第一行。
- 导航在第二行横向滚动。
- 隐藏滚动条或弱化滚动条。
- 不让 header 高度无限增加。

样式方向：

```css
@media (max-width: 760px) {
  .site-header-inner {
    min-height: auto;
    padding: 12px 0;
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }

  .site-nav {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
}
```

需要验证：

- 390px 宽度下导航不溢出页面。
- 首屏文字不被 Header 挤压或覆盖。
- 横向滚动导航不影响页面纵向滚动。

## Phase 6: 首页和非首页差异

建议先使用同一套 Header V2 覆盖全站。

如果首页顶部仍然显得厚，可以再加首页限定：

- 给首页 `htmlClass` 增加一个 `home-page` 或 `has-hero-field`。
- 只在首页顶部降低 header 背景强度。
- 滚动后回到全站统一强度。

不要一开始做复杂多状态系统，先实现统一 Header V2，再根据实测微调首页顶部。

## Phase 7: 验证

构建检查：

```sh
npm run build
```

本地浏览器检查：

- `/`
- `/en/`
- `/posts`
- `/projects`
- `/updates`
- `/search`
- `/about`
- `/lab`

重点检查：

- 首页首屏顶部栏是否和 HeroField 融合。
- 滚动后 `.is-scrolled` 是否生效。
- 回到顶部后是否恢复透明态。
- 键盘 Tab 导航是否可见。
- 移动端导航是否横向滚动且不撑破页面。
- 页面切换后不会重复绑定滚动事件。
- 中文和英文导航都正常。

## 验收标准

- `npm run build` 通过。
- Header 在首页顶部更轻，不压制首屏动效。
- Header 滚动后背景更稳，文字可读。
- 顶部边框从硬边框变成克制的渐变光线。
- 导航 hover/focus/active 状态清晰但不过度装饰。
- 移动端没有导航换行导致的过高 Header。
- Astro 页面切换后 Header 状态正常。
- 不重新引入 GSAP 或滚轮劫持。

## 建议提交拆分

这一轮可以作为一个 commit：

```sh
git commit -m "Add glass header scroll state"
```

如果实施中发现移动端需要较多调整，可以拆为两个 commit：

1. `Add glass header scroll state`
2. `Polish mobile header navigation`

## 不在本轮做的事

- 不改首页 HeroField 动效。
- 不新增全站主题切换。
- 不重构 Footer。
- 不改内容模型和发布流程。
- 不做大型导航信息架构调整。
- 不引入新的动画库。
