const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
//Các thư viện hỗ trợ của mongo và backend cho nó dễ làm hơn
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
//Hiện tại chỉ có làm việc trên route question
app.use("/api/questions", require("./routes/questionRoutes"));

//Lắng nghe port backend, mặc định là 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

