const express = require('express');
const cors = require('cors')
const routes = require('./routes')
require('dotenv').config()



const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3001, () => {
  console.log('A API REST está escutando na porta 3001. 🚀');
});