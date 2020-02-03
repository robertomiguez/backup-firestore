const fs = require('fs'),
  { promisify } = require('util')

const createCollection = async (db, collectionName, doc, content) => {
  try {
    await db.collection(collectionName).doc(doc).set(content)
    console.log(`Document added to firestore!`)
  } catch (error) {
    console.log(error)
  }
}

const readFile = async (db,fileName) => {
  const readFile = promisify(fs.readFile)
  try {
    const data = await readFile(`./backup-files/${fileName}`,'utf8')
    // cast string from file to an array
    const dataArray = JSON.parse(data)

    // do not work async await with forEach :(
    // dataArray.forEach(collectionName => {
    //   dataArray[collectionName].forEach(doc => {
    //     await createCollection(db, collectionName, doc, dataArray[index][doc])
    //   })
    // })
 
    for (const collectionName in dataArray) {
      for (const doc in dataArray[collectionName]) {
        if (dataArray[collectionName].hasOwnProperty(doc)) {
          await createCollection(db, collectionName, doc, dataArray[collectionName][doc])
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const getFiles = async () => {
  try {
    const readFile = promisify(fs.readdir);
    return await readFile('./backup-files/')
  } catch (error) {
    console.log( error )
  }
}

module.exports = {
  readFile,
  getFiles
}
