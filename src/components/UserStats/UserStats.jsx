// ---------------- UserStats ----------------
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
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const UserStats = ({ userId, chapters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(false);

  useEffect(() => {
    if (!userId || !chapters?.length) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        // Lấy best submission của từng quiz
        const chapterDataPromises = chapters.map(async (chapter) => {
          const quizPromises = chapter.quizzes.map(async (quiz) => {
            const res = await axios.get(
              `/api/submissions/latest/${quiz._id}/${userId}`
            );
            // Nếu có submission thì trả về score, nếu chưa thì trả về null
            return res.data?.score ?? null;
          });

          const scores = await Promise.all(quizPromises);

          // Lọc ra chỉ những quiz có submission
          const validScores = scores.filter((score) => score !== null);

          // Tính trung bình dựa trên số quiz có submission
          const avg =
            validScores.length > 0
              ? validScores.reduce((a, b) => a + b, 0) / validScores.length
              : 0;

          return {
            name: chapter.name,
            avg: parseFloat(avg.toFixed(1)),
            target: 85,
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

  const overallAvg = useMemo(() => {
    if (!data.length) return 0;
    const sum = data.reduce((acc, d) => acc + d.avg, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  const recommendation = useMemo(() => {
    // Nếu không có dữ liệu, không đưa ra đề xuất
    if (!data.length) {
      return "Vui lòng hoàn thành ít nhất một bài kiểm tra để nhận đề xuất học tập chi tiết.";
    }

    // 1. Phân loại các chương dựa trên điểm trung bình
    const weakChapters = data.filter((d) => d.avg < 40).map((d) => d.name);
    const middleChapters = data
      .filter((d) => d.avg >= 40 && d.avg <= 70)
      .map((d) => d.name);
    const strongChapters = data.filter((d) => d.avg > 70).map((d) => d.name);

    let message = "";

    // 2. Tạo thông điệp tổng quan dựa trên điểm trung bình chung
    if (overallAvg >= 90) {
      message +=
        "🔥 Rất xuất sắc! Bạn đang làm rất tốt, hãy duy trì phong độ nhé.";
    } else if (overallAvg >= 75) {
      message += "⚡ Khá tốt rồi! Phong độ tổng thể của bạn rất ổn định.";
    } else if (overallAvg >= 60) {
      message +=
        "💪 Cần cố gắng hơn một chút! Hãy tập trung vào những chương chưa đạt yêu cầu.";
    } else {
      message +=
        "📚 Bạn cần ôn tập lại các chương cơ bản. Đã đến lúc dành thời gian nghiêm túc cho việc học.";
    }
    if (weakChapters.length > 0) {
      message += `\n\n⚠️ Chương cần TẬP TRUNG CAO ĐỘ (${
        weakChapters.length
      } chương) Bạn cần ôn tập lại toàn bộ kiến thức và làm thêm nhiều bài tập cho các chương: ${weakChapters.join(
        ", "
      )}.`;
    }

    if (middleChapters.length > 0) {
      message += `\n\n⭐ Chương nên ÔN TẬP THÊM (${
        middleChapters.length
      } chương): Điểm 40% - 70%. Bạn đã nắm được cơ bản nhưng cần luyện tập nhiều hơn để nâng cao điểm số ở các chương: ${middleChapters.join(
        ", "
      )}.`;
    }

    if (
      weakChapters.length === 0 &&
      middleChapters.length === 0 &&
      strongChapters.length > 0
    ) {
      // Nếu tất cả đều > 70%
      message += `\n\n✅ Đánh giá chi tiết: Tất cả các chương đều đạt kết quả TỐT (trên 70%). Hãy tiếp tục luyện tập để đạt mức hoàn hảo 100%!`;
    } else if (
      strongChapters.length > 0 &&
      (weakChapters.length > 0 || middleChapters.length > 0)
    ) {
      // Trường hợp có cả chương tốt và chương yếu
      message += `\n\n✅ Đánh giá chi tiết: Bạn đã đạt kết quả TỐT (trên 70%) ở các chương: ${strongChapters.join(
        ", "
      )}. Hãy tạm thời ưu tiên thời gian cho các chương còn yếu hơn.`;
    }

    return message;
  }, [overallAvg, data]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    // Chỉ hiển thị Tooltip nếu activeTooltip là TRUE và Recharts báo active
    if (activeTooltip && active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #ddd",
            padding: "8px",
            fontSize: "14px",
          }}
        >
          <p className="label" style={{ fontWeight: "bold", color: "#3D763A" }}>
            {label}
          </p>
          {payload.map((p, index) => (
            <p key={index} style={{ color: p.color || "#333" }}>
              {p.name}: <span style={{ fontWeight: "600" }}>{p.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      <div style={{ width: "100%", height: 350, padding: "16px 0" }}>
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
            <Tooltip trigger="hover" cursor={false} content={CustomTooltip} />
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

      <div
        className="p-6 rounded-xl border border-gray-200 bg-[#F8FFF8] shadow-sm"
        style={{ lineHeight: 1.6 }}
      >
        <p className="text-xl font-semibold text-[#3D763A] mb-2">
          📊 Tổng kết kết quả học tập
        </p>
        <p className="text-lg text-gray-700 mb-2">
          Điểm trung bình hiện tại:{" "}
          <span className="font-bold text-[#2F855A]">{overallAvg}%</span>
        </p>
        <p
          className="text-gray-700 text-base italic"
          style={{ whiteSpace: "pre-line" }}
        >
          {recommendation}
        </p>
      </div>
    </div>
  );
};

export default UserStats;
