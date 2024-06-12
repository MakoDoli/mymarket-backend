import app from './app.js';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught exception occured');

  process.exit(2);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection occured! Shutting down');

  process.exit(1);
});
