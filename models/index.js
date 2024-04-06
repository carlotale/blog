const Sequelize = require('sequelize');

const url = process.env.DATABASE_URL || "sqlite:blog.sqlite";
const sequelize = new Sequelize(url);

const Posts = require('./post')(sequelize);
const Attachments = require('./attachment')(sequelize);

Posts.belongsTo(Attachments, {foreignKey: 'attachmentId', as:'attachment'});
Attachments.hasOne(Posts, {foreignKey: 'attachmentId', as:'post'});

module.exports = sequelize;


