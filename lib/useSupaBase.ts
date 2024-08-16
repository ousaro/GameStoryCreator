import { useEffect, useState } from "react"
import { Alert } from "react-native"
 
const useSupaBase =  (fn: () => any) =>{
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
  
    const fetchStories = async () =>{
        setIsLoading(true);

        try{

            const data = await fn();

        
            setData(data);

        }catch(error: any){
            Alert.alert("Error", error.message)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{

        fetchStories()

    }, [])

    const refetch = ()=>{
        fetchStories()
    }


    return {data, isLoading, refetch}
}

export default useSupaBase;