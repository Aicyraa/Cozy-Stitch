/* ===================== Modal ===================== */

export function createQuantityControl(
   { valueEl, decreaseBtn, increaseBtn },
   { min = 1 } = {},
) {
   let quantity = min
   let max = Infinity

   function clamp(value) {
      return Math.min(Math.max(value, min), max)
   }

   function render() {
      valueEl.textContent = quantity
      decreaseBtn.disabled = quantity <= min
      increaseBtn.disabled = quantity >= max
   }

   function setQuantity(value) {
      quantity = clamp(value)
      render()
   }

   function setMax(value) {
      max = value
      setQuantity(quantity)
   }

   function reset() {
      setQuantity(min)
   }

   decreaseBtn.addEventListener('click', () => setQuantity(quantity - 1))
   increaseBtn.addEventListener('click', () => setQuantity(quantity + 1))

   return { get quantity() { return quantity }, setQuantity, setMax, reset }
}

export function createModal(overlayEl, closeBtnEl) {
   function open() {
      overlayEl.classList.add('active')
   }

   function close() {
      overlayEl.classList.remove('active')
   }

   function isOpen() {
      return overlayEl.classList.contains('active')
   }

   closeBtnEl.addEventListener('click', close)

   overlayEl.addEventListener('click', event => {
      if (event.target === overlayEl) close()
   })

   document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close()
   })

   return { open, close, isOpen }
}

/* ===================== Pagination ===================== */

export function createPagination(container, { pageSize = 8 } = {}) {
   let currentPage = 1
   let totalItems = 0
   let onPageChange = null

   const totalPages = () => Math.max(1, Math.ceil(totalItems / pageSize))

   function setTotal(count) {
      totalItems = count
      currentPage = Math.min(currentPage, totalPages())
   }

   function reset() {
      currentPage = 1
   }

   function pageItems(items) {
      const start = (currentPage - 1) * pageSize
      return items.slice(start, start + pageSize)
   }

   function render() {
      const pages = totalPages()

      if (pages <= 1) {
         container.innerHTML = ''
         return
      }

      const btn = (label, page, { active = false, disabled = false } = {}) =>
         `<button type="button" class="page-btn${active ? ' active' : ''}" data-page="${page}" ${
            disabled ? 'disabled' : ''
         } aria-label="Page ${page}">${label}</button>`

      const numbers = Array.from({ length: pages }, (_, i) =>
         btn(i + 1, i + 1, { active: i + 1 === currentPage }),
      ).join('')

      container.innerHTML =
         btn('‹', currentPage - 1, { disabled: currentPage === 1 }) +
         numbers +
         btn('›', currentPage + 1, { disabled: currentPage === pages })
   }

   container.addEventListener('click', event => {
      const button = event.target.closest('.page-btn')
      if (!button || button.disabled) return
      currentPage = Number(button.dataset.page)
      render()
      if (onPageChange) onPageChange()
   })

   return {
      get currentPage() {
         return currentPage
      },
      setTotal,
      reset,
      pageItems,
      render,
      onChange: callback => {
         onPageChange = callback
      },
   }
}