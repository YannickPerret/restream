/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import Stream_manager from '#models/stream_manager'
import logger from '@adonisjs/core/services/logger'
const GuestsController = () => import('#controllers/guests_controller')
const TimelinesController = () => import('#controllers/timelines_controller')
const PlaylistsController = () => import('#controllers/playlists_controller')
const VideosController = () => import('#controllers/videos_controller')
const SearchesController = () => import('#controllers/searches_controller')
const ProviderController = () => import('#controllers/providers_controller')
const StreamsController = () => import('#controllers/streams_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async ({ response }) => response.ok({ uptime: Math.round(process.uptime()) }))

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [AuthController, 'register'])
        router.post('login', [AuthController, 'login'])
        router.post('logout', [AuthController, 'logout']).use(middleware.auth())
      })
      .prefix('auth')

    router
      .group(() => {
        router.post('upload', [GuestsController, 'upload'])
      })
      .prefix('guests')

    router
      .group(() => {
        router
          .group(() => {
            router.get('/', [StreamsController, 'index'])
            router.post('/', [StreamsController, 'store'])
            router.post(':id/start', [StreamsController, 'start'])
            router.post(':id/stop', [StreamsController, 'stop'])
            router.delete(':id', [StreamsController, 'destroy'])
          })
          .prefix('streams')

        router
          .group(() => {
            router.get('/', [ProviderController, 'index'])
            router.post('/', [ProviderController, 'store'])
            router.delete(':id', [ProviderController, 'destroy'])
            router.get(':id', [ProviderController, 'show'])
          })
          .prefix('providers')

        router
          .group(() => {
            router.get('/', [VideosController, 'index'])
            router.post('/', [VideosController, 'store'])
            router.get(':id', [VideosController, 'show'])
            router.put(':id', [VideosController, 'update'])
            router.delete(':id', [VideosController, 'destroy'])
            router.post(':id/validate', [VideosController, 'validate'])
          })
          .prefix('videos')

        router
          .group(() => {
            router.get('/', [PlaylistsController, 'index'])
            router.post('/', [PlaylistsController, 'store'])
            router.get(':id', [PlaylistsController, 'show'])
            router.put(':id', [PlaylistsController, 'update'])
            router.delete(':id', [PlaylistsController, 'destroy'])
          })
          .prefix('playlists')

        router
          .group(() => {
            router.get('/', [TimelinesController, 'index'])
            router.post('/', [TimelinesController, 'store'])
            router.get(':id', [TimelinesController, 'show'])
            router.put(':id', [TimelinesController, 'update'])
            router.delete(':id', [TimelinesController, 'destroy'])
          })
          .prefix('timelines')

        router
          .group(() => {
            router.get('streamManager', ({ response }) => {
              const streamManager = Stream_manager
              return response.ok({ streams: streamManager.getAllStreams() })
            })
          })
          .prefix('admin')

        router.group(() => {
          router.get('/search', [SearchesController, 'index'])
        })
      })
      .use(middleware.auth())
  })
  .prefix('api')

router.group(() => {
  router.get('videos/:id/serve', [VideosController, 'serve'])
})
