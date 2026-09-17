/* ===================== Imports ===================== */

import {
   storageRetrieveCart,
   cartRemove,
   cartUpdateQuantity,
   cartTotal,
   cartClear,
} from '../store/cart-store.js'
import { parseCartItem } from './product-card.js'
import { formatPrice } from '../utils/format.js'
import { createModal } from './dialog.js'

/* ===================== DOM References ===================== */

const cartOverlay = document.getElementById('cartOverlay')
const cartClose = document.getElementById('cartClose')
const cartButton = document.querySelector('.cart button')
const itemsEl = cartOverlay.querySelector('.cart-items')
const totalEl = cartOverlay.querySelector('.cart-total')
const checkoutBtn = cartOverlay.querySelector('.cart-checkout-btn')
const badgeEl = cartButton.querySelector('.cart-badge')

const drawer = createModal(cartOverlay, cartClose)

/* ===================== Rendering ===================== */

const EMPTY_CART_MESSAGE =
   '<p class="cart-empty">Your cart is empty. Add some cozy pieces!</p>'

function getCartCount(cart) {
   return cart.reduce((sum, item) => sum + item.quantity, 0)
}

function renderBadge(cart) {
   const count = getCartCount(cart)
   badgeEl.textContent = count
   badgeEl.hidden = count === 0
}

function renderCart() {
   const cart = storageRetrieveCart()

   if (cart.length === 0) {
      itemsEl.innerHTML = EMPTY_CART_MESSAGE
      checkoutBtn.disabled = true
   } else {
      itemsEl.innerHTML = cart.map(parseCartItem).join('')
      checkoutBtn.disabled = false
   }

   totalEl.innerHTML = formatPrice(cartTotal(cart))
   renderBadge(cart)
}

function openCart() {
   renderCart()
   drawer.open()
}

/* ===================== Item Actions ===================== */

function handleCartItemClick(event) {
   const itemEl = event.target.closest('.cart-item')
   if (!itemEl) return

   const id = Number(itemEl.dataset.id)

   if (event.target.closest('.cart-item-remove')) {
      cartRemove(id)
   } else if (event.target.closest('.cart-item-qty-minus')) {
      cartUpdateQuantity(id, -1)
   } else if (event.target.closest('.cart-item-qty-plus')) {
      cartUpdateQuantity(id, 1)
   } else {
      return
   }

   renderCart()
}

/* ===================== Init ===================== */

checkoutBtn.addEventListener('click', () => {
   cartClear()
   renderCart()
   drawer.close()
})

cartButton.addEventListener('click', openCart)
itemsEl.addEventListener('click', handleCartItemClick)
renderBadge(storageRetrieveCart())