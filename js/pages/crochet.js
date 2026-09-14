/* ===================== Imports ===================== */

import { storageRetrieve, cartAdd } from '../storage.js'
import { parseProduct, renderModalContent } from '../render.js'
import { createPagination, createModal, createQuantityControl } from '../helper.js'
import seed from '../populate.js'

/* ===================== Config & State ===================== */

const PAGE_SIZE = 8

let currentProducts = []
let allProducts = []
let modalProduct = null

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

const modalElements = {
   image: document.querySelector('.modal-image'),
   category: document.querySelector('.modal-category'),
   name: document.querySelector('.modal-name'),
   rating: document.querySelector('.modal-rating'),
   size: document.querySelector('.modal-size'),
   sold: document.querySelector('.modal-sold'),
   description: document.querySelector('.modal-description'),
   price: document.querySelector('.modal-price'),
   stock: document.querySelector('.modal-stock'),
}

const quantityControl = createQuantityControl({
   valueEl: document.querySelector('.quantity-value'),
   decreaseBtn: document.querySelector('.qty-decrease'),
   increaseBtn: document.querySelector('.qty-increase'),
})

/* ===================== Filtering ===================== */

const filter_func_map = {
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

function sanitize(data) {
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

   return filter_func_map[sort](filtered)
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
   let data = storageRetrieve('crochets')
   if (!data) {
      seed()
      data = storageRetrieve('crochets')
   }
   allProducts = data || []
   currentProducts = sanitize(allProducts)

   pagination.setTotal(currentProducts.length)
   renderGrid()
   pagination.render()
}

/* ===================== Modal ===================== */

function handleCardActivation(card) {
   const id = Number(card.dataset.id)
   modalProduct = allProducts.find(product => product.id === id)
   if (!modalProduct) return
   renderModalContent(modalProduct, modalElements)
   quantityControl.setMax(modalProduct.stock)
   quantityControl.reset()
   modal.open()
}

function handleAddToCart() {
   if (!modalProduct) return
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

   document.querySelector('.add-to-cart-btn').addEventListener('click', handleAddToCart)

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
