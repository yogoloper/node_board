const express = require('express')
const connect = require('./schemas/index')
const app = express()
const port = 3000;

connect();

const boardsRouter = require('./routes/boards');

const requestMiddleware = (req, res, next) => {
  console.log('request URL:', req.originalUrl, ' - ', new Date());
  next();
};

app.use(express.static('static'));
app.use(express.json());
app.use(requestMiddleware);

app.use('/api', [boardsRouter]);

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸습니다.');
});
