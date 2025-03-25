const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const { getAsync } = require('../redis');
const { TODO_COUNTER_KEY } = require('../util/constants');

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  try {
      const count = (await getAsync(TODO_COUNTER_KEY)) || 0;
      res.json({ added_todos: parseInt(count) });
  } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
