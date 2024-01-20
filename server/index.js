require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000 || process.env.PORT;
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/cors.Option");

app.use(cookieParser());

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/v1", userRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hwy we got server" });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
