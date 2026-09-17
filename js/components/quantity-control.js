/* ===================== Quantity Control ===================== */

function createQuantityControl(
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

export { createQuantityControl }