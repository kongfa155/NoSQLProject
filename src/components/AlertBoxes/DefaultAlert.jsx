import  './AlertBoxes.css';

function closeButtonHolder(){
    console.log("close button");
}


export default function DefaultAlert({title="No title", information="No information", closeButton=closeButtonHolder}){


    


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-6 z-40">
            <div className ="p-8 w-[600px] min-h-[400px] bg-[#f3f4f6] rounded-3xl flex flex-col">
                <h1 className="text-center">{title}</h1>
                <p className="p-8 text-[1.5rem]">{information}</p>
                <div className="flex justify-end mt-[auto]">
                    <div 
                        onClick={closeButton}
                        className="w-[96px] min-h-[3rem] bg-[#6366F1] text-white font-bold text-[1.3rem] rounded-xl flex justify-center items-center cursor-pointer">Đóng</div>
                </div>
                
            </div>

        </div>
        

    );
}