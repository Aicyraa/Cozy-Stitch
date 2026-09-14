function parseProduct(product) {
   const div = document.createElement('div')
   div.style.backgroundImage = `url('../assets/crochets/${product.name}')`
   div.className = 'product-card'
   div.setAttribute('role', 'button')
   div.tabIndex = 0
   div.dataset.id = product.id

   div.innerHTML = `
      <span class="card-size"> ${product.size} </span>
      <div class="card-info">
         <p class="card-category"> ${product.category}</p>
         <h3 class="card-name">${product.name}</h3>
         <div class="card-bottom">
            <p class="card-price">&#8369;${product.price}</p>
         </div>
      </div>
      `

   return div
}

export { parseProduct }
