const bcrypt = require('bcryptjs');
const args = process.argv.slice(2);

const User = require('./models/user');
const Message = require('./models/message');

const mongoose = require('mongoose');
const mongoDB = args[0];

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDb connection error'));

const users = [];
const messages = [];

async function createUser(
  firstName,
  lastName,
  username,
  password,
  membership,
  isAdmin
) {
  try {
    const encryptedP = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      username,
      password: encryptedP,
      membership,
      isAdmin
    });
    await user.save();

    console.log('New User', user);
    users.push(user);
  } catch (err) {
    throw err;
  }
}

async function createMessage(title, text, timestamp, user) {
  const message = new Message({ title, text, timestamp, user });

  try {
    await message.save();

    console.log('New Message:', message);
    messages.push(message);
  } catch (err) {
    throw err;
  }
}

async function createUsers() {
  try {
    await Promise.all([
      createUser('Obi-Wan', 'Kenobi', 'kenoby', 'general123', 'member', false),
      createUser(
        'General',
        'Grievous',
        'griefor',
        'patetic321',
        'member',
        false
      ),
      createUser(
        'Anakin',
        'Skywalker',
        'notamember',
        'notfair',
        'default',
        false
      ),
      createUser('Baby', 'Yoda', 'babyoda', 'cutestchild', 'member', true)
    ]);
  } catch (err) {
    throw err;
  }
}

async function createMessages() {
  try {
    await Promise.all([
      createMessage("i've just jumped", 'Hello There', new Date(), users[0]),
      createMessage(
        'Impressed by a foolish',
        'General Kenobi',
        new Date(),
        users[1]
      ),
      createMessage(
        'what the hell is going on',
        "I'm gonna have some high ground",
        new Date(),
        users[2]
      ),
      createMessage('Looking Indifferent', 'yeay yeay', new Date(), users[3])
    ]);
  } catch (err) {
    throw err;
  }
}

async function populateDB() {
  try {
    await createUsers();
    await createMessages();

    mongoose.connection.close();

    console.log('Data was SAVED');
    console.log('USERS:');
    users.forEach((u) => console.log(u));

    console.log('MESSAGES:');
    messages.forEach((m) => console.log(m));

    console.log('DB IS POPULATED, Press any key to continue');
  } catch (err) {
    console.log(err);
  }
}

populateDB();
