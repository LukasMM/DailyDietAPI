import { FastifyInstance } from 'fastify'
import { authenticated } from '../middlewares/authenticated'
import { z } from 'zod'
import knex from 'knex'

export async function nutritionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticated)

  app.get('/', async (req) => {
    const { userId } = req.cookies

    const meals = await knex('nutrition').where('user_id', userId).select()

    return { meals }
  })

  app.get('/:id', async (req) => {
    const getNutritionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getNutritionParamsSchema.parse(req.params)

    const { userId } = req.cookies

    const meal = await knex('nutrition')
      .where({
        user_id: userId,
        id,
      })
      .first()

    return { meal }
  })

  app.get('/summary', async (req) => {
    const { userId } = req.cookies

    const amountMeal = await knex('nutrition').where('user_id', userId).count()

    const amountMealDiet = await knex('nutrition')
      .where({ user_id: userId, diet: true })
      .count()

    const amountMealNotDiet = await knex('nutrition')
      .where({ user_id: userId, diet: false })
      .count()

    const bestMealDiet = await knex('nutrition')
      .where({ user_id: userId })
      .count()
      .orderBy('date_hour', 'desc')
      .then((data) => {
        let bestSequence = 0
        let actualBest = 0

        data.forEach((meal) => {
          if (meal.diet) {
            actualBest++

            if (actualBest > bestSequence) {
              bestSequence = actualBest
            }
          } else {
            if (actualBest > bestSequence) {
              bestSequence = actualBest
            }
            actualBest = 0
          }
        })

        return bestSequence
      })

    return {
      amount_meal: amountMeal,
      amount_meal_diet: amountMealDiet,
      amount_meal_not_diet: amountMealNotDiet,
      best_meal_diet: bestMealDiet,
    }
  })

  app.post('/', async (req, reply) => {
    const createNutritionBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateHour: z.date(),
      diet: z.boolean(),
    })

    const { name, description, dateHour, diet } =
      createNutritionBodySchema.parse(req.body)

    const userId = req.cookies.userId

    await knex('nutrition').insert({
      user_id: userId,
      name,
      description,
      date_hour: dateHour,
      diet,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (req, reply) => {
    const { userId } = req.cookies

    const updateNutritionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const updateNutritionBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateHour: z.date(),
      diet: z.boolean(),
    })

    const { id } = updateNutritionParamsSchema.parse(req.params)
    const { name, description, dateHour, diet } =
      updateNutritionBodySchema.parse(req.body)

    await knex('nutrition')
      .where({
        user_id: userId,
        id,
      })
      .update({
        name,
        description,
        date_hour: dateHour,
        diet,
      })

    return reply.status(200).send()
  })

  app.delete('/:id', async (req, reply) => {
    const { userId } = req.cookies

    const updateNutritionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateNutritionParamsSchema.parse(req.params)

    await knex('nutrition')
      .where({
        user_id: userId,
        id,
      })
      .del()

    return reply.status(200).send()
  })
}
