require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/potion.routes");

const swaggerui = require("swagger-ui-express");
const swaggerjson = require("swagger-jsdoc");
const swaggerDocument = swaggerjson({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API de Potion",
      version: "1.0.0",
      description: "API pour gérer les potions magiques",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./router.js", "./routes/auth.routes.js"],
});

const app = express();
app.use(express.json());
app.use(cors());

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(require("sanitize").middleware);
app.use("/auth", require("./routes/auth.routes"));

app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

app.use("/potions", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
