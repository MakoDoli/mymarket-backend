"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// process.on('uncaughtException', (err) => {
//   console.log(err.name, err.message);
//   console.log('Uncaught exception occured');
//   server.close(() => {
//     process.exit(2);
//   });
// });
// process.on('unhandledRejection', (err: Error) => {
//   console.log(err.name, err.message);
//   console.log('Unhandled rejection occured! Shutting down');
//   server.close(() => {
//     process.exit(1);
//   });
// });
