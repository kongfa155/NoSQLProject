const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Tải các biến môi trường
dotenv.config();

// Import models
const Subject = require('./models/subject');
const Chapter = require('./models/chapter');
const Quiz = require('./models/quiz');
const QuestionText = require('./models/questionText');
const QuestionImage = require('./models/questionImage'); // <<< THÊM MỚI

// =================================================================
// NGÂN HÀNG CÂU HỎI TEXT
// =================================================================
const questionBank = {
  'Toán học Cao cấp': {
    'Chương 1: Giới hạn và Liên tục': [
      { question: 'Giới hạn của `lim(x->0) (sin(x)/x)` là bao nhiêu?', options: ['1', '0', '∞', '-1'], answer: '1', explain: 'Đây là một giới hạn cơ bản trong giải tích.' },
      { question: 'Hàm số `f(x) = (x^2 - 1) / (x - 1)` có liên tục tại `x = 1` không?', options: ['Không', 'Có', 'Không xác định', 'Liên tục bên trái'], answer: 'Không', explain: 'Hàm số không xác định tại x = 1.' },
    ],
    'Chương 2: Đạo hàm và Ứng dụng': [
      { question: 'Đạo hàm của hàm số `y = x^n` là gì?', options: ['n*x^(n-1)', 'x^n * ln(x)', 'n*x^(n+1)', '(x^n)/n'], answer: 'n*x^(n-1)', explain: 'Đây là công thức đạo hàm cơ bản.' },
      { question: 'Đạo hàm của `y = sin(x)` là gì?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], answer: 'cos(x)', explain: 'Đạo hàm của sin(x) là cos(x).' },
    ],
    'Chương 3: Tích phân': [
        { question: 'Nguyên hàm của `f(x) = 1/x` là gì?', options: ['ln|x| + C', '1/x^2 + C', '-1/x^2 + C', 'x + C'], answer: 'ln|x| + C', explain: 'Theo công thức nguyên hàm cơ bản.' },
    ]
  },
  'Lịch sử Việt Nam': {
    'Chương 1: Thời kỳ Dựng nước và Bắc thuộc': [
      { question: 'Vị vua nào đã lập nên nhà nước Văn Lang?', options: ['Hùng Vương', 'An Dương Vương', 'Lý Bí', 'Ngô Quyền'], answer: 'Hùng Vương', explain: 'Các vua Hùng đã sáng lập ra nhà nước Văn Lang.' },
    ],
    'Chương 2: Các triều đại Phong kiến tự chủ': [
      { question: 'Ai là người dẹp loạn 12 sứ quân, thống nhất đất nước?', options: ['Đinh Bộ Lĩnh', 'Lê Hoàn', 'Lý Công Uẩn', 'Trần Hưng Đạo'], answer: 'Đinh Bộ Lĩnh', explain: 'Đinh Bộ Lĩnh đã lập nên nhà Đinh.' },
    ],
    'Chương 3: Thời kỳ Cận - Hiện đại': [
        { question: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại đâu?', options: ['Quảng trường Ba Đình, Hà Nội', 'Bến Nhà Rồng, Sài Gòn', 'Cây đa Tân Trào', 'Hoàng thành Huế'], answer: 'Quảng trường Ba Đình, Hà Nội', explain: 'Ngày 2/9/1945.' }
    ]
  },
};


// =================================================================
// NGÂN HÀNG CÂU HỎI HÌNH ẢNH (MỚI)
// =================================================================
const imageQuestionBank = {
    'Toán học Cao cấp': {
        'Chương 2: Đạo hàm và Ứng dụng': [
            {
                question: 'Dựa vào đồ thị, hãy cho biết đây là hàm số nào?',
                image: 'https://i.imgur.com/3sFTEc1.png', // Link ảnh đồ thị Parabol y=x^2
                options: ['y = x^2', 'y = x^3', 'y = sin(x)', 'y = log(x)'],
                answer: 'y = x^2',
                explain: 'Đây là đồ thị của hàm số bậc hai y = x^2, một parabol có đỉnh tại gốc tọa độ.'
            }
        ],
    },
    'Vật lý Đại cương': {
        'Chương 1: Cơ học Newton': [
            {
                question: 'Xác định các lực tác dụng lên vật trong hình vẽ:',
                image: 'https://i.imgur.com/eBwZ8rC.png', // Link ảnh giản đồ lực đơn giản
                options: ['Trọng lực P và Phản lực N', 'Lực ma sát', 'Lực căng T', 'Cả 3 lực trên'],
                answer: 'Cả 3 lực trên',
                explain: 'Vật chịu tác dụng của trọng lực P hướng xuống, phản lực N của mặt phẳng hướng lên, và lực căng dây T.'
            }
        ]
    }
    // Bạn có thể thêm các môn học và chương khác vào đây
};


// Dữ liệu môn học, chương
const sampleData = [
  {
    subject: { name: 'Toán học Cao cấp', image: 'https://i.imgur.com/8a1hXUa.png', description: 'Các chủ đề về giải tích, đại số tuyến tính và xác suất.' },
    chapters: [
      { name: 'Chương 1: Giới hạn và Liên tục', description: 'Các khái niệm cơ bản về giới hạn.' },
      { name: 'Chương 2: Đạo hàm và Ứng dụng', description: 'Tính đạo hàm và ứng dụng.' },
      { name: 'Chương 3: Tích phân', description: 'Các phương pháp tính tích phân.' },
    ]
  },
  {
    subject: { name: 'Lịch sử Việt Nam', image: 'https://i.imgur.com/2Y4zX3f.png', description: 'Lịch sử Việt Nam từ thời dựng nước đến hiện đại.' },
    chapters: [
      { name: 'Chương 1: Thời kỳ Dựng nước và Bắc thuộc', description: 'Từ Hùng Vương đến 1000 năm Bắc thuộc.' },
      { name: 'Chương 2: Các triều đại Phong kiến tự chủ', description: 'Từ Ngô, Đinh, Tiền Lê đến Nguyễn.' },
      { name: 'Chương 3: Thời kỳ Cận - Hiện đại', description: 'Từ kháng chiến chống Pháp đến nay.' },
    ]
  },
  {
    subject: { name: 'Vật lý Đại cương', image: 'https://i.imgur.com/mO2Z7zD.png', description: 'Các nguyên lý cơ bản của cơ, nhiệt, điện, quang.' },
    chapters: [
      { name: 'Chương 1: Cơ học Newton', description: 'Các định luật Newton, năng lượng và công.' },
    ]
  }
];

// Hàm kết nối DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/QuizApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Hàm sinh câu hỏi text
const generateTextQuestions = (subjectName, chapterName, quizId, count) => {
  const questions = [];
  const pool = questionBank[subjectName]?.[chapterName] || [];
  if (pool.length === 0) return [];
  for (let i = 0; i < count; i++) {
    const template = pool[Math.floor(Math.random() * pool.length)];
    questions.push({ ...template, quizId });
  }
  return questions;
};

// Hàm sinh câu hỏi hình ảnh (MỚI)
const generateImageQuestions = (subjectName, chapterName, quizId, count) => {
    const questions = [];
    const pool = imageQuestionBank[subjectName]?.[chapterName] || [];
    if (pool.length === 0) return [];
    for (let i = 0; i < count; i++) {
      const template = pool[Math.floor(Math.random() * pool.length)];
      questions.push({ ...template, quizId });
    }
    return questions;
  };


// Hàm chính để seed dữ liệu
const importData = async () => {
  try {
    await connectDB();

    console.log('Xóa dữ liệu cũ...');
    await QuestionImage.deleteMany(); // <<< THÊM MỚI
    await QuestionText.deleteMany();
    await Quiz.deleteMany();
    await Chapter.deleteMany();
    await Subject.deleteMany();
    console.log('Đã xóa dữ liệu cũ thành công!');

    console.log('Bắt đầu tạo dữ liệu mới...');
    for (const data of sampleData) {
      const subject = await Subject.create(data.subject);
      console.log(`Đã tạo môn học: ${subject.name}`);

      for (const [i, chapterData] of data.chapters.entries()) {
        const chapter = await Chapter.create({ ...chapterData, subjectId: subject._id, order: i + 1, availability: true });
        console.log(`-- Đã tạo chương: ${chapter.name}`);

        for (let j = 1; j <= 5; j++) {
          const quizName = `Đề kiểm tra số ${j}`;
          const quiz = await Quiz.create({ name: quizName, subjectId: subject._id, chapterId: chapter._id, questionNum: 30, timeLimit: 45, availability: true });
          console.log(`---- Đã tạo đề thi: ${quiz.name}`);

          // *** THAY ĐỔI: Tạo câu hỏi text VÀ hình ảnh ***
          const textQ = generateTextQuestions(subject.name, chapter.name, quiz._id, 25);
          const imageQ = generateImageQuestions(subject.name, chapter.name, quiz._id, 5);
          
          if (textQ.length > 0) {
            await QuestionText.insertMany(textQ);
            console.log(`------ Đã tạo ${textQ.length} câu hỏi text.`);
          }
          if (imageQ.length > 0) {
            await QuestionImage.insertMany(imageQ);
            console.log(`------ Đã tạo ${imageQ.length} câu hỏi hình ảnh.`);
          }
        }
      }
    }

    console.log('Dữ liệu đã được tạo thành công!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error}`);
    process.exit(1);
  }
};

// Hàm xóa dữ liệu
const destroyData = async () => {
    try {
      await connectDB();
      await QuestionImage.deleteMany(); // <<< THÊM MỚI
      await QuestionText.deleteMany();
      await Quiz.deleteMany();
      await Chapter.deleteMany();
      await Subject.deleteMany();
      console.log('Dữ liệu đã được xóa thành công!');
      process.exit();
    } catch (error) {
      console.error(`Lỗi: ${error}`);
      process.exit(1);
    }
};
  
// Xử lý tham số dòng lệnh
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}