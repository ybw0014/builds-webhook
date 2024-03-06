import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import type { BuildInfo } from '~/types'
import type { TypedRequestBody } from '~/types/express'
import { NotificationService } from '~/services/NotificationService'

const app = express()
const port = process.env.PORT ?? 3000
const authToken = process.env.AUTH_TOKEN

if (authToken === undefined || authToken === '') {
  console.error('AUTH_TOKEN is not set')
  process.exit(1)
}

const notificationService = new NotificationService()

app.use(bodyParser.json())

app.post('/guizhan-builds', async (req: TypedRequestBody<BuildInfo>, res) => {
  if (req.header('Authorization') !== authToken) {
    res.status(401).send('Unauthorized')
    return
  }
  const buildInfo = req.body
  console.log('收到推送', buildInfo)
  notificationService.notify(buildInfo)
  res.status(200).send('OK')
})

app.listen(port, () => {
  console.log('正在监听端口：' + port)
})
