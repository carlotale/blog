module.exports = {
    async up (queryInterface, Sequelize) {
      await queryInterface.createTable('Attachments', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        mime: {
          type: Sequelize.STRING,
          allowNull: true
        },
        url: {
          type: Sequelize.STRING,
          allowNull: true
        },
        image: {
          type: Sequelize.BLOB('long'),
          allowNull: true
        }
      });
    },
    async down (queryInterface, Sequelize) {
      await queryInterface.dropTable('Attachments');
    }
  };
  