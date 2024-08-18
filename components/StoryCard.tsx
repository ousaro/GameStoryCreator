import { TouchableOpacity, Text, View, Image, Alert, ImageSourcePropType } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, usePathname, Href } from 'expo-router'
import {icons} from "@/constants"
import {deletePost, getUserById} from "@/lib/supabase"
import { useAuthContext } from '@/context/AuthContext'
import PressableText from './pressableText'


const StoryCard = ({story, canDelete, setIsDeleting , refetch, textButton} : {story : any, canDelete?: boolean, setIsDeleting?: any, refetch?:boolean, textButton?:boolean})  => {

    const pathName = usePathname()
    let storyId : string = story.id || ""

    const {user} = useAuthContext()

    const [owner, setOwner] = useState<any>(undefined)

   
    const handleDeletePost = async () => {
        setIsDeleting(true)
        await deletePost(story.id);
        setIsDeleting(false)
        Alert.alert("Success", "Post successfully deleted");
    };

    useEffect(()=>{
        const fetchOwner = async () =>{

            const owner = await getUserById(story?.ownerid)
            setOwner(owner)

        }

        fetchOwner()
    },[refetch])


  return (
    <View className='flex-col items-center px-4 mb-14'>

        <View className='flex-row gap-3 items-start'>

            <View className='justify-center items-center flex-row flex-1'>

                <TouchableOpacity className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5' 
                    activeOpacity={0.8}
                    onPress={()=> {
                        if(owner?.id === user?.id) 
                            router.push('/profile')}
                        }
                    >

                    <Image 
                        source={{ uri: owner?.avatar_url}}
                        className='w-full h-full rounded-lg'
                        resizeMode='contain'
                    />


                </TouchableOpacity>

                <View className='justify-center flex-1 ml-3 gap-y-1'>

                    <Text className='text-third font-psemibold text-sm' numberOfLines={1}>
                            {story.title}
                    </Text>

                    <Text className='text-third font-pregular text-xs' numberOfLines={1}>
                            {owner?.username}
                    </Text>

                </View>

                { canDelete &&
                <TouchableOpacity 
                onPress={handleDeletePost}
                >
                    <Image 
                        source={icons.deleteIcon as ImageSourcePropType}
                        className='w-6 h-6 rounded-lg'
                        resizeMode='contain'
                    />
                </TouchableOpacity>}

            </View>

        </View>

        <TouchableOpacity className='w-full h-60 rounded-xl mt-3 relative justify-center items-center' 
        activeOpacity={0.7}
        onPress={()=>{
            if(!storyId){
                Alert.alert("Missing query", "Invalid Story Id")
                return;
            }


            const route = `/story/${storyId}` as Href;

            if(pathName.startsWith("/story")){
                router.setParams({storyId})
            }else{
                router.push(route)
            }
        }}
        >

            <Image 
                source={ {uri : story.thumbnail}} // {uri: thumbail}
                className='w-full h-full rounded-xl'
                resizeMode='cover'
            />

        </TouchableOpacity>

        {textButton && <PressableText title='delete' onPressHandler={()=>{}}/>}
       

    </View>
  )
}

export default StoryCard
