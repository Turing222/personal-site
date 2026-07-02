let mermaidModulePromise: Promise<typeof import('mermaid')['default']> | undefined;

async function getMermaid() {
  mermaidModulePromise ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
    });
    return mermaid;
  });
  return mermaidModulePromise;
}

async function renderMermaidBlocks() {
  const blocks = Array.from(document.querySelectorAll('pre[data-language="mermaid"]'));
  if (blocks.length === 0) {
    return;
  }

  blocks.forEach((block, index) => {
    const container = document.createElement('div');
    const lines = Array.from(block.querySelectorAll('.line'));
    container.className = 'mermaid';
    container.id = `mermaid-${index}`;
    container.dataset.mermaidPending = 'true';
    container.textContent = lines.length > 0
      ? lines.map((line) => line.textContent ?? '').join('\n')
      : block.textContent ?? '';
    block.replaceWith(container);
  });

  const mermaid = await getMermaid();
  await mermaid.run({ querySelector: '.mermaid[data-mermaid-pending="true"]' });
  document.querySelectorAll('.mermaid[data-mermaid-pending="true"]').forEach((block) => {
    block.removeAttribute('data-mermaid-pending');
  });
}

document.addEventListener('astro:page-load', () => {
  renderMermaidBlocks();
});
