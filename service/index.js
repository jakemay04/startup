const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
app.use(express.json());

const apiRouter = express.Router();
app.use(`/api`, apiRouter);


const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

app.use(cookieParser());

function setAuthCookie(res, user) {
  user.token = uuid.v4();

  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Registration endpoint
app.post('/api/auth', async (req, res) => {
  if (await getUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user);

    res.send({ email: user.email });
  }
});

// login
app.put('/api/auth', async (req, res) => {
  const user = await getUser('email', req.body.email);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);

    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// logout
app.delete('/api/auth', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    clearAuthCookie(res, user);
  }

  res.send({});
});

function clearAuthCookie(res, user) {
  delete user.token;
  res.clearCookie('token');
}

// getMe
app.get('/api/user/me', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.listen(4000);

const users = [];

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
  };

  users.push(user);

  return user;
}

function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}