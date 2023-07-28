import { useEffect } from "react";
import { useState } from "react";

const useOnline = () => {
    
    const [isOnline, setisOnline] = useState(true);

    const handleOnline = ()=>{
        setisOnline(true);
        console.log("useOnline called");
    }

    const handleOffline = ()=>{
        setisOnline(false);
        console.log("useOffline called");
    }

   useEffect(()=>{
    window.addEventListener("online", handleOnline)

    window.addEventListener("offline", handleOffline)

    return()=>{
        window.removeEventListener("online",handleOnline);
        window.removeEventListener("offline",handleOffline);
    }
   },[]) 
   
    return isOnline;
}


export default useOnline;