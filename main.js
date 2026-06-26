import './style.css';
import { initPricing } from './pricing.js';
import { initBento } from './bento.js';

window.addEventListener('DOMContentLoaded', () => {
  initPricing();
  initBento();

  const loader = document.getElementById('loader');
  const items = document.querySelectorAll('[data-anim]');
  items.forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 60));
  setTimeout(() => loader.classList.add('is-done'), 300);
});