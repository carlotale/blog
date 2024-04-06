const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Posts extends Model {}
    Posts.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Title must not be empty"
                }
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Body must not be empty"
                }
            }
        }
    }, {
        sequelize,
    });

    return Posts;
};
