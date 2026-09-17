import { formatPrice } from '../utils/format.js'
import { productImage } from '../utils/image.js'

/* ===================== Product Modal ===================== */

function renderProductModal(product) {
   return `
      <div class="modal-image" style="background-image:url('${productImage(product)}')"></div>

      <div class="modal-details">
         <div class="modal-topline">
            <p class="modal-category">${product.category}</p>
            <span class="modal-rating">★ <span class="rating-value">${product.rating}</span></span>
         </div>
         <h2 class="modal-name">${product.name}</h2>

         <p class="modal-size-line">Size · <span class="modal-size">${product.size}</span></p>

         <p class="modal-description">${product.description}</p>

         <div class="modal-buy">
            <div class="modal-price-row">
               <p class="modal-price">${formatPrice(product.price)}</p>
               <div class="modal-buy-controls">
                  <div class="quantity-control">
                     <button type="button" class="qty-decrease" aria-label="Decrease quantity">
                        &minus;
                     </button>
                     <span class="quantity-value">1</span>
                     <button type="button" class="qty-increase" aria-label="Increase quantity">
                        +
                     </button>
                  </div>
               </div>
            </div>

            <button type="button" class="add-to-cart-btn">Add to Cart</button>
         </div>
      </div>
   `
}

export { renderProductModal }