import { MongoClient } from 'mongodb'
<<<<<<< HEAD
const client = new MongoClient(process.env.MONGO_URI!)
await client.connect()
const db = client.db(process.env.MONGO_DB!)

export { db }
=======


const client = new MongoClient(process.env.MONGOURI!)
await client.connect()
const db = client.db(process.env.MONGODB!)

export { db }
>>>>>>> 5c061873aab0e755a4d269c13383c7e05421997d
