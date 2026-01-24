// migrations/xxxx-create-orders.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: { type: Sequelize.CHAR(36), allowNull: false, primaryKey: true },

      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      user_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      organization_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: "organizations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      order_date: {
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
      CREATE TRIGGER orders_before_insert
      BEFORE INSERT ON orders
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
      `DROP TRIGGER IF EXISTS orders_before_insert;`,
    );
    await queryInterface.dropTable("orders");
  },
};
