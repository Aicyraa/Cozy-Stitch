import { storageRetrieve } from '../storage.js'
import { parseProduct } from '../render.js'
import { createPagination } from '../helper.js'
import seed from '../populate.js'

const PAGE_SIZE = 8

const productGrid = document.querySelector('.product-grid')
const pagination = createPagination(document.getElementById('pagination'), { pageSize: PAGE_SIZE })
const productModal = document.getElementById('productModal')
const modalClose = document.getElementById('modalClose')
const resetFilters = document.getElementById('resetFilters')

let currentProducts = []
let allProducts = []

const modalImage = document.querySelector('.modal-image')
const modalCategory = document.querySelector('.modal-category')
const modalName = document.querySelector('.modal-name')
const modalRating = document.querySelector('.modal-rating')
const modalSize = document.querySelector('.modal-size')
const modalSold = document.querySelector('.modal-sold')
const modalDescription = document.querySelector('.modal-description')
const modalPrice = document.querySelector('.modal-price')
const modalStock = document.querySelector('.modal-stock')

const filter_func_map = {
   default: data => data,
   'price-asc': data => [...data].sort((a, b) => Number(a.price) - Number(b.price)),
   'price-desc': data => [...data].sort((a, b) => Number(b.price) - Number(a.price)),
   'top-sellers': data => [...data].sort((a, b) => Number(b.total_sold) - Number(a.total_sold)),
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

pagination.onChange(() => renderGrid())

function renderGrid() {
   productGrid.innerHTML = ''

   if (currentProducts.length === 0) {
      productGrid.innerHTML = '<div class="empty-state">No Product Available</div>'
      return
   }

   pagination.pageItems(currentProducts).forEach(product =>
      productGrid.appendChild(parseProduct(product)),
   )
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

function openModal(product) {
   modalImage.style.backgroundImage = `url('../assets/crochets/${product.image}')`
   modalCategory.textContent = product.category
   modalName.textContent = product.name
   modalRating.textContent = `★ ${product.rating}`
   modalSize.textContent = `Size ${product.size}`
   modalSold.textContent = `${product.total_sold} sold`
   modalDescription.textContent = product.description
   modalPrice.innerHTML = `&#8369;${Number(product.price).toFixed(2)}`
   modalStock.textContent = `${product.stock} in stock`
   productModal.classList.add('active')
}

function closeModal() {
   productModal.classList.remove('active')
}

function handleCardActivation(card) {
   const id = Number(card.dataset.id)
   const selected = allProducts.find(product => product.id === id)
   if (!selected) return
   openModal(selected)
}

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

   modalClose.addEventListener('click', closeModal)

   productModal.addEventListener('click', event => {
      if (event.target === productModal) closeModal()
   })

   document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModal()
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