const express = require('express');
const { Todo } = require('../mongo')
const { getAsync, setAsync } = require('../redis');
const { TODO_COUNTER_KEY } = require('../util/constants');
const router = express.Router();


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
