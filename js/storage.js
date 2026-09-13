function storage_save(data) {
   localStorage.setItem('crochets', JSON.stringify(data))
   return
}

function storage_retrive(key) {
   const raw = localStorage.getItem(str)
   return JSON.parse(raw)
}

export { storage_save, storage_retrive }
