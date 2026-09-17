/* ===================== Imports ===================== */

import { cartAdd } from '../store/cart-store.js'
import { getProducts } from '../data/products.js'
import { parseProduct } from '../components/product-card.js'
import { renderProductModal } from '../components/product-modal.js'
import { createPagination } from '../components/pagination.js'
import { createModal } from '../components/dialog.js'
import { createQuantityControl } from '../components/quantity-control.js'

/* ===================== Config & State ===================== */

const PAGE_SIZE = 8

let allProducts = []
let currentProducts = []
let modalProduct = null
let quantityControl = null

/* ===================== DOM References ===================== */

const productGrid = document.querySelector('.product-grid')
const resetFilters = document.getElementById('resetFilters')
const pagination = createPagination(document.getElementById('pagination'), {
   pageSize: PAGE_SIZE,
})
const modal = createModal(
   document.getElementById('productModal'),
   document.getElementById('modalClose'),
)
const modalBody = document.getElementById('modalBody')

/* ===================== Filtering ===================== */

const sortStrategies = {
   default: data => data,
   'price-asc': data => [...data].sort((a, b) => Number(a.price) - Number(b.price)),
   'price-desc': data => [...data].sort((a, b) => Number(b.price) - Number(a.price)),
   'top-sellers': data =>
      [...data].sort((a, b) => Number(b.total_sold) - Number(a.total_sold)),
   newest: data => [...data].sort((a, b) => new Date(b.date_added) - new Date(a.date_added)),
}

function getActiveFilters() {
   const sort = document.querySelector('input[name="sort"]:checked')
   const categories = document.querySelectorAll('input[type="checkbox"]:checked')
   const sizes = document.querySelectorAll('.size-btn.active')
   const search = document.getElementById('searchInput')

   return {
      sort: sort ? sort.value : 'default',
      categories: Array.from(categories).map(cb => cb.value),
      sizes: Array.from(sizes).map(btn => btn.dataset.size),
      query: search ? search.value.trim().toLowerCase() : '',
   }
}

function filterProducts(data) {
   const { sort, categories, sizes, query } = getActiveFilters()

   let filtered = [...data]

   if (query) {
      filtered = filtered.filter(
         product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query),
      )
   }

   if (categories.length !== 0) {
      filtered = filtered.filter(product => categories.includes(product.category))
   }

   if (sizes.length !== 0) {
      filtered = filtered.filter(product => sizes.includes(product.size.toLowerCase()))
   }

   return sortStrategies[sort](filtered)
}

/* ===================== Rendering ===================== */

pagination.onChange(() => renderGrid())

function renderGrid() {
   if (currentProducts.length === 0) {
      productGrid.innerHTML = '<div class="empty-state">No Product Available</div>'
      return
   }

   productGrid.innerHTML = pagination.pageItems(currentProducts).map(parseProduct).join('')
}

function renderProducts() {
   allProducts = getProducts()
   currentProducts = filterProducts(allProducts)

   pagination.setTotal(currentProducts.length)
   renderGrid()
   pagination.render()
}

/* ===================== Modal ===================== */

function handleCardActivation(card) {
   const id = Number(card.dataset.id)
   modalProduct = allProducts.find(product => product.id === id)
   if (!modalProduct) return

   modalBody.innerHTML = renderProductModal(modalProduct)
   quantityControl = createQuantityControl({
      valueEl: modalBody.querySelector('.quantity-value'),
      decreaseBtn: modalBody.querySelector('.qty-decrease'),
      increaseBtn: modalBody.querySelector('.qty-increase'),
   })
   quantityControl.setMax(modalProduct.stock)
   quantityControl.reset()
   modal.open()
}

function handleAddToCart() {
   if (!modalProduct || !quantityControl) return
   cartAdd(modalProduct, quantityControl.quantity)
   modal.close()
}

/* ===================== Event Listeners & Init ===================== */

;(() => {
   document.querySelectorAll('input[name="sort"]').forEach(radio => {
      radio.addEventListener('change', () => {
         pagination.reset()
         renderProducts()
      })
   })

   document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
         pagination.reset()
         renderProducts()
      })
   })

   document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
         btn.classList.toggle('active')
         pagination.reset()
         renderProducts()
      })
   })

   document.getElementById('searchInput').addEventListener('input', () => {
      pagination.reset()
      renderProducts()
   })

   productGrid.addEventListener('click', event => {
      const card = event.target.closest('.product-card')
      if (!card) return
      handleCardActivation(card)
   })

   productGrid.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const card = event.target.closest('.product-card')
      if (!card) return
      event.preventDefault()
      handleCardActivation(card)
   })

   modalBody.addEventListener('click', event => {
      if (event.target.closest('.add-to-cart-btn')) handleAddToCart()
   })

   resetFilters.addEventListener('click', () => {
      const defaultSort = document.querySelector('input[name="sort"][value="newest"]')
      if (defaultSort) defaultSort.checked = true

      document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
         cb.checked = false
      })

      document.querySelectorAll('.size-btn.active').forEach(btn => {
         btn.classList.remove('active')
      })

      const searchInput = document.getElementById('searchInput')
      if (searchInput) searchInput.value = ''

      pagination.reset()
      renderProducts()
   })

   renderProducts()
})()