require("dotenv").config();

const express = require("express");

const projectRoutes = require("./routes/projectsRoutes");
const homeRoutes = require("./routes/homeRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "assets"))); 

app.use("/", homeRoutes);
app.use("/projects", projectRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});