import { Router } from 'express';
import { pool } from "../db.js";

const router = Router()

router.get('/', async(_req, res) =>{
  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, slug, orden FROM categorias WHERE activa = 1 ORDER BY orden'
    )
    res.json(filas)
  } catch (error) {
    console.log(error);
    res.status(500).json({mensaje: 'Error al obtener las categorias'})
  }
})

export default router