import { Router } from 'express'
import { pool } from '../db.js'

import type { ResultSetHeader } from 'mysql2'
import { slugify } from '../utils.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, slug, sort_order FROM categories WHERE is_active = 1 ORDER BY sort_order'
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al recuperar las categorías' })
  }
})

router.post('/', async (req, res) => {
  try {
    const {name, sort_order = 0} = req.body

    if(typeof name !== 'string' || name.trim() === ''){
      return res.status(400).json({message: 'Nombre es requerido'})
    }

    const cleanName = name.trim()
    const slug = slugify(cleanName)

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)', [cleanName, slug, sort_order]
    )

    res.status(201).json({id: result.insertId, name: cleanName, slug, sort_order})

  } catch (error: any) {
    if(error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({message: 'La categoria ya existe'})
    }
    console.error(error)
    res.status(500).json({message: 'Error al crear la categoria'})
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
      return res.status(400).json({message: 'Id Invalido'})
    }

    const {name, sort_order = 0, is_active = 1} = req.body

    if(typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({message: 'Nombre es requerido'})
    }

    const cleanName = name.trim()
    const slug = slugify(cleanName)

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE categories SET name = ?, slug = ?, sort_order = ?, is_active = ? WHERE id= ?', [cleanName, slug, sort_order, is_active, id]
    )

    if(result.affectedRows === 0) {
      return res.status(404).json({message: 'Categoria no encontrada'})
    }

    res.json({id, name: cleanName, slug, sort_order, is_active})

  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({message: 'La categoria ya existe'})
    }
    console.error(error)
    res.status(500).json({message: 'Error al actualizar la categoria'})
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
      return res.status(400).json({message: 'Id Invalido'})
    }

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM categories WHERE id = ?', [id]
    )

    if(result.affectedRows === 0) {
      return res.status(404).json({message: 'Categoria no encontrada'})
    }
    res.json({message: 'Categoria eliminada'})

  } catch (error: any) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({message: 'La categoria contiene productos'})
    }
    console.error(error)
    res.status(500).json({message: 'Error al eliminar la categoria'})
  }
})

export default router