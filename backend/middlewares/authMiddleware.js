//backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
app.use(express.json()); 


const verifyToken = (req, res, next) => {
 const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Không có token' });

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
 req.user = decoded;
next();
} catch (err) {
res.status(403).json({ message: 'Token không hợp lệ' });
}
};

const verifyAdmin = (req, res, next) => {
  // Gọi verifyToken trực tiếp
verifyToken(req, res, () => {
 if (req.user && req.user.role === 'Admin') { // <-- Thêm kiểm tra req.user
 next();
} else {
 res.status(403).json({ message: 'Không có quyền Admin' });
 }
 });
};

module.exports = { verifyToken, verifyAdmin };