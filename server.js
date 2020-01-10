const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('./models');
const app = express();

// 秘钥, 这里简写
const SERECT = '07188lGt1OV2mEg0C31mCt1APOIqGt188lGc1';

app.use(express.json());

app.get('/api/users', async (req, res) => {
  const users = await User.find({}, { __v: 0 });
  res.send(users);
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.create(
    {
      username,
      password
    },
    { __v: 0 }
  );
  res.send(user);
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne(
    {
      username
    },
    { __v: 0 }
  );

  if (!user) {
    return res.status(422).send({ msg: '用户名不存在' });
  }

  const isPasswordValid = bcryptjs.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(422).send({ msg: '密码错误' });
  }

  const token = createJWT(user);
  res.send({
    user,
    token
  });
});

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = String(req.headers.authorization)
      .split(' ')
      .pop();
    // console.log(authorization);
    const { _id } = jwt.verify(authorization, SERECT);
    const user = await User.findById(_id);
    req.user = user;

    // TODO: 查询不到的情况, 直接中断
    next();
  } catch (error) {
    // TODO: 报错
  }
};

app.get('/api/profile', authMiddleware, async (req, res) => {
  res.send(req.user);
});

app.listen(3001, () => {
  console.log('http:localhost: 3001');
});

function createJWT(user) {
  const { _id } = user;
  const token = jwt.sign(
    {
      _id: String(_id)
    },
    SERECT
  );
  return token;
}
