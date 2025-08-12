import express from 'express'
import swaggerUi from 'swagger-ui-express'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import multer from 'multer'
import { specs } from './config/swagger.js'
import prisma from './index.js'

const app = express()
const port = 3000
const upload = multer();

app.use(express.json());
app.use(upload.any());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use('/auth', authRoutes)
app.use('/todo', authMiddleware, todoRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
