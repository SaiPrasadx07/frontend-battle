// ===== Feature 1: Multi-currency, performance-isolated pricing engine =====
const CONFIG = {
  annualDiscount: 0.8,
  tiers: [
    { id: 'starter', name: 'Starter', baseRate: 29,
      blurb: 'For solo builders shipping their first pipelines.',
      features: ['3 data sources', '10k rows / run', 'Community support'] },
    { id: 'growth', name: 'Growth', baseRate: 79, featured: true,
      blurb: 'For teams automating production workflows.',
      features: ['Unlimited sources', '5M rows / run', 'AI transforms', 'Priority support'] },
    { id: 'scale', name: 'Scale', baseRate: 199,
      blurb: 'For data orgs running mission-critical loads.',
      features: ['Everything in Growth', 'Dedicated infra', 'SSO + audit logs', '24/7 SLA'] },
  ],
  currencies: {
    USD: { code: 'USD', locale: 'en-US', tariff: 1.0 },
    INR: { code: 'INR', locale: 'en-IN', tariff: 83.0 },
    EUR: { code: 'EUR', locale: 'de-DE', tariff: 0.92 },
  },
};

const state = { currency: 'USD', billing: 'monthly' };
const priceNodes = [];

const computePrice = (baseRate) => {
  const { tariff } = CONFIG.currencies[state.currency];
  const cycleMult = state.billing === 'annual' ? CONFIG.annualDiscount : 1;
  return baseRate * tariff * cycleMult;
};

const format = (value) => {
  const { code, locale } = CONFIG.currencies[state.currency];
  return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(value);
};

function buildPricing() {
  const grid = document.getElementById('pricing-grid');
  grid.innerHTML = CONFIG.tiers.map((t) => `
    <article class="tier ${t.featured ? 'tier--featured' : ''}">
      ${t.featured ? '<span class="tier__badge">Most popular</span>' : ''}
      <h3 class="tier__name">${t.name}</h3>
      <p class="tier__blurb">${t.blurb}</p>
      <p class="tier__price">
        <span class="tier__amount" data-base="${t.baseRate}">—</span>
        <span class="tier__period">/mo</span>
      </p>
      <ul class="tier__features">${t.features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <a href="#" class="btn ${t.featured ? 'btn--primary' : 'btn--ghost'} tier__cta">Start free</a>
    </article>`).join('');

  priceNodes.length = 0;
  grid.querySelectorAll('.tier__amount').forEach((node) =>
    priceNodes.push({ node, base: Number(node.dataset.base) }));
}

function updatePrices() {
  priceNodes.forEach(({ node, base }) => {
    node.textContent = format(computePrice(base));
    node.classList.remove('is-updated');
    requestAnimationFrame(() => requestAnimationFrame(() => node.classList.add('is-updated')));
  });
  document.querySelectorAll('.tier__period').forEach((p) => {
    p.textContent = state.billing === 'annual' ? '/mo billed yearly' : '/mo';
  });
}

function wireControls() {
  document.querySelectorAll('[data-billing]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.billing = btn.dataset.billing;
      document.querySelectorAll('[data-billing]').forEach((b) => b.classList.toggle('is-active', b === btn));
      updatePrices();
    }));
  document.querySelectorAll('[data-currency]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.currency = btn.dataset.currency;
      document.querySelectorAll('[data-currency]').forEach((b) => b.classList.toggle('is-active', b === btn));
      updatePrices();
    }));
}

export function initPricing() {
  buildPricing();
  wireControls();
  updatePrices();
}