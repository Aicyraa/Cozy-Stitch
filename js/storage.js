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

function normalizeCart(cart) {
   return cart.map(item => {
      if (item.product) return item
      const { quantity, total, ...product } = item
      return {
         id: item.id,
         product: { ...product },
         quantity,
         total,
      }
   })
}

function storageRetrieveCart() {
   return normalizeCart(storageRetrieve(CART_KEY) || [])
}

function cartAdd(product, quantity) {
   const cart = storageRetrieveCart()
   const existing = cart.find(item => item.id === product.id)

   if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
      existing.total = Number(existing.product.price) * existing.quantity
   } else {
      cart.push({
         id: product.id,
         product: { ...product },
         quantity,
         total: Number(product.price) * quantity,
      })
   }

   storageSave(CART_KEY, cart)
   return cart
}

function cartRemove(id) {
   const cart = storageRetrieveCart().filter(item => item.id !== id)
   storageSave(CART_KEY, cart)
   return cart
}

function cartUpdateQuantity(id, delta) {
   const cart = storageRetrieveCart()
   const item = cart.find(item => item.id === id)
   if (!item) return cart

   item.quantity = Math.min(Math.max(item.quantity + delta, 1), item.product.stock)
   item.total = Number(item.product.price) * item.quantity

   storageSave(CART_KEY, cart)
   return cart
}

function cartTotal(cart) {
   return cart.reduce((sum, item) => sum + Number(item.total), 0)
}

function cartClear() {
   storageSave(CART_KEY, [])
}

export { storageSave, storageRetrieve, storageRetrieveCart, cartAdd, cartRemove, cartUpdateQuantity, cartTotal, cartClear }