const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = 'records.json';

app.use(cors());
app.use(bodyParser.json());

// 接收抽题记录
app.post('/api/record', (req, res) => {
  const { username, questionIndex, questionText, timestamp } = req.body;

  if (!username || typeof questionIndex !== 'number') {
    return res.status(400).json({ message: '缺少参数' });
  }

  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  const userRecords = data.filter(item => item.username === username);
  if (userRecords.length >= 5) {
    return res.status(403).json({ message: '你已达到最大抽题次数（5次）' });
  }

  data.push({ username, questionIndex, questionText, timestamp });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ message: '记录成功' });
});

// 获取所有记录
app.get('/api/records', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ 后端服务器已启动：http://localhost:${PORT}`);
});
