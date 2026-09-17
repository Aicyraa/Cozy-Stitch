/* ===================== Images ===================== */

function slugify(name) {
   return name.toLowerCase().split(/\s+/).join('_')
}

function productImage(product) {
   return `../assets/products/${slugify(product.name)}-removebg-preview.png`
}

export { slugify, productImage }