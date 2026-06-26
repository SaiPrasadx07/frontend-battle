const NODES = [
  { icon: 'cube-16-solid',     title: 'Modular pipelines',   wide: true,
    body: 'Compose sources, transforms, and destinations as drag-and-drop blocks that snap together into a working pipeline.' },
  { icon: 'cog-8-tooth',       title: 'Automated transforms',
    body: 'AI cleans, dedupes, and reshapes your data on every run — no manual scripts to maintain.' },
  { icon: 'chart-pie',         title: 'Live analytics',
    body: 'Watch throughput, row counts, and errors update in real time across every pipeline you run.' },
  { icon: 'arrow-trending-up', title: 'Scales with you',
    body: 'From 10k rows to 5M, Aether allocates dedicated infrastructure automatically under load.' },
  { icon: 'arrow-path',        title: 'Continuous sync',
    body: 'Schedule runs or trigger on change so your destinations are always fresh and consistent.' },
];

const mq = window.matchMedia('(max-width: 768px)');
let nodes = [];
let lastActive = 0; 

function buildBento() {
  const root = document.getElementById('bento');
  root.innerHTML = NODES.map((n, i) => `
    <article class="bento__node ${n.wide ? 'bento__node--wide' : ''}" data-index="${i}">
      <button class="bento__head" aria-expanded="false">
        <span class="bento__icon" style="--icon:url(/assets/${n.icon}.svg)"></span>
        <span class="bento__title">${n.title}</span>
        <span class="bento__chev" style="--icon:url(/assets/chevron-down.svg)"></span>
      </button>
      <div class="bento__panel">
        <div class="bento__panel-inner"><p>${n.body}</p></div>
      </div>
    </article>`).join('');
  nodes = Array.from(root.querySelectorAll('.bento__node'));
}

function openOnly(index) {
  nodes.forEach((node) => {
    const isTarget = Number(node.dataset.index) === index;
    node.classList.toggle('is-open', isTarget);
    node.querySelector('.bento__head').setAttribute('aria-expanded', String(isTarget));
  });
}

function wire() {
  nodes.forEach((node) => {
    const idx = Number(node.dataset.index);

    node.addEventListener('mouseenter', () => { lastActive = idx; });

    node.querySelector('.bento__head').addEventListener('click', () => {
      if (!mq.matches) return; // headers are inert on desktop
      const alreadyOpen = node.classList.contains('is-open');
      openOnly(alreadyOpen ? -1 : idx);
      lastActive = idx;
    });
  });
  mq.addEventListener('change', (e) => {
    if (e.matches) openOnly(lastActive);
  });
}

export function initBento() {
  buildBento();
  wire();
  if (mq.matches) openOnly(lastActive); 
}