//backend/sever.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
//Các thư viện hỗ trợ của mongo và backend cho nó dễ làm hơn
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
//Hiện tại chỉ có làm việc trên route question


app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/questionImages", require('./routes/questionImageRoutes.js'));
app.use("/api/quizzes", require("./routes/quizRoutes.js"));
app.use("/api/submissions", require("./routes/submissionRoutes.js"));   
app.use("/api/subjects", require("./routes/subjectRoutes.js"));
app.use("/api/chapters", require("./routes/chapterRoutes.js"));

app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/auth", require("./routes/authRoutes.js")); 
app.use("/api/contributed", require("./routes/contributeRoutes.js"));


//Lắng nghe port backend, mặc định là 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
