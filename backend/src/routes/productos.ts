import { Router } from 'express';
import { pool } from "../db.js";

const router = Router()

router.get('/', async(_req, res) =>{
  try {
    const [filas] = await pool.query(
      'SELECT id, nombre, slug, precio,  precio_anterior, publico FROM productos WHERE visible = 1'
    )
    res.json(filas)
  } catch (error) {
    console.log(error)
    res.status(500).json({mensaje: 'Error al obtener los productos'})
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const [filas] = await pool.query(
      `SELECT p.id, p.nombre, p.slug, p.descripcion, p.material,
              p.precio, p.precio_anterior, p.publico,
              c.nombre AS categoria,
              e.nombre AS etiqueta
       FROM productos p
       JOIN categorias c ON c.id = p.categoria_id
       LEFT JOIN etiquetas e ON e.id = p.etiqueta_id
       WHERE p.slug = ? AND p.visible = 1`,
       [slug]
    )

    const productos = filas as any[]
    if (productos.length === 0) {
      return res.status(404).json({mensaje: 'Producto no encontrado'})
    }

    res.json(productos[0])
  } catch (error) {
    console.log(error)
    res.status(500).json({mensaje: 'Error al obtener el producto'})
  }
})

export default router