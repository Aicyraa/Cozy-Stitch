/* ===================== Storage ===================== */

const CART_KEY = 'cart'

function storageSave(key, data) {
   localStorage.setItem(key, JSON.stringify(data))
}

function storageRetrieve(key) {
   const raw = localStorage.getItem(key)
   return raw ? JSON.parse(raw) : null
}

/* ===================== Cart ===================== */

function storageRetrieveCart() {
   return storageRetrieve(CART_KEY) || []
}

function cartAdd(product, quantity) {
   const cart = storageRetrieveCart()
   const existing = cart.find(item => item.id === product.id)

   if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
      existing.total = existing.price * existing.quantity
   } else {
      cart.push({
         ...product,
         quantity,
         price: Number(product.price),
         total: Number(product.price) * quantity,
      })
   }

   storageSave(CART_KEY, cart)
   return cart
}

export { storageSave, storageRetrieve, cartAdd }