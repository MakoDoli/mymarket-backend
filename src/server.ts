import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
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
