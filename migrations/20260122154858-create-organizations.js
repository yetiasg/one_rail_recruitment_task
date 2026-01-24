"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("organizations", {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      industry: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      date_founded: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });

    await queryInterface.sequelize.query(`
      CREATE TRIGGER organizations_before_insert
      BEFORE INSERT ON organizations
      FOR EACH ROW
      BEGIN
        IF NEW.id IS NULL OR NEW.id = '' THEN
          SET NEW.id = UUID();
        END IF;
      END;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DROP TRIGGER IF EXISTS organizations_before_insert;`,
    );
    await queryInterface.dropTable("organizations");
  },
};
