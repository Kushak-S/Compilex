const express =require('express')
const router = express.Router()
const userController = require('../controllers/server.controller')

router.post('/run',userController.run)

module.exports = router