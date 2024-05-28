import scheduler from 'adonisjs-scheduler/services/main'
import Stream_manager from '#models/stream_manager'
import app from '@adonisjs/core/services/app'
import ace from '@adonisjs/core/services/ace'

scheduler
  .call(async () => {
    const streamManager = Stream_manager.getAllStreams()
    // 28 may 2024 - Perret - Fetch created by Quentin Neves
    const value = await fetch('https://www.coingecko.com/price_charts/30105/usd/24_hours.json', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        return data.stats[data.stats.length - 1][1] || 0
      })
    for (const stream of streamManager) {
      if (stream.status === 'active') {
        await stream.updateCryptoText(value)
      }
    }
  })
  .everyFifteenMinutes()

/*
 23 May 2024 - Perret - Code to start the scheduler when server up by Tom Gobich https://discord.com/channels/423256550564691970/423256550564691972/1242858943185682586
 */

if (app.getEnvironment() === 'web') {
  // boot ace, if already running it will ignore
  await ace.boot()

  // start the command
  const command = await ace.exec('scheduler:run', [])

  // stop the command when the app is terminating
  app.terminating(async () => {
    await command.terminate()
  })
}
