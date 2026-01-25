require("dotenv").config({ quiet: true });

module.exports = {
  development: {
    username: process.env.DB_USER || "app",
    password: process.env.DB_PASSWORD || "app",
    database: process.env.DB_NAME || "one_rail",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "app",
    password: process.env.DB_PASSWORD || "app",
    database: process.env.DB_NAME || "one_rail_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER || "app",
    password: process.env.DB_PASSWORD || "app",
    database: process.env.DB_NAME || "one_rail",
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
};
