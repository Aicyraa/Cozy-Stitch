/* ===================== Product Cards ===================== */

function formatPrice(value) {
   return `₱${Number(value).toFixed(2)}`
}

function parseProduct(product) {
   return `
      <div class="product-card" role="button" tabindex="0" data-id="${product.id}"
         style="background-image:url('../assets/crochets/${product.image}')">
         <span class="card-size"> ${product.size} </span>
         <div class="card-info">
            <p class="card-category"> ${product.category}</p>
            <h3 class="card-name">${product.name}</h3>
            <div class="card-bottom">
               <p class="card-price">${formatPrice(product.price)}</p>
            </div>
         </div>
      </div>
   `
}

/* ===================== Modal Content ===================== */

function renderModalContent(product, els) {
   els.image.style.backgroundImage = `url('../assets/crochets/${product.image}')`
   els.category.textContent = product.category
   els.name.textContent = product.name
   els.rating.innerHTML = `★ <span class="rating-value">${product.rating}</span>`
   els.size.textContent = product.size
   els.description.textContent = product.description
   els.price.innerHTML = formatPrice(product.price)
}

/* ===================== Cart Items ===================== */

function parseCartItem(item) {
   const { id, product, quantity, total } = item
   return `
      <div class="cart-item" data-id="${id}">
         <div class="cart-item-image"
            style="background-image:url('../assets/crochets/${product.image}')">
         </div>
         <div class="cart-item-info">
            <div class="cart-item-top">
               <h4 class="cart-item-name">${product.name}</h4>
               <button type="button" class="cart-item-remove" aria-label="Remove item">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                     <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3"
                        stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                        stroke-linejoin="round" fill="none" />
                  </svg>
               </button>
            </div>
            <p class="cart-item-meta">Size ${product.size} · ${formatPrice(product.price)}</p>
            <div class="cart-item-controls">
               <div class="cart-item-qty">
                  <button type="button" class="cart-item-qty-minus" aria-label="Decrease quantity"
                     ${quantity <= 1 ? 'disabled' : ''}>&minus;</button>
                  <span class="cart-item-qty-value">${quantity}</span>
                  <button type="button" class="cart-item-qty-plus" aria-label="Increase quantity"
                     ${quantity >= product.stock ? 'disabled' : ''}>+</button>
               </div>
               <p class="cart-item-total">${formatPrice(total)}</p>
            </div>
         </div>
      </div>
   `
}

export { parseProduct, renderModalContent, formatPrice, parseCartItem }
