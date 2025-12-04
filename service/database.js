const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

//test server connection
const url = `mongodb+srv://jakemay:jake2004@databasecs260.gxbpkj8.mongodb.net`;
const client = new MongoClient(url);
const db = client.db('startup');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

const userCollection = db.collection('user');
const postCollection = db.collection('post');

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne(
    { email: user.email },
    { $set: { name: user.name, bio: user.bio, location: user.location, token: user.token } }    );
    // return result.modefiedCount>0;
}

async function addPost(post) {
  const result = await postCollection.insertOne(post);
  return result.insertedId;
}

function getPosts(limit = 50, sortField = 'timestamp', sortOrder = -1) {
    const options = {
        sort: { [sortField]: sortOrder }, 
        limit: limit, 
    };
    const cursor = postCollection.find({}, options); 
    return cursor.toArray(); 
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addPost,
  getPosts,
};
