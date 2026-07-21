import mongoose from 'mongoose';

// Conexion a MongoDB Atlas usando la URI del .env
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta la variable MONGODB_URI en el archivo .env');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB conectado correctamente');
}
