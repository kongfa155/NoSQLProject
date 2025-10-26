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
import submissionService from "../../services/submissionService";

const CustomTooltip = ({ active, payload, label }) => {
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

const UserStats = ({ userId, chapters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(false);

  useEffect(() => {
    if (!userId || !chapters?.length) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const chapterDataPromises = chapters.map(async (chapter) => {
          const quizPromises = chapter.quizzes.map(async (quiz) => {
            const res = await submissionService.getLatest(quiz._id, userId);
            return res.data?.score ?? null;
          });

          const scores = await Promise.all(quizPromises);
          const validScores = scores.filter((s) => s !== null);
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
    if (!data.length) {
      return "Vui lòng hoàn thành ít nhất một bài kiểm tra để nhận đề xuất học tập chi tiết.";
    }

    const weakChapters = data.filter((d) => d.avg < 40).map((d) => d.name);
    const middleChapters = data
      .filter((d) => d.avg >= 40 && d.avg <= 70)
      .map((d) => d.name);
    const strongChapters = data.filter((d) => d.avg > 70).map((d) => d.name);

    let message = "";
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
      } chương): ${weakChapters.join(", ")}.`;
    }
    if (middleChapters.length > 0) {
      message += `\n\n⭐ Chương nên ÔN TẬP THÊM (${
        middleChapters.length
      } chương): ${middleChapters.join(", ")}.`;
    }
    if (
      weakChapters.length === 0 &&
      middleChapters.length === 0 &&
      strongChapters.length > 0
    ) {
      message += `\n\n✅ Tất cả các chương đều đạt kết quả TỐT (trên 70%). Tiếp tục phát huy!`;
    } else if (
      strongChapters.length > 0 &&
      (weakChapters.length > 0 || middleChapters.length > 0)
    ) {
      message += `\n\n✅ Bạn đã làm TỐT (trên 70%) ở các chương: ${strongChapters.join(
        ", "
      )}. Tập trung thêm ở các chương còn yếu.`;
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
