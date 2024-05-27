import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import chalk from 'chalk';
import path from 'path';

const app = express();
const port = 3000;

let users = [];

async function registerUser() {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    const userData = response.data.results[0];
    const user = {
      id: uuidv4(),
      name: userData.name.first,
      lastName: userData.name.last,
      gender: userData.gender,
      timestamp: moment().format('DD-MM-YYYY HH:mm:ss')
    };
    users.push(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

app.get('/add-user', async (req, res) => {
  await registerUser();
  res.send('User added');
});

app.get('/users', (req, res) => {
  const sortedUsers = _.partition(users, (user) => user.gender === 'male');
  console.log(chalk.bgWhite.blue(JSON.stringify(sortedUsers, null, 2)));
  res.json(sortedUsers);
});

app.get('/delete-users', (req, res) => {
  users = [];
  console.log(chalk.bgWhite.red('All users deleted'));
  res.send('All users deleted');
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
