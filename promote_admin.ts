import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserModel from './src/Data/models/User'

dotenv.config()

async function run() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('No MONGODB_URI found')
    return
  }

  await mongoose.connect(uri, {
    dbName: 'indore_travel'
  })
  console.log('Connected to MongoDB.')

  // Promote vanshdhumal5@gmail.com
  const res5 = await UserModel.updateOne(
    { email: 'vanshdhumal5@gmail.com' },
    { $set: { role: 'admin' } }
  )
  console.log('Promoting vanshdhumal5@gmail.com:', res5)

  await mongoose.disconnect()
  console.log('Disconnected!')
}

run().catch(console.error)
