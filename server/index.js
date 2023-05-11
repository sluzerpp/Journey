require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const userController = require('./controllers/userController');
const questRouteQuestController = require('./controllers/questRoute-questController');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: ['https://beamish-capybara-72eefe.netlify.app', 'http://localhost:3000', '*'],
  credentials: true,
}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    if ((await models.User.findAndCountAll()).count === 0) {
      const hashPassword = await bcrypt.hash('123qwe', 5);
      await models.User.create({email: 'admin@mail.ru', nickname: 'admin', role: 'ADMIN', avatar: 'default.jpg', password: hashPassword});
    }
    await userController.checkQuests();
    await questRouteQuestController.check();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}


start();
