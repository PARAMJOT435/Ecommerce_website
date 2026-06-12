import jwt from 'jsonwebtoken'
import env from '../config/env'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const generateToken = (payload: JWTPayload, expiresIn = '7d'): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    return decoded as JWTPayload
  } catch (error) {
    return null
  }
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token)
    return decoded as JWTPayload
  } catch (error) {
    return null
  }
}
