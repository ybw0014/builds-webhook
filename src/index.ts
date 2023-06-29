import { TypedRequestBody, BuildInfo } from './types'
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { sendBuildInfo as sendDiscordBuildInfo } from './discordBot'
import { sendBuildInfo as sendKookBuildInfo } from './kookBot'

const app = express()
const port = process.env.PORT || 3000
const authToken = process.env.AUTH_TOKEN

if (authToken === undefined || authToken === '') {
  console.error('AUTH_TOKEN is not set')
  process.exit(1)
}

app.use(bodyParser.json())

app.post('/guizhan-builds', async (req: TypedRequestBody<BuildInfo>, res) => {
  if (req.header('Authorization') !== authToken) {
    res.status(401).send('Unauthorized')
    return
  }
  console.log('收到推送', req.body)
  console.log('发送Discord信息')
  await sendDiscordBuildInfo(req.body)
  console.log('发送Kook信息')
  await sendKookBuildInfo(req.body)
  console.log('发送完成')
  res.status(200).send('OK')
})

app.post('/kook')

app.listen(port, () => {
  console.log('listening on port: ' + port)
})
