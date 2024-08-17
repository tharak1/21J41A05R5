const express = require('express');
const app = express();
const port = 3000;

app.use("/",require("./routes/NumberRoutes"));

app.listen(port, () => {
    console.log(`Average Calculator Microservice listening at http://localhost:${port}`);
});
