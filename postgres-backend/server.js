const express = require("express");
const cors = require("cors")
const app = express();
const routes = require("./src/routes/indexRoute"); // Check if this path is correct
const { PORT } = require("./config/index");

app.use(express.json());
app.use(cors())
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
