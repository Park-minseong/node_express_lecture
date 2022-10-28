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

app.get('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no such member' });
  }
});

app.post('/api/members', async (req, res) => {
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  //const member = await Member.create(newMember);
  //build, save 동시에 실행하는 메소드 = create()
  res.send(member);
});
////////////////////////////////////update
// app.put('/api/members/:id', async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
//   const result = await Member.update(newInfo, { where: { id } }); // [수정된 행의 개수 반환, ...]배열 반환 /변경할 데이터만 req에 담아도 됨
//   if (result[0]) {
//     res.send({ message: `${result} row(s) affected` });
//   } else {
//     res.status(404).send({ message: 'There is no member with the id!' });
//   }
// });

//update메소드 외의 수정방법(save)
app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });

    await member.save();
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

// app.delete('/api/members/:id', async (req, res) => {
//   const { id } = req.params;
//   const deletedCount = await Member.destroy({ where: { id } }); // 삭제된 행의 개수 반환
//   if (deletedCount) {
//     res.send({ message: `${deletedCount} row(s) deleted` });
//   } else {
//     res.status(404).send({ message: 'There is no member with the id!' });
//   }
// });

/////////////////////////////////반환된 Member 객체의 destroy 메소드를 이용한 삭제
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    const result = await member.destroy();
    res.send({ message: '1 row(s) deleted' });
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening...');
});
