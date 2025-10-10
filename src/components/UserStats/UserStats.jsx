import {
  BarChart, //Container nè
  Bar, //Cái thanh
  CartesianGrid, //Lưới
  XAxis, //Trục X
  YAxis, //Trục Y
  Legend, //Ghi chú
  Tooltip, //Công cụ hiển thị ra cái nội dung khi hover
  ResponsiveContainer, //Này hỗ trợ cho cái biểu đồ tương tác
  Line, //Vẽ đường nè
} from "recharts"; //Thằng này là thư viện dùng để tạo chart
import { useState, useMemo } from "react";

const data = [
  { name: "Chương 1", avg: 100, target: 90 },
  { name: "Chương 2", avg: 75, target: 85 },
  { name: "Chương 3", avg: 60, target: 80 },
  { name: "Chương 4", avg: 92, target: 90 },
  { name: "Chương 5", avg: 88, target: 85 },
]; //fake dữ liệu

const UserStats= ()=> {
  const [activeTooltip, setActiveTooltip] = useState(false); //Cái này dùng để xử lý lỗi hover của charts

  //Điểm trung bình toàn chương
  const overallAvg = useMemo(() => {
    const sum = data.reduce((acc, d) => acc + d.avg, 0);
    return (sum / data.length).toFixed(1);
  }, []);

  // Nhờ chat tạo lời khuyên giả nè
  const recommendation = useMemo(() => {
    if (overallAvg >= 90)
      return "🔥 Rất xuất sắc! Bạn đang làm rất tốt, hãy duy trì phong độ nhé.";
    if (overallAvg >= 75)
      return "⚡ Khá tốt rồi! Bạn nên tập trung ôn lại những chương dưới 80 điểm để cải thiện thêm.";
    if (overallAvg >= 60)
      return "💪 Cố gắng hơn chút nữa! Hãy xem lại các chương có điểm thấp và luyện thêm.";
    return "📚 Bạn cần ôn tập lại các chương cơ bản. Hãy bắt đầu với chương 1 và 2.";
  }, [overallAvg]);

  return (
    <div className="flex flex-col gap-6">
      {/* Biểu đồ */}
      <div
        style={{
          width: "100%",
          height: 350,
          padding: "16px 0",
        }}
      >
        {/* Thằng Responsive thay đổi kích thước biểu đồ */}
        <ResponsiveContainer width="100%" height="100%"> 
          <BarChart
            data={data}
            // Thằng này là cha bao hết, nhận dữ liệu là data, hàm kia viết hỗ trợ vụ default hover
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
            onMouseLeave={() => setActiveTooltip(false)}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
            {/* Trục X */}
            <XAxis
              dataKey="name"
              tick={{ fill: "#3D763A", fontWeight: 600 }}
              tickMargin={10}
            />
            {/*Trục Y, offset -10 để nó cách ra so với cái biểu đồ */}
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
            {/* Cái này là họp thông tin nữa có cách setting cho nó hiển thị gì luôn */}
            <Tooltip
              trigger="hover"
              cursor={false}
              contentStyle={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
              wrapperStyle={{
                visibility: activeTooltip ? "visible" : "hidden",
                opacity: activeTooltip ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            />
            <Legend verticalAlign="top" align="right" />
              {/* Data key là vẽ theo dữ liệu nào */}
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

      {/* Kết luận & lời khuyên */}
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
        <p className="text-gray-700 text-base italic">{recommendation}</p>
      </div>
    </div>
  );
}

export default UserStats;