const express = require('express')
const userRoutes = require('./routes/server.routes')
const cors = require('cors')
const port = 3001

const app = express()
app.use(cors())
app.use(express.json())

app.get('/',async (req,res)=>{res.status(200).send('SERVER IS RUNNING....')})
app.use('/cd', userRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})