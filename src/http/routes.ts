import { FastifyInstance } from 'fastify'
import { register } from './controllers/registerController'
import { authenticate } from './controllers/authenticateController'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register) // Criando um registro
  app.post('/sessions', authenticate) // Criando authenticacao
}
