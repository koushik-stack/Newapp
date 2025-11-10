import "./main.css";
import WebGL from "./webgl";
import { initializeBlog } from "./blog";

WebGL();

const root = document.documentElement;

function onScroll() {
  if (window.scrollY > 10) root.dataset.scroll = "true";
  else root.dataset.scroll = "false";
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Initialize blog system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const blogManager = initializeBlog();
  blogManager.init();
});
