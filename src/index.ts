import express from 'express'

const app = express()
const port = process.env.PORT || 3000
const authToken = process.env.AUTH_TOKEN

app.post('/guizhan-builds', (req, res) => {
  if (req.headers['Authorization'] !== authToken) {
    res.status(401).send('Unauthorized')
    return
  }

})

app.listen(port)
