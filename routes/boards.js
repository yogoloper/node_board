const express = require('express');
const Board = require('../schemas/board');
const Comment = require('../schemas/comment');
const router = express.Router();

// 게시글 리스트 조회
router.get('/boards', async (req, res) => {
  const boards = await Board.find({ isDeleted: false });
  boards.sort((a, b) => {
    a = a.regDate;
    b = b.regDate;
    return b - a;
  });
  res.json(boards);
});

// 게시글 상세 조회 및 코멘드 리스트 조회
router.get('/boards/:boardNo', async (req, res) => {
  const { boardNo } = req.params;

  // 하나만 존재할테니 배열 인덱스 형태로 담는다.
  const [board] = await Board.find({ boardNo: Number(boardNo) });
  // 여러개가 존재할테니 배열 형태로 담는다.
  const comments = await Comment.find({
    boardNo: Number(boardNo),
    isDeleted: false,
  });

  // 등록일 내림차순 정렬
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

  res.status(201).send(createBoards);
});

// 게시글 수정
router.put('/boards/:boardNo', async (req, res) => {
  const { boardNo } = req.params;
  const { userName, title, content, regDate, isDeleted } = req.body;

  // put 메소드의 원칙에 따라 모든 항목을 업데이트
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

  res.status(201).send({ success: true });
});

// 게시글 삭제
router.delete('/boards/:boardNo', async (req, res) => {
  const { boardNo } = req.params;

  // 게시글을 조회해서
  const existsBoard = await Board.find({ boardNo: Number(boardNo) });

  // 게시글이 존재하면(지워진게 아니라면)
  if (!existsBoard.isDeleted) {
    // 게시글의 isDeleted를 true로 변환
    await Board.updateOne(
      { boardNo: Number(boardNo) },
      {
        $set: {
          updDate: Date.now(),
          isDeleted: true,
        },
      }
    );
    // 해당 게시글 댓글들의 isDeleted도 모두 true로 변환
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

  res.send({ success: true });
});

// 코멘트 조회
router.get('/boards/:boardNo/comments/:commentNo', async (req, res) => {
  const { boardNo, commentNo } = req.params;

  const comment = await Comment.findOne({
    boardNo: Number(boardNo),
    commentNo: Number(commentNo),
    isDeleted: false,
  });

  res.send(comment);
});

// 코멘트 등록
router.post('/boards/:boardNo/comments', async (req, res) => {
  const { boardNo } = req.params;
  const { userName, content } = req.body;

  // 입력 내용이 없다면 에러 메시지 반환
  if (content.length < 1) {
    return res.status(400).send({
      success: false,
      errorMessage: '내용을 입력하여 주세요.',
    });
  }

  const createComments = await Comment.create({
    boardNo: Number(boardNo),
    userName,
    content,
  });

  res.status(201).send({ createComments });
});

// 코멘트 수정
router.put('/boards/:boardNo/comments/:commentNo', async (req, res) => {
  const { boardNo, commentNo } = req.params;
  const { userName, content, regDate, isDeleted } = req.body;

  // 입력 내용이 없다면 에러 메시지 반환
  if (content.length < 1) {
    return res.status(400).send({
      success: false,
      errorMessage: '내용을 입력하여 주세요.',
    });
  }

  // put 메소드의 원칙에 따라 모든 항목을 업데이트
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

  res.status(201).send({ success: true });
});

// 코멘트 삭제
router.delete('/boards/:boardNo/comments/:commentNo', async (req, res) => {
  const { commentNo } = req.params;

  const existsComment = await Comment.find({ commentNo: Number(commentNo) });

  // 댓글이 존재하면(지워진게 아니라면)
  if (!existsComment.isDeleted) {
    // 댓글의 isDeleted를 true로 변환
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
  res.send({ success: true });
});

module.exports = router;
