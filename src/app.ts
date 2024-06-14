import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorHandler from './error/ErrorHandler';

const app = express();

app.get('/', (_, res) => {
  res.status(200).send('Ready to serve');
});

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
