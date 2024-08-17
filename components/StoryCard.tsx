import { TouchableOpacity, Text, View, Image, Alert, ImageSourcePropType} from 'react-native'
import React from 'react'
import { router, usePathname, Href } from 'expo-router'
import {icons} from "@/constants"
import {deletePost} from "@/lib/supabase"


const StoryCard = ({story, canDelete} : {story : any, canDelete?: boolean})  => {

    const pathName = usePathname()
    let storyId : string = story.id || ""

    const handleDeletePost = async ()=>{
        
        await deletePost(story.id)
        
        Alert.alert("Success", "Post successfully deleted")
    }


  return (
    <View className='flex-col items-center px-4 mb-14'>

        <View className='flex-row gap-3 items-start'>

            <View className='justify-center items-center flex-row flex-1'>

                <TouchableOpacity className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5' 
                    activeOpacity={0.8}
                    onPress={()=> router.push('/profile')}
                    >

                    <Image 
                        source={{ uri: story.ownerdata?.avatar_uri}}
                        className='w-full h-full rounded-lg'
                        resizeMode='contain'
                    />


                </TouchableOpacity>

                <View className='justify-center flex-1 ml-3 gap-y-1'>

                    <Text className='text-third font-psemibold text-sm' numberOfLines={1}>
                            {story.title}
                    </Text>

                    <Text className='text-third font-pregular text-xs' numberOfLines={1}>
                            {story.ownerdata?.username}
                    </Text>

                </View>

                <TouchableOpacity 
                onPress={handleDeletePost}
                >
                    <Image 
                        source={icons.deleteIcon as ImageSourcePropType}
                        className='w-6 h-6 rounded-lg'
                        resizeMode='contain'
                    />
                </TouchableOpacity>

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

    </View>
  )
}

export default StoryCard
