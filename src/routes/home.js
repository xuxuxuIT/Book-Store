const express = require('express');
const router = express.Router();

router.get('/books', async (req, res) => {
    const pool = req.pool;
    try {
      const booksResult = await pool.query(`
        SELECT b.*, 
               (COALESCE(i.stock, 0) - COALESCE(o.order_total, 0)) AS stock
        FROM books b
        LEFT JOIN (
          SELECT book_id, 
                 SUM(CASE WHEN type = 'import' THEN quantity ELSE 0 END) -
                 SUM(CASE WHEN type = 'export' THEN quantity ELSE 0 END) AS stock
          FROM inventories
          GROUP BY book_id
        ) i ON b.id = i.book_id
        LEFT JOIN (
          SELECT book_id, SUM(quantity) AS order_total
          FROM orders
          GROUP BY book_id
        ) o ON b.id = o.book_id
        ORDER BY b.id
      `);
      const shopsResult = await pool.query('SELECT * FROM shops ORDER BY id');
      const categoriesResult = await pool.query('SELECT * FROM categories ORDER BY id');
      res.render('books', { 
        books: booksResult.rows, 
        shops: shopsResult.rows,
        categories: categoriesResult.rows 
      });
    } catch (error) {
      console.error('Error retrieving books:', error);
      res.status(500).send('Error retrieving books');
    }
  });