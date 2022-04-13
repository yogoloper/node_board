const express = require('express')
const connect = require('./schemas/db_conn')
const app = express()
const port = 3000;

connect();

// boards 라우터 생성
const boardsRouter = require('./routes/boards');

// 접속 경로 로그 출력하는 미들웨어
const requestMiddleware = (req, res, next) => {
  console.log('request URL:', req.originalUrl, ' - ', new Date());
  next();
};

app.use(express.static('static'));
app.use(express.json());
app.use(requestMiddleware);

// api 경로시 배열에 있는 라우터 순서대로 우선순위를 정한다.
app.use('/api', [boardsRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸습니다.');
});
