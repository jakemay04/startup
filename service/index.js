const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
app.use(express.json());

const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

app.use(cookieParser());

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

const path = require('path');
const users = [];





function setAuthCookie(res, user) {
  user.token = uuid.v4();

  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Registration endpoint
app.put('/api/auth', async (req, res) => {
  if (await getUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user);

    res.send({ email: user.email });
  }
});

// login
app.post('/api/auth', async (req, res) => {
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
 //store users in memory.

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
  };

  users.push(user);

  return user;
}

async function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}

const verifyAuth = async (req, res, next) => {
  const user = await getUser('token', req.cookies['token']);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Profile endpoint
apiRouter.get("/profile", verifyAuth, async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ 
      name: user.name || "User", 
      email: user.email, 
      bio: user.bio || "", 
      location: user.location || "" 
    });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Update profile endpoint
apiRouter.put("/profile", verifyAuth, async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    
    if (user) {
      // Update user profile fields
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      
      const userProfile = {
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
      };

      res.send(userProfile); // Send the safe object
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});