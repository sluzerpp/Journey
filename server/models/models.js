const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  nickname: {type: DataTypes.STRING},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  role: {type: DataTypes.STRING, defaultValue: 'USER'},
  currentExperience: {type: DataTypes.INTEGER, defaultValue: 0},
  experienceNextLevel: {type: DataTypes.INTEGER, defaultValue: 2},
  level: {type: DataTypes.INTEGER, defaultValue: 0},
  coins: {type: DataTypes.INTEGER, defaultValue: 0},
  avatar: {type: DataTypes.STRING},
});

const Quest = sequelize.define('quest', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  experience: {type: DataTypes.INTEGER},
  thumbnail: {type: DataTypes.STRING},
  description: {type: DataTypes.TEXT},
  isRouteQuest: {type: DataTypes.BOOLEAN},
  latitude: {type: DataTypes.DOUBLE},
  longitude: {type: DataTypes.DOUBLE},
  type: {type: DataTypes.STRING},
});

const QuestRoute = sequelize.define('questRoute', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.TEXT},
  experience: {type: DataTypes.INTEGER},
  latitude: {type: DataTypes.DOUBLE},
  longitude: {type: DataTypes.DOUBLE},
}); 

const User_Quest = sequelize.define('user-quest', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  state: {type: DataTypes.STRING, defaultValue: "AVAILABLE"},
});

const User_QuestRoute = sequelize.define('user-questRoute', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  state: {type: DataTypes.STRING, defaultValue: "AVAILABLE"},
  completed: {type: DataTypes.INTEGER, defaultValue: 0}
})

const QuestRouteQuest = sequelize.define('questRoute-quest', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  order: {type: DataTypes.INTEGER},
});

const ShopItem = sequelize.define('shopItem', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  type: {type: DataTypes.STRING},
  value: {type: DataTypes.STRING},
});

const User_ShopItem = sequelize.define('user-shopItem', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  state: {type: DataTypes.STRING, defaultValue: "AVAILABLE"},
});

const Facts = sequelize.define('facts', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  fact: {type: DataTypes.TEXT},
});

const Image = sequelize.define('image', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  image: {type: DataTypes.STRING},
});

const Puzzle = sequelize.define('puzzle', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  image: {type: DataTypes.STRING},
  difficult: {type: DataTypes.STRING, defaultValue: 'EASY'},
});

const Test = sequelize.define('test', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
});

const TestQuestion = sequelize.define('testQuestion', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  question: {type: DataTypes.STRING},
  answer: {type: DataTypes.STRING},
});

User.belongsToMany(Quest, {through: User_Quest});
Quest.belongsToMany(User, {through: User_Quest});

User.belongsToMany(QuestRoute, {through: User_QuestRoute});
QuestRoute.belongsToMany(User, {through: User_QuestRoute});

QuestRoute.belongsToMany(Quest, {through: QuestRouteQuest});
Quest.belongsToMany(QuestRoute, {through: QuestRouteQuest});

User.belongsToMany(ShopItem, {through: User_ShopItem});
ShopItem.belongsToMany(User, {through: User_ShopItem});

Quest.hasMany(Facts, { onDelete: 'CASCADE' });
Facts.belongsTo(Quest);

Quest.hasMany(Image, { onDelete: 'CASCADE' });
Image.belongsTo(Quest);

Quest.hasMany(Puzzle, { onDelete: 'CASCADE' });
Puzzle.belongsTo(Quest);

Quest.hasMany(Test, { onDelete: 'CASCADE' });
Test.belongsTo(Quest);

Test.hasMany(TestQuestion, { onDelete: 'CASCADE' });
TestQuestion.belongsTo(Test);

module.exports = {
  User,
  User_Quest,
  User_QuestRoute,
  User_ShopItem,
  Quest,
  QuestRoute,
  QuestRouteQuest,
  ShopItem,
  Facts,
  Image,
  Puzzle,
  Test,
  TestQuestion,
}