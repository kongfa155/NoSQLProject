import "./CreateChapterModal.css";
import { useEffect, useState } from "react";
import chapterService from "../../services/chapterService";
export default function CreateChapterModal({
  setShowConfirm,
  subjectId,
  showCreateChapter,
  setShowCreateChapter,
}) {
  if (!showCreateChapter) {
    return <></>;
  }

  const [chapters, setChapters] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [desc, setDesc] = useState("");
  const [expandChapter, setExpandChapter] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(-1);

  useEffect(() => {
    chapterService
      .getBySubject(subjectId)
      .then((res) => {
        setChapters(res.data);
      })
      .catch((err) => {
        console.log("Gap loi khi lay chapter: ", err);
      });
  }, []);
  const handleCreateChapter = () => {
    if (
      (selectedChapter == "new" && (chapterName == "" || desc == "")) ||
      selectedChapter == -1
    ) {
      return;
    }
    if (selectedChapter == "new") {
      chapterService
        .create({
          subjectId: subjectId,
          name: chapterName,
          description: desc,
          availability: true,
        })
        .then((res) => {
          console.log("tao thanh cong: ", res);
          location.reload();
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    } else {
      console.log("case");
      chapterService
        .updateAvailability(selectedChapter, {
          availability: true,
        })
        .then((res) => {
          location.reload();
        })
        .catch((err) => {
          location.reload();
        });
    }
  };
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-49">
      <div className="relative w-[50%] min-h-[50%] bg-white rounded-[8px]">
        <div className="text-center pt-2 text-3xl font-bold">Thêm chương</div>
        <div className="mt-4 px-4 text-2xl">Danh sách chương sẵn có :</div>
        <div
          className={`border-2 w-[90%] mx-auto mt-4 ${
            expandChapter ? "min-h-[300px] mb-20" : "min-h-[50px] mb-4"
          }`}
        >
          <div
            onClick={() => {
              setExpandChapter((prev) => {
                if (prev == true) {
                  setSelectedChapter("new");
                } else {
                  setSelectedChapter(-1);
                }
                return !prev;
              });
            }}
            className={`text-xl px-4 py-2 ${
              !(selectedChapter == "new") ? "hover:bg-gray-200" : "bg-gray-200"
            } hover:cursor-pointer `}
          >
            -- Tạo chương mới --
          </div>
          <div className={`${!expandChapter ? "hidden" : ""}`}>
            {chapters?.map((chapter, i) => {
              if (!chapter.availability)
                return (
                  <div
                    onClick={() => {
                      setSelectedChapter(chapter._id);
                    }}
                    key={`chapter_${i}`}
                    className={`text-xl px-4 py-2 ${
                      !(selectedChapter == chapter._id)
                        ? "hover:bg-gray-200"
                        : "bg-gray-200"
                    } hover:cursor-pointer`}
                  >
                    {chapter.name}
                  </div>
                );
            })}
          </div>
        </div>
        {!expandChapter && (
          <div className="relative mb-24">
            <p className="text-2xl px-4">Tên chương mới: </p>
            <input
              value={chapterName}
              onChange={(e) => {
                setChapterName(e.target.value);
              }}
              className="text-2xl px-4 py-2 w-[95%] mx-6"
            ></input>
            <p className="text-2xl px-4 mt-2">Mô tả chương: </p>
            <input
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              className="text-2xl px-4 py-2 w-[95%] mx-6"
            ></input>
          </div>
        )}
        <div
          onClick={() => {
            handleCreateChapter();
          }}
          className="absolute bottom-4 transition-all duration-400 right-28 bg-green-600 text-white text-[1.5rem] px-4 py-2 rounded-md hover:scale-105 hover:cursor-pointer"
        >
          Thêm
        </div>
        <div
          onClick={() => {
            setShowCreateChapter(false);
          }}
          className="absolute bottom-4 transition-all duration-400 right-4 bg-green-600 text-white text-[1.5rem] px-4 py-2 rounded-md hover:scale-105 hover:cursor-pointer"
        >
          Hủy
        </div>
      </div>
    </div>
  );
}
