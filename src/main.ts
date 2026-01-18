import express from "express";
import chalk from "chalk";

const app = express();

app.listen(3000, () =>
  console.log(chalk.blue("Server is litening on port 3000"))
);
