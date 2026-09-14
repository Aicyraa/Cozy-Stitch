import { storageRetrieve } from '../storage.js'
import { parseProduct } from '../render.js'
import { createPagination } from '../helper.js'

const PAGE_SIZE = 8

const productGrid = document.querySelector('.product-grid')
const pagination = createPagination(document.getElementById('pagination'), { pageSize: PAGE_SIZE })

let currentProducts = []

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
   const data = storageRetrieve('crochets')
   currentProducts = data ? sanitize(data) : []

   pagination.setTotal(currentProducts.length)
   renderGrid()
   pagination.render()
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

   renderProducts()
})()