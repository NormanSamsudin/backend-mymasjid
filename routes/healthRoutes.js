const express = require('express');
const healthController = require('./../controllers/healthController');
const healthRoutes = express.Router();

healthRoutes.get('/db' ,healthController.dbCheck);
healthRoutes.get('/transporter' ,healthController.trasporterCheck);

module.exports = healthRoutes;