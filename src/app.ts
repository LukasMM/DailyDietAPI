import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { userRoutes } from './routes/user'
import { nutritionRoutes } from './routes/nutrition'
import { sessionRoutes } from './routes/session'

export const app = fastify()

app.register(cookie)

app.register(nutritionRoutes, {
  prefix: 'nutrition',
})

app.register(userRoutes, {
  prefix: 'user',
})

app.register(sessionRoutes, {
  prefix: 'session',
})
