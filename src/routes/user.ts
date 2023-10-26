import { FastifyInstance } from 'fastify'
import { hash } from 'bcrypt'
import knex from 'knex'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(req.body)

    const checkEmailExist = await knex('users').where({ email })

    if (checkEmailExist.length > 0) {
      return reply.status(401).send({
        error: 'E-mail já cadastrado!',
      })
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({ name, email, password: hashedPassword })

    return reply.status(201).send()
  })
}
