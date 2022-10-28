const express = require('express');

const app = express();

const db = require('./models'); // 파일이름을 지정하지 않으면 지정된 폴더에서 자동으로 index.js를 찾음

const { Member } = db;

app.use(express.json()); //서버로오는 리퀘스트를 처리해주는 미들웨어

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({
      where: { team },
      order: [['admissionDate', 'DESC']],
    }); //{team: team } => {team}
    res.send(teamMembers);
  } else {
    const members = await Member.findAll({
      order: [['admissionDate', 'DESC']],
    });
    res.send(members);
  }
});

app.get('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no such member' });
  }
});

app.post('/api/members', (req, res) => {
  const newMember = req.body;
  members.push(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    Object.keys(newInfo).forEach((props) => {
      member[props] = newInfo[props];
    });
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const memberCount = members.length;
  members = members.filter((member) => member.id !== Number(id));
  if (members.length < memberCount) {
    res.send({ message: 'Deleted' });
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening...');
});
