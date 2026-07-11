require("dotenv").config();

const express = require("express");

const expertiseRoutes = require("./routes/expertiseRoutes");
const contactRoutes = require("./routes/contactRoutes");
const projectRoutes = require("./routes/projectsRoutes");
const homeRoutes = require("./routes/homeRoutes");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "assets"))); 

app.use(
    "/components",
    express.static(path.join(__dirname, "views", "components"))
);

app.use("/", homeRoutes);
app.use("/projects", projectRoutes);
app.use("/contact", contactRoutes);
app.use("/expertise", expertiseRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server is running at: http://localhost:${PORT}`);
  }
});