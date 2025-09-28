import axios from "axios";
const API_URL = "http://localhost:5000/api/questions";

//Này để quản lý việc gọi các chức năng của backend
export const getQuestions = () => axios.get(API_URL);
export const addQuestion = (data) => axios.post(API_URL, data);
export const updateQuestion = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteQuestion = (id) => axios.delete(`${API_URL}/${id}`);
