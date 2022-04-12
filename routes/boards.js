const express = require('express');
const moment = require('moment');
const { default: mongoose } = require('mongoose');
const board = require('../schemas/board');
const Board = require('../schemas/board');
const Comment = require('../schemas/comment');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('this is root page');
});

// 게시글 리스트 조회
router.get('/boards', async (req, res) => {
  const boards = await Board.find({ isDeleted: false });

  boards.sort((a, b) => {
    a = a.regDate;
    b = b.regDate;
    return b - a;
  });

  // res.render('board', { boards, moment });
  res.json(boards);
});

// 게시글 상세 조회 및 코멘드 리스트 조회
router.get('/boards/:boardNo', async (req, res) => {
  const { boardNo } = req.params;

  const [board] = await Board.find({ boardNo: Number(boardNo) });
  const comments = await Comment.find({
    boardNo: Number(boardNo),
    isDeleted: false,
  });

  comments.sort((a, b) => {
    a = a.regDate;
    b = b.regDate;
    return b - a;
  });

  res.send({ board, comments });
});

// 게시글 등록
router.post('/boards', async (req, res) => {
  const { userName, title, content } = req.body;

  const createBoards = await Board.create({
    userName,
    title,
    content,
  });

  res.send(createBoards);
});

// 게시글 수정
router.put('/boards/:boardNo', async (req, res) => {
  const { boardNo } = req.params;
  const { userName, title, content, regDate, isDeleted } = req.body;

  await Board.updateOne(
    {
      boardNo: Number(boardNo),
    },
    {
      $set: {
        userName,
        title,
        content,
        regDate,
        updDate: Date.now(),
        isDeleted,
      },
    }
  );

  res.json({ success: true });
});

// 게시글 삭제
router.delete('/boards/:boardNo', async (req, res) => {
  const { boardNo } = req.params;

  const existsBoard = await Board.find({ boardNo: Number(boardNo) });

  if (!existsBoard.isDeleted) {
    await Board.updateOne(
      { boardNo: Number(boardNo) },
      {
        $set: {
          updDate: Date.now(),
          isDeleted: true,
        },
      }
    );
    await Comment.updateMany(
      { boardNo: Number(boardNo) },
      {
        $set: {
          updDate: Date.now(),
          isDeleted: true,
        },
      }
    );
  }

  res.json({ result: 'success' });
});

// 코멘트 조회
router.get('/boards/:boardNo/comments/:commentNo', async (req, res) => {
  const { boardNo, commentNo } = req.params;

  const comment = await Comment.findOne({
    boardNo: Number(boardNo),
    boardcommentNoNo: Number(commentNo),
  });

  console.log(comment);
  res.json(comment);
});

// 코멘트 등록
router.post('/boards/:boardNo/comments', async (req, res) => {
  const { boardNo } = req.params;
  const { userName, content } = req.body;

  if (content.length < 1) {
    return res.status(400).json({
      success: false,
      errorMessage: '내용을 입력하여 주세요.',
    });
  }

  const createComments = await Comment.create({
    boardNo: Number(boardNo),
    userName,
    content,
  });

  res.json({ createComments });
});

// 코멘트 수정
router.put('/boards/:boardNo/comments/:commentNo', async (req, res) => {
  const { boardNo, commentNo } = req.params;

  const { userName, content, regDate, isDeleted } = req.body;

  if (content.length < 1) {
    return res.status(400).json({
      success: false,
      errorMessage: '내용을 입력하여 주세요.',
    });
  }
  
  await Comment.updateOne(
    {
      boardNo: Number(boardNo),
      commentNo: Number(commentNo),
    },
    {
      $set: {
        userName,
        content,
        regDate,
        updDate: Date.now(),
        isDeleted,
      },
    }
  );

  res.json({ success: true });
});

// 코멘트 삭제
router.delete('/boards/:boardNo/comments/:commentNo', async (req, res) => {
  const { commentNo } = req.params;

  const existsComment = await Comment.find({ commentNo: Number(commentNo) });

  if (!existsComment.isDeleted) {
    await Comment.updateOne(
      { commentNo: Number(commentNo) },
      {
        $set: {
          updDate: Date.now(),
          isDeleted: true,
        },
      }
    );
  }

  res.json({ result: 'success' });
});

module.exports = router;
