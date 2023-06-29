import { TypedRequestBody, BuildInfo } from './types'
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { sendBuildInfo as sendDiscordBuildInfo } from './discordBot'

const app = express()
const port = process.env.PORT || 3000
const authToken = process.env.AUTH_TOKEN

if (authToken === undefined || authToken === '') {
  console.error('AUTH_TOKEN is not set')
  process.exit(1)
}

app.use(bodyParser.json())

app.post('/guizhan-builds', (req: TypedRequestBody<BuildInfo>, res) => {
  if (req.header('Authorization') !== authToken) {
    res.status(401).send('Unauthorized')
    return
  }
  sendDiscordBuildInfo(req.body)
  res.status(200).send('OK')
})

app.listen(port, () => {
  console.log('listening on port: ' + port)
})
