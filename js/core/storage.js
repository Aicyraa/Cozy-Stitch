/* ===================== Storage ===================== */

function storageSave(key, data) {
   localStorage.setItem(key, JSON.stringify(data))
}

function storageRetrieve(key) {
   const raw = localStorage.getItem(key)
   return raw ? JSON.parse(raw) : null
}

export { storageSave, storageRetrieve }