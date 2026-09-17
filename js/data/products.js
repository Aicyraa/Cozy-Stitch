import { storageRetrieve } from '../core/storage.js'
import seed from './populate.js'

/* ===================== Products ===================== */

const PRODUCTS_KEY = 'crochets'

function getProducts() {
   let data = storageRetrieve(PRODUCTS_KEY)
   if (!data) {
      seed()
      data = storageRetrieve(PRODUCTS_KEY)
   }
   return data || []
}

export { getProducts }