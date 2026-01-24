"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE orders
      ADD CONSTRAINT chk_orders_total_amount_positive
      CHECK (total_amount > 0)
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE orders
      DROP CONSTRAINT chk_orders_total_amount_positive
    `);
  },
};
