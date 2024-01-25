import fastify from 'fastify'
import { userRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(userRoutes)
app.register(gymsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validaton error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
    return
  } else {
    // TODO: should log to an external tool like datadog/sentry/newrelic
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
