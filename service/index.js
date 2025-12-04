const express = require('express');
const app = express();
const DB = require('./database.js');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const http = require('http'); // Import built-in http module
const { initializeWebSocketService } = require('./websocketService'); // Import the service

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
app.use(express.json());
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
    await DB.updateUser(user);

    res.send({ email: user.email });
  }
});

// login
app.post('/api/auth', async (req, res) => {
  const user = await getUser('email', req.body.email);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);
    await DB.updateUser(user);
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
    await DB.updateUser(user);
  }

  res.send({});
});

//del helper function
function clearAuthCookie(res, user) {
  delete user.token;
  res.clearCookie('token');
  res.status(204).end();
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

// REMOVED: app.listen(4000); 
// We must use the 'server.listen' command below, not 'app.listen' here.
// console.log(`Server listening on port ${port}`); // Also removed this duplicate log

//create new user
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
  };

  await DB.addUser(user);

  return user;
}

//validate user by field
async function getUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}

//check authentication middleware
const verifyAuth = async (req, res, next) => {
  const token = req.cookies['token'];
  console.log('Token received:', token); // Log the token
  if (!token) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }
  const user = await getUser('token', req.cookies['token']);
  console.log('User found in DB:', !!user);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Profile endpoint
apiRouter.get("/profile", verifyAuth, async (req, res) => {
  console.log('Received Cookies:', req.cookies);
  console.log('Received Token:', req.cookies['token']);
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    const user = await getUser('token', token);
    res.send(user);
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Update profile endpoint
apiRouter.put("/profile", verifyAuth, async (req, res) => {
  try {
    console.log('Received Cookies:', req.cookies);
    console.log('Received Token:', req.cookies['token']);
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    
    if (user) {
      // Update user profile fields
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;

      await DB.updateUser(user);
      
      const userProfile = {
        name: user.name || 'User',
        email: user.email || 'Example@byu.edu',
        bio: user.bio || 'Put your Bio here',
        location: user.location || 'City, ST',
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

apiRouter.get('/posts', verifyAuth, async (req, res) => {
  try {
    console.log('Received Cookies:', req.cookies);
    console.log('Received Token:', req.cookies['token']);
    const posts = await DB.getPosts(); // get posts from the database
    res.send(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

apiRouter.post('/posts', verifyAuth, async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await getUser('token', token);

    if (!user) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }

    // make new post object
    const newPost = {
      content: req.body.content,
      email: user.email,
      // Use user's name if available, otherwise default to the email prefix
      username: user.name || user.email.split('@')[0], 
      timestamp: new Date().toISOString(),
    };

    //Save the post to database
    const insertedId = await DB.addPost(newPost); // DB.addPost is available
    
    //Send the full post
    res.status(201).send({ ...newPost, _id: insertedId }); 

  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send({ msg: 'Internal server error' });
  }
});

// STARTING THE INTEGRATED SERVER (HTTP + WS)
const server = http.createServer(app);
initializeWebSocketService(server); // Initialize WebSocket on the proper server instance
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`WebSocket path: ws://localhost:${port}/ws`);
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});