import type { HttpContext } from '@adonisjs/core/http'
import Stream from '#models/stream'
import Provider from '#models/provider'
import Stream_manager from '#models/stream_manager'
import stream_manager from '#models/stream_manager'
import logger from '@adonisjs/core/services/logger'

export default class StreamsController {
  async index({ response, auth }: HttpContext) {
    const streams = await Stream.query().where('userId', auth.user!.id)
    return response.ok({ streams })
  }

  async start({ params, response }: HttpContext) {
    const stream = await Stream.query()
      .preload('providers', (query) => {
        query.pivotColumns(['on_primary'])
      })
      .where('id', params.id)
      .firstOrFail()

    logger.info(`Providers associés: ${JSON.stringify(stream.providers)}`)

    const streamManager = Stream_manager
    const streamInstance = streamManager.getOrAddStream(params.id, stream)

    if (!stream) {
      return response.notFound({ error: 'Stream not found' })
    }
    await streamInstance.run()
    return response.ok({ message: 'Stream started' })
  }

  async stop({ params, response }: HttpContext) {
    const streamManager = Stream_manager
    const stream = streamManager.getStream(params.id)

    if (!stream) {
      return response.notFound({ error: 'Stream not found' })
    }

    await stream.stop()
    streamManager.removeStream(params.id)
    return response.ok({ message: 'Stream stopped' })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const { title, timeline, runLive } = request.all()
    const providersForm = request.input('providers') || []

    if (!title || !providersForm || !timeline) {
      return response.badRequest({ error: 'Missing required fields' })
    }

    const providerPromises = providersForm.map((provider: any) => Provider.findOrFail(provider.id))
    await Promise.all(providerPromises)

    const primaryProvider = providersForm.filter((item) => item.onPrimary === true).length

    if (!primaryProvider) {
      return response.badRequest({ error: 'Primary provider is required' })
    } else if (primaryProvider > 1) {
      return response.badRequest({ error: 'Only one primary provider is allowed' })
    }

    const stream = await Stream.create({
      name: request.input('title'),
      pid: 0,
      status: 'inactive',
      startTime: null,
      endTime: null,
      userId: user.id,
      type: request.input('type'),
    })

    if (stream && providersForm) {
      for (const provider of providersForm) {
        await stream.related('providers').attach({
          [provider.id]: {
            on_primary: provider.onPrimary,
          },
        })
      }
    }

    if (runLive) {
      const streamManager = Stream_manager

      const streamInstance = streamManager.getOrAddStream(stream.id.toString(), stream)
      await streamInstance.run()
    }
    return response.created(stream)
  }

  async destroy({ params, response }: HttpContext) {
    const stream = await Stream.findOrFail(params.id)
    const streamManager = Stream_manager
    if (!stream) {
      return response.notFound({ error: 'Stream not found' })
    }
    streamManager.removeStream(params.id)
    await stream.delete()
    return response.ok({ message: 'Stream deleted' })
  }
}
