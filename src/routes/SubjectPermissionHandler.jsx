import { useParams,Navigate, Outlet } from "react-router-dom";

import { useSelector } from 'react-redux';

export default function SubjectPermissionHandler(){
    const {type} = useParams();

    const {account} = useSelector((state)=>state.user);

    if(type=="edit" && account.role!="Admin"){
        return <Navigate to="/subject/view" replace></Navigate>
    }
    return <Outlet></Outlet>
}