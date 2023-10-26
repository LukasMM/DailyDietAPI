import { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticated(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.cookies.userId

  if (!userId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}
