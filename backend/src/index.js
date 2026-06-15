require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const videosRouter = require('./routes/videos');
app.use('/api/videos', videosRouter);

app.get('/', (req, res) => res.send('SPARZAS API rodando!'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend na porta ${PORT}`));
