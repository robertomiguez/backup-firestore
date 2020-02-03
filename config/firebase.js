const admin = require('firebase-admin'),
  serviceAccount = require('./firebaseKey.json')

module.exports = async () => {
  try {
    if (admin.apps.length) return admin.firestore() // already initialized
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://flightwith-80e39.firebaseio.com'
    })
    // console.log('Firebase connected.')
    return admin.firestore()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}