import  './AlertBoxes.css';

function closeButtonHolder(){
    console.log("close button");
}


export default function ConfirmAlert({title="No title", information="No information", closeButton=closeButtonHolder, confirmButton=closeButtonHolder, isNegative=false}){


    


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-6 z-40">
            <div className ="p-8 w-[600px] min-h-[400px] bg-[#f3f4f6] rounded-3xl flex flex-col">
                <h1 className="text-center">{title}</h1>
                <p className="p-8 text-[1.5rem]">{information}</p>
                <div className="flex justify-end mt-[auto]">
                    <div className="grid grid-cols-2 gap-4">
                        <div 
                        onClick={confirmButton}
                        className={`px-4 min-h-[3rem] ${isNegative?"bg-[#dd3f3f]":"bg-[#6ea269]"} text-white font-bold text-[1.3rem] rounded-xl flex justify-center items-center cursor-pointer`}>Xác nhận</div>
                        <div 
                        onClick={closeButton}
                        className="px-4 min-h-[3rem] bg-[#6ea269] text-white font-bold text-[1.3rem] rounded-xl flex justify-center items-center cursor-pointer">Hủy</div>
                    </div>
                </div>
                
            </div>

        </div>
        

    );
}