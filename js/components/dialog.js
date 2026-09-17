/* ===================== Dialog ===================== */

function createModal(overlayEl, closeBtnEl) {
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

export { createModal }