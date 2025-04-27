"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AwardController_1 = __importDefault(require("../controllers/AwardController"));
const awardRouter = (0, express_1.Router)();
awardRouter.get('/', AwardController_1.default.getAll);
awardRouter.get('/:uid', AwardController_1.default.getById);
awardRouter.get('/search/:claimcode', AwardController_1.default.getByclaimCode);
awardRouter.post('/', AwardController_1.default.create);
awardRouter.put('/:uid', AwardController_1.default.update);
awardRouter.put('/:claim', AwardController_1.default.claim);
awardRouter.delete('/:uid', AwardController_1.default.delete);
exports.default = awardRouter;
