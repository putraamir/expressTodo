import express from 'express';
import prisma from '../index.js';

/**
 * @swagger
 * /todo:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     tryItOutEnabled: true
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     tryItOutEnabled: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Todo title
 *     responses:
 *       200:
 *         description: Todo created successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Todo Created: {\"id\":1,\"userId\":1,\"title\":\"New Todo\",\"completed\":false}"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 */

/**
 * @swagger
 * /todo/{id}:
 *   put:
 *     summary: Update a todo's title
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     tryItOutEnabled: true
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title for the todo
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Todo Updated: {\"id\":\"uuid\",\"userId\":\"uuid\",\"title\":\"Updated\",\"completed\":false}"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     tryItOutEnabled: true
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Todo Deleted: {\"id\":\"uuid\",\"userId\":\"uuid\",\"title\":\"Some title\",\"completed\":false}"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Unauthorized"
 */

const router = express.Router();

router.get('/', async (req, res) =>{
  const userId = req.userId
  const todos = await prisma.todo.findMany({where: {userId: userId}})
  return res.json(todos)
})

router.post('/', async (req, res) => {
  const userId = req.userId;
  const title = req.body.title;
  const todo = {
    userId: userId,
    title: title,
    completed: false
}
  const created = await prisma.todo.create({data: todo})
  return res.send("Todo Created: " + JSON.stringify(created));
})

router.put('/:id', async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.id;
  const newTitle = req.body.title;
  const todo = await prisma.todo.findUnique({where: {id: todoId, userId: userId}})
  if (!todo) return res.status(404).send("Todo not found")
  const updated = await prisma.todo.update({where: {id: todoId, userId: userId}, data: {title: newTitle}})
  return res.send("Todo Updated: " + JSON.stringify(updated));
})

router.delete('/:id', async (req, res) => {
  const userId = req.userId;
  const todoId = req.params.id;
  const todo = await prisma.todo.findUnique({where: {id: todoId, userId: userId}})
  if (!todo) return res.status(404).send("Todo not found")
  const deleted = await prisma.todo.delete({where: {id: todoId, userId: userId}})
  return res.send("Todo Deleted: " + JSON.stringify(deleted));
})

export default router;