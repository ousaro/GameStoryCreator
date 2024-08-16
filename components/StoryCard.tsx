import { TouchableOpacity, Text, View, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import { images } from '@/constants'

const StoryCard = ({story} : {story : any})  => {


  return (
    <View className='flex-col items-center px-4 mb-14'>

        <View className='flex-row gap-3 items-start'>

            <View className='justify-center items-center flex-row flex-1'>

                <TouchableOpacity className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5' 
                    activeOpacity={0.8}
                    onPress={()=> router.push('/profile')}
                    >

                    <Image 
                        source={{ uri: story.ownerdata.avatar_uri}}
                        className='w-full h-full rounded-lg'
                        resizeMode='contain'
                    />


                </TouchableOpacity>

                <View className='justify-center flex-1 ml-3 gap-y-1'>

                    <Text className='text-third font-psemibold text-sm' numberOfLines={1}>
                            {story.title}
                    </Text>

                    <Text className='text-third font-pregular text-xs' numberOfLines={1}>
                            {story.ownerdata.username}
                    </Text>

                </View>

            </View>

        </View>

        <TouchableOpacity className='w-full h-60 rounded-xl mt-3 relative justify-center items-center' 
        activeOpacity={0.7}
        onPress={()=> router.push('/create')}
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
