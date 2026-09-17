/* ===================== Imports ===================== */

import { getProducts } from '../data/products.js'
import { parseProduct } from '../components/product-card.js'

/* ===================== Config ===================== */

const BEST_SELLER_COUNT = 5

/* ===================== Best Sellers ===================== */

function getBestSellers(products) {
   return [...products]
      .sort((a, b) => Number(b.total_sold) - Number(a.total_sold))
      .slice(0, BEST_SELLER_COUNT)
}

/* ===================== Carousel ===================== */

function renderCarouselSet(products) {
   return `<div class="carousel-set">${products.map(parseProduct).join('')}</div>`
}

function renderCarousel(track, products) {
   track.innerHTML = renderCarouselSet(products) + renderCarouselSet(products)
}

function renderBestSellers() {
   const track = document.querySelector('.carousel-track')
   if (!track) return

   renderCarousel(track, getBestSellers(getProducts()))
}

/* ===================== Init ===================== */

renderBestSellers()