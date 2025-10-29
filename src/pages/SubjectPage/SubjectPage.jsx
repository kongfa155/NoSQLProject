import "./SubjectPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux"; //

import ConfirmAlert from "../../components/AlertBoxes/ConfirmAlert";
import CreateSubjectModal from "../../components/CreateSubJectModal/CreateSubjectModal";
import subjectService from "../../services/subjectService";

export default function SubjectPage() {
  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const type = useSelector(state => state.viewMode.mode);
  const navigate = useNavigate();
  const account = useSelector((state) => state.user.account); //

  //
  useEffect(() => {
    subjectService
      .getAll()
      .then((res) => {
        setSubjects(res.data);
      })
      .catch((err) => {
        console.log("Gap loi khi lay subject: ", err);
      });
  }, []);
  const reFetchSubjects = async () => {
    try {
      subjectService
        .getAll()
        .then((res) => {
          setSubjects(res.data);
        })
        .catch((err) => {
          console.log("Gap loi khi lay subject: ", err);
        });
    } catch (err) {
      console.log("Gap loi khi lay subject: ", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col overflow-y-auto">
      <div className=" mx-24 my-24">
        <div id="subjectPageTitle" className="text-[#272b41]">
          {type == "view" ? (
            <h1 className="text-[#31872D]">Làm Bài Trực Tuyến</h1>
          ) : (
            <h1 className="text-[#31872D]">Chỉnh Sửa Môn Học</h1>
          )}

          <div className="relative flex flex-row w-full h-auto  justify-between">
            <p className="mx-8 text-xl">Danh sách các môn học sẵn có</p>
            {account.role === "Admin" && ( //
              <div
                className="absolute right-[5%] rounded-2 text-2xl text-[#e7e7e7]  shadow-black px-8 py-4 select-none cursor-pointer
                        bg-[#31872D] transition-all duration-500 hover:scale-105
                        "
                onClick={() => {
                  setShowCreateSubjectModal(true);
                }}
              >
                Thêm môn học
              </div>
            )}
            
          </div>
        </div>

        
            <div className="w-[90%] mx-auto my-12 grid grid-cols-3 gap-18">
          {subjects.length > 0 &&
            subjects.map((subject, i) => {
              if(!subject.availability){
                return;
              }
              return (
                <SubjectBox
                  key={`subject_${i}`}
                  navigate={navigate}
                  subject={subject}
                  type={type}
                  reFetchSubjects={reFetchSubjects}
                ></SubjectBox>
              );
            })}
        </div>
        
      </div>
      {showCreateSubjectModal && (
        <CreateSubjectModal
          setShowCreateSubjectModal={setShowCreateSubjectModal}
        ></CreateSubjectModal>
      )}
    </div>
  );
}

function SubjectBox({ subject, navigate, type, reFetchSubjects }) {
  const [showConfirm, setShowConfirm] = useState(0);
  return (
    <div className="relative w-[100%] shadow-sm shadow-black justify-items-center overflow-hidden rounded-xl">
      <div className="h-[312px] w-full p-2 rounded-xl">
        <img
          src={subject.image}
          atl={`Url: ${subject.image}`}
          className="w-full h-full object-cover object-center"
        ></img>
      </div>
      <div className="my-2  w-full flex justify-center">
        <p className="text-center text-[32px] line-clamp-1 px-4">
          {subject.name}
        </p>
      </div>
      <div className=" flex justify-center">
        <p className="min-h-[4rem] text-center px-4 text-[18px] text-gray-700 line-clamp-2 ">
          {subject.description}
        </p>
      </div>
      {type == "view" ? (
        <div
          onClick={() => {
            navigate(`/subject/view/${subject._id}`);
          }}
          className=" transition-all duration-500 w-[50%] mx-auto mb-4 h-[2rem] bg-[#31872D] hover:scale-105  rounded-xl flex justify-center items-center text-[#e7e7e7] cursor-pointer"
        >
          Vào học →
        </div>
      ) : (
        <div className="grid grid-cols-2 justify-items-center pb-2 mx-8 gap-4 my-2">
          <div
            onClick={() => {
              navigate(`/subject/edit/${subject._id}`);
            }}
            className=" transition-all duration-500 w-full h-[2rem] bg-qprimary hover:scale-105 rounded-xl flex justify-center items-center text-[#e7e7e7] cursor-pointer"
          >
            Chỉnh sửa →
          </div>
          <div
            onClick={() => {
              setShowConfirm(true);
            }}
            className=" transition-all duration-500 w-full h-[2rem] bg-[#ff6b6b] hover:scale-105 rounded-xl flex justify-center items-center text-[#e7e7e7] cursor-pointer"
          >
            Xóa ✘
          </div>

          {showConfirm == 1 && (
            <ConfirmAlert
              title="Xác nhận xóa môn học"
              information="Bạn có chắc chắn muốn xóa môn học này không?"
              isNegative={true}
              confirmButton={async () => {
                try {
                  await subjectService.updateAvailability(subject._id,{
                    availability:false,
                  });
                  reFetchSubjects();
                } catch (err) {
                  console.log("Khong xoa duoc subject");
                }
              }}
              closeButton={() => {
                setShowConfirm(0);
              }}
            ></ConfirmAlert>
          )}
        </div>
      )}
    </div>
  );
}
