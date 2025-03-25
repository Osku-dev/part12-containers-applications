const express = require('express');
const { Todo } = require('../mongo')
const { getAsync, setAsync } = require('../redis');
const router = express.Router();

const TODO_COUNTER_KEY = 'todo_counter';

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);

  try {
    const currentCount = (await getAsync(TODO_COUNTER_KEY)) || 0;
    const newCount = parseInt(currentCount) + 1;
    await setAsync(TODO_COUNTER_KEY, newCount);
} catch (error) {
    console.error('Error updating todo counter:', error);
}
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

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;

  req.todo.text = text !== undefined ? text : req.todo.text;
  req.todo.done = done !== undefined ? done : req.todo.done;

  const updatedTodo = await req.todo.save();
  res.send(updatedTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
