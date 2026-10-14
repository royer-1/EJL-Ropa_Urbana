import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, slug, price, previous_price, audience FROM products WHERE is_visible = 1'
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching products' })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.description, p.material,
              p.price, p.previous_price, p.audience,
              c.name AS category,
              b.name AS badge
       FROM products p
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN badges b ON b.id = p.badge_id
       WHERE p.slug = ? AND p.is_visible = 1`,
      [slug]
    )

    const products = rows as any[]
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(products[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching product' })
  }
})

export default router