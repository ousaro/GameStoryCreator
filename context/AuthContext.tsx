import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react"
import { getUserProfile } from "@/lib/supabase";

const AuthContext = createContext<any | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({children}: PropsWithChildren) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState<any>()
    const [isLoading, setisLoading] = useState(true)


    useEffect(() => {
        getUserProfile()
        .then((res) => {
            if(res){
                setIsLoggedIn(true);
                setUser(res)
            }else{
                setIsLoggedIn(false)
                setUser(undefined)
            }
        })
        .catch((error)=>{
            console.log(error)
        })
        .finally(()=>{
            setisLoading(false)
        })

     
    }, [])
    

    return (
        <AuthContext.Provider value={
           { isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading}
        }>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;