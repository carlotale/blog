const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Attachments extends Model {}
    Attachments.init({
        mime: {
            type: DataTypes.STRING
            },
            url: {
            type: DataTypes.STRING
            },
            image: {
            type: DataTypes.BLOB('long')
            }
    }, {
        sequelize
    });

    return Attachments;
};
