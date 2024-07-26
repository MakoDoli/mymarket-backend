import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorHandler from './error/ErrorHandler';
import path from 'path';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Setup express server
const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/', limiter);
app.get(['/', '/status'], (_, res) => {
  res.status(200).send('Ready to serve');
});

const PORT = process.env.PORT || 3000;

const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io setup

const io = new Server(expressServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on('message', (message, name) => {
    io.emit('message', `${name} said:  ${message} `);
  });
});

//  static file use
app.use(express.static(path.join(__dirname, '..', 'app')));

// Middleware

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
  }),
);

// Routes
app.use('/api/users', userRoutes);

//no matching url - not found - should be last after all routes
app.all('*', ErrorHandler.notFound);

app.use(ErrorHandler.handleErrors);

process.on('uncaughtException', ErrorHandler.unCaughtException);
process.on('unhandledRejection', ErrorHandler.unHandledRejection);

export default app;
