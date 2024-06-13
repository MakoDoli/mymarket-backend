"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const ErrorHandler_1 = __importDefault(require("./error/ErrorHandler"));
const app = (0, express_1.default)();
app.get('/', (_, res) => {
    res.status(200).send('Ready to serve');
});
// Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
}));
// Routes
app.use('/api/users', userRoutes_1.default);
//no matching url - not found - should be last after all routes
app.all('*', ErrorHandler_1.default.notFound);
app.use(ErrorHandler_1.default.handleErrors);
process.on('uncaughtException', ErrorHandler_1.default.unCaughtException);
process.on('unhandledRejection', ErrorHandler_1.default.unHandledRejection);
exports.default = app;
