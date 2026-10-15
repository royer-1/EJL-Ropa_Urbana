import { Router } from 'express'
import { pool } from '../db.js'

import { ColorRow, ImageRow, SizeRow } from '../types.js'

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

    const product = products[0]

    const [colorRows] = await pool.query(
      'SELECT id, name, hex_code FROM product_colors WHERE product_id = ? ORDER BY sort_order', [product.id]
    )

    const colors = colorRows as ColorRow[]

    if (colors.length === 0) {
      return res.json({ ...product, colors: [] })
    }

    const colorIds = colors.map((c) => c.id)

    const [imageRows] = await pool.query(
      'SELECT id, color_id, url FROM product_images WHERE color_id IN (?) ORDER BY sort_order', [colorIds]
    )

    const images = imageRows as ImageRow[]
    
    const [sizeRows] = await pool.query(
      'SELECT color_id, size, is_sold_out FROM product_variants WHERE color_id IN (?)', [colorIds] 
    )

    const sizes = sizeRows as SizeRow[]

    const result = {
      ...product,
      colors: colors.map((color) => ({
        ...color,
        images: images.filter((img) => img.color_id === color.id),
        sizes: sizes.filter((s) => s.color_id === color.id),
      })),
    }

    res.json(result)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching product' })
  }
})

export default router