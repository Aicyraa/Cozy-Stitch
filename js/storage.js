function storageSave(data) {
   localStorage.setItem('crochets', JSON.stringify(data))
   return
}

function storageRetrieve(key) {
   const raw = localStorage.getItem(key)
   return raw ? JSON.parse(raw) : null
}

export { storageSave, storageRetrieve }
