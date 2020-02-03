const fs = require('fs'),
 { promisify } = require('util')

const writeFile = async (db,collectionName) => {
 
  const data = {}
  data[collectionName] = {}

  const snapshot = await db.collection(collectionName).get()
  const writeFile = promisify(fs.writeFile)
  try {
    if (snapshot.empty) {
      return console.log(`collection ${collectionName} not exists.`)
    }
    snapshot.forEach(doc => {
      data[collectionName][doc.id] = doc.data()
    })
    
    await writeFile(`./backup-files/${collectionName}-dump.json`, JSON.stringify(data))
    console.log(`The collection ${collectionName} was exported to ${collectionName}-dump.json.`)
    
  } catch (error) {
    console.log(error)
  }
}

const getNameCollections = async (db) => {

  listCollection = [] 
  try {
    const collections = await db.listCollections()
    for (let collection of collections) {
      listCollection.push(collection.id)
    }
    return listCollection
  } catch (error) {
    console.log(`error: ${error}`) 
  }
}

module.exports = {
  writeFile,
  getNameCollections
}