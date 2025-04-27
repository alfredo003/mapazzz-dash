"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StatisticController_1 = require("../controllers/StatisticController");
const statisticRouter = (0, express_1.Router)();
statisticRouter.get('/', StatisticController_1.StatisticController.getCounts);
statisticRouter.get('/chart', StatisticController_1.StatisticController.getChart);
exports.default = statisticRouter;
