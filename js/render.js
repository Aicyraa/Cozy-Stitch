/* ===================== Product Cards ===================== */

function formatPrice(value) {
   return `&#8369;${Number(value).toFixed(2)}`
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

export { parseProduct, renderModalContent, formatPrice }
