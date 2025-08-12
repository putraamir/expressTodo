import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../index.js';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     tryItOutEnabled: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for registration
 *               password:
 *                 type: string
 *                 description: Password for registration
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: JWT token
 *       400:
 *         description: Bad request - missing username/password or user already exists
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Username and password are required"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     tryItOutEnabled: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for login
 *               password:
 *                 type: string
 *                 description: Password for login
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: JWT token
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "User not found"
 */

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const router = express.Router();

router.post('/register', async (req, res) => {    
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password)
    return res.status(400).send('Username and password are required');
  
  const existingUser = await prisma.user.findUnique({where: {username: username}})
  if (existingUser) return res.status(400).send('User already exists')
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {username: username, password: hashedPassword }
  const createdUser = await prisma.user.create({data: user})
  const todo = {userId: createdUser.id, title: 'Welcome to the todo app', completed: false }
  await prisma.todo.create({data: todo})
  const token = jwt.sign({ userId: createdUser.id }, JWT_SECRET_KEY, {expiresIn: '1h'});
  res.send(token).status(200)
});

router.post('/login', async (req, res) => {    
  const username = req.body.username;
  const password = req.body.password;
  
  const user = await prisma.user.findUnique({where: {username: username}})
  if (!user) 
    return res.status(401).send('User not found')
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).send('Invalid password')

  const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {expiresIn: '1h'});
  res.send(token).status(200)
});

export default router;