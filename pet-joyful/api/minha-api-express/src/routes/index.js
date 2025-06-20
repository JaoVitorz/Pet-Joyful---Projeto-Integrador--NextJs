import express from 'express';
import { IndexController } from '../controllers/index';

const router = express.Router();
const indexController = new IndexController();

function setRoutes(app) {
    router.get('/', indexController.getIndex.bind(indexController));
    app.use('/', router);
}

export default setRoutes;