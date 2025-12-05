//Cái này sẽ được bỏ khi làm nghiên cứu khoa học trên dự án này, giờ thì không cần thiết
export default function stringValidater(value, type){
    const nameRegex = /^[a-zA-ZÀ-ỹ0-9\s]*$/u; // chỉ cho phép chữ cái và số và khoảng trắng
    const safeInputRegex = /^[a-zA-ZÀ-ỹ0-9\s.,_-]*$/u; // thoải mái hơn, được dùng kí tự nhưng cấm mấy cái dùng để inject csdl
    if(type==1){
       return nameRegex.test(value);
    }else{
        return safeInputRegex.test(value);
    }


}