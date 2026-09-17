/* ===================== Images ===================== */

function slugify(name) {
   return name.toLowerCase().split(/\s+/).join('_')
}

function productImage(product) {
   return `../assets/products/${slugify(product.name)}.png`
}

export { slugify, productImage }