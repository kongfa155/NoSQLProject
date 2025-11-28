import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts"; 
/*Thư viện hỗ trợ vẽ biểu đồ
BarChart, Bar, Line là các loại biểu đồ.

XAxis, YAxis là trục X và trục Y.

Legend là chú thích màu cho biểu đồ.

Tooltip là thông tin hiển thị khi di chuột lên biểu đồ.

ResponsiveContainer giúp biểu đồ tự co giãn theo kích thước khung
*/
import { useState, useEffect, useMemo } from "react";
import submissionService from "../../services/submissionService";

//Tùy chỉnh thông tin hiển thị khi hover chuột vào 
const CustomTooltip = ({ active, payload, label }) => {
    //Active là có đang hover không
    //Payload là thông tin cần hiển thị
    //Label tên cột đang hover vào
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 p-2 text-sm shadow-md">
        <p className="font-bold text-[#3D763A] mb-1">{label}</p>
        {payload.map((p, index) => (
          <p key={index} className="text-gray-700">
            <span style={{ color: p.color || "#333" }}>{p.name}: </span>
            <span className="font-semibold">{p.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const UserStats = ({ userId, chapters }) => { //Thông tin người dùng và các chương
  const [data, setData] = useState([]); //Lưu điểm trung bình từng chương
  const [loading, setLoading] = useState(true); //Trạng thái có đang laod không 
  const [activeTooltip, setActiveTooltip] = useState(false); //Trạng thái của hộp thông tin
    //Lấy dữ liệu mỗi khi đổi chapter
  useEffect(() => {
    if (!userId || !chapters?.length) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        //Lấy điểm cao nhất từng bài trong mỗi chương
        const chapterDataPromises = chapters.map(async (chapter) => {
          const quizPromises = chapter.quizzes.map(async (quiz) => {
            const res = await submissionService.getBest(quiz._id, userId);
            return res.data?.bestScore ?? null;
          });

          const scores = await Promise.all(quizPromises);
          //Kiểm tra giá trị điểm
          const validScores = scores.filter((s) => s !== null);
          const avg =
            validScores.length > 0
              ? validScores.reduce((a, b) => a + b, 0) / validScores.length
              : 0; //Tính điểm trung bình

          return {
            name: chapter.name,
            avg: parseFloat(avg.toFixed(1)),
            target: 90,
          };
        });
        
        const resolvedData = await Promise.all(chapterDataPromises);
        setData(resolvedData);
      } catch (err) {
        console.error("Lỗi khi lấy stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, chapters]);
  //Hàm tính điểm trung bình toàn bộ môn
  const overallAvg = useMemo(() => {
    if (!data.length) return 0;
    const sum = data.reduce((acc, d) => acc + d.avg, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);
  //Gợi ý ôn tập dựa trên điểm 
  const recommendation = useMemo(() => {
    if (!data.length) {
      return "Bạn chưa làm bài nào cả";
    }

    const weakChapters = data.filter((d) => d.avg < 40).map((d) => d.name);
    const middleChapters = data
      .filter((d) => d.avg >= 40 && d.avg <= 70)
      .map((d) => d.name);
    const strongChapters = data.filter((d) => d.avg > 70).map((d) => d.name);

    let message = "";
    if (overallAvg >= 90) {
      message +=
        "Bạn đã đạt được chỉ tiêu để được điểm A rồi. Cũng kinh đấy";
    } else if (overallAvg >= 70) {
      message += "Đạt điểm khá rồi kìa, cố lên bạn ơi!!";
    } else if (overallAvg >= 40) {
      message +=
        "Đã đủ điểm qua môn, nhưng đừng dừng lại ở đó";
    } else {
      message +=
        "Chưa đủ điểm qua môn đâu bạn ơi, dành thời gian ôn tập thêm nhé ^^";
    }

    if (weakChapters.length > 0) {
      message += `\n\n!!!Chương cần ưu tiên học (${
        weakChapters.length
      } chương): ${weakChapters.join(", ")}.`;
    }
    if (middleChapters.length > 0) {
      message += `\n\n =(^-^)= Chương bạn nên ôn tập thêm (${
        middleChapters.length
      } chương): ${middleChapters.join(", ")}.`;
    }
    if (
      weakChapters.length === 0 &&
      middleChapters.length === 0 &&
      strongChapters.length > 0
    ) {
      message += `\n\n Tất cả các chương đều trên điểm Khá (70%). Còn cao hơn được nữa không!`;
    } else if (
      strongChapters.length > 0 &&
      (weakChapters.length > 0 || middleChapters.length > 0)
    ) {
      message += `\n\n✅ Bạn đạt điểm khá (trên 70%) ở các chương: ${strongChapters.join(
        ", "
      )}. Cố gắng ở các chương còn lại nào`;
    }

    return message;
  }, [overallAvg, data]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full h-[350px] py-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
            onMouseLeave={() => setActiveTooltip(false)}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#3D763A", fontWeight: 600 }}
              tickMargin={10}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#3D763A", fontWeight: 600 }}
              label={{
                value: "Điểm trung bình (%)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                fill: "#3D763A",
                fontWeight: 600,
              }}
            />
            <Tooltip
              trigger="hover"
              cursor={false}
              content={CustomTooltip}
              active={activeTooltip}
            />
            <Legend verticalAlign="top" align="right" />
            <Bar
              dataKey="avg"
              name="Điểm trung bình"
              fill="#3D763A"
              radius={[8, 8, 0, 0]}
              barSize={40}
              onMouseOver={() => setActiveTooltip(true)}
              onMouseOut={() => setActiveTooltip(false)}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#E53E3E"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Mục tiêu"
              strokeDasharray="4 4"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 rounded-xl border border-gray-200 bg-[#F8FFF8] shadow-sm leading-relaxed">
        <p className="text-xl font-semibold text-[#3D763A] mb-2">
          📊 Tổng kết kết quả học tập
        </p>
        <p className="text-lg text-gray-700 mb-2">
          Điểm trung bình hiện tại:{" "}
          <span className="font-bold text-[#2F855A]">{overallAvg}%</span>
        </p>
        <p className="text-gray-700 text-base italic whitespace-pre-line">
          {recommendation}
        </p>
      </div>
    </div>
  );
};

export default UserStats;
