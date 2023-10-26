import { FastifyInstance } from 'fastify'
import { compare } from 'bcrypt'
import knex from 'knex'
import { z } from 'zod'

export async function sessionRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createSessionBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = createSessionBodySchema.parse(req.body)

    const user = await knex('users').where({ email }).first()

    if (!user) {
      return reply.status(401).send({
        error: 'E-mail e/ou senha incorreta.',
      })
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      return reply.status(401).send({
        error: 'E-mail e/ou senha incorreta.',
      })
    }

    reply.setCookie('sessionDietAPI', user.id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send()
  })
}
