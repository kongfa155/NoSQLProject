import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ReviewDrawer({ totalQuestions = 0 }) {
  const [open, setOpen] = useState(false);

  const handleScrollToQuestion = (num) => {
    const el = document.getElementById(`question-${num}`);
    if (!el) return;

    try {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const rect = el.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          const scrollTop = window.scrollY || window.pageYOffset;
          const elTop = rect.top + scrollTop - 80; // header offset
          window.scrollTo({ top: Math.max(elTop, 0), behavior: "smooth" });
        }
      }, 250);
    } catch {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const elTop = rect.top + scrollTop - 80;
      window.scrollTo({ top: Math.max(elTop, 0), behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[240px] bg-white shadow-2xl border-l border-gray-200 
      transition-transform duration-300 ease-in-out z-[1000]
      ${open ? "translate-x-0" : "translate-x-[240px]"}`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute left-[-30px] top-5 w-[30px] h-10 bg-white border border-gray-300 border-r-0 
        rounded-l-md flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
      >
        {open ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Content */}
      <div className="p-4 h-full flex flex-col">
        <h4 className="text-lg font-semibold text-[#3D763A] text-center mb-4">
          Câu hỏi
        </h4>

        <div className="grid grid-cols-4 gap-2 justify-items-center overflow-y-auto pr-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleScrollToQuestion(i + 1)}
              className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-300 font-medium 
              text-gray-700 hover:bg-green-50 hover:border-[#3D763A] hover:text-[#3D763A] transition-all"
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
