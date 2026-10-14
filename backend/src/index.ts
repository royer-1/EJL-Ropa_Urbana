import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { pool } from './db.js'
import productosRouter from "./routes/productos.js";
import categoriasRouter from "./routes/categorias.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/productos', productosRouter)
app.use('/api/categorias', categoriasRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'API funcionando' })
})

app.get('/api/db-check', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado')
    res.json({ ok: true, rows })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'No se pudo conectar a la base de datos' })
  }
})


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})