import express from "express";
import { routes } from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handling.js";

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(routes);

app.use(errorHandler);

app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
);
