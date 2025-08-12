import jwt from 'jsonwebtoken';
import prisma from '../index.js';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       tryItOutEnabled: true
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authentication
 */

async function authMiddleware (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).send('Unauthorized')
    
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY)
    
    const user = await prisma.user.findUnique({where: {id: decoded.userId}})
    if (user) {
      req.userId = user.id
      next()
    } else 
      return res.status(401).send('User not found')
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') 
      return res.status(401).send('Token expired')
    
    return res.status(401).send('Invalid token')
  }
}

export default authMiddleware;