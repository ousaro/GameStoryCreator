import { View, Text, Image, TouchableOpacity , ImageSourcePropType, ScrollView, RefreshControl} from 'react-native'
import React, { useEffect, useState,useCallback  } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import ObjectsList from '@/components/objectsList'
import Titles from '@/components/titles'
import PressableText from '@/components/pressableText'
import LecturePage from "@/components/lecturePage"
import CreateObject from "@/components/CreateObject"

import { getPostById } from '@/lib/supabase'
import useSupaBase from '@/lib/useSupaBase'

import { icons } from '@/constants'

const Story = () => {

  const {id} = useLocalSearchParams<{id:string}>();

  const {data: story, refetch} = useSupaBase(()=> getPostById(id || "") )


const characters = story?.characters

const areas  = story?.areas 


useEffect(()=>{
    refetch()
}, [id])

const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
     refetch();
      setRefreshing(false);
    }, 2000);
  }, []);

const [storyModalVisible, setStoryModalVisible] = useState(false);
const [characterUploadModalVisible, setCharacterUploadModalVisible] = useState(false);
const [areaUploadModalVisible, setAreaUploadModalVisible] = useState(false);

  return (
    <View>
      <SafeAreaView className='bg-primary h-full'>
        <ScrollView className='w-full' 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
            
            <View className='relative mb-32'>
                <View className='w-full'>
                    <Image 
                    source={{uri: story?.thumbnail}}
                    className='w-full h-[240px]'
                    resizeMode='cover'
                    />

                </View>  

                <TouchableOpacity className='w-10 h-10 absolute top-0 left-5' 
                    activeOpacity={0.8}
                    onPress={()=> router.push('/home')}
                    >

                    <Image 
                        source={icons.arrow as ImageSourcePropType}
                        className='w-full h-full rounded-lg'
                        resizeMode='contain'
                    />


                </TouchableOpacity>



                <View className='absolute top-[200px] left-6 flex-row gap-3 items-start'>

                        <TouchableOpacity className='w-[120px] h-[120px] rounded-lg bg-primary border border-secondary justify-center items-center p-0.5' 
                            activeOpacity={0.8}
                            onPress={()=> router.push('/profile')}
                            >

                            <Image 
                                source={{ uri: story?.ownerdata?.avatar_uri}}
                                className='w-full h-full rounded-lg'
                                resizeMode='contain'
                            />


                        </TouchableOpacity>

                        <View className='relative justify-center flex-1 ml-3 gap-y-1'>

                            <Text className='absolute top-14 text-third font-pbold text-2xl' numberOfLines={1}>
                                    {story?.ownerdata?.username}
                            </Text>

                        </View>
                        
                </View>

            </View>  

            <View className='px-2  mx-2 pb-10 space-y-4'>
                <View className='mb-2'>
                    <Text className='text-third text-3xl font-pbold'>
                        {story?.title}
                    </Text>

                    <View className=' bg-third w-full h-2' />
                </View>

                {/* story */}
                <View className='w-full h-[480px]'>

                    <Titles title='Game Story' icon={icons.story as ImageSourcePropType}/>

                    <TouchableOpacity 
                    className='w-full h-[405px] bg-fourth p-4 '
                    onPress={()=>setStoryModalVisible(true)}
                    >
                        <Text className='text-third font-pregular text-mg' numberOfLines={17} 
                            ellipsizeMode='tail'>
                            {story?.story}
                        </Text>
                    </TouchableOpacity>

                    <LecturePage  
                        modalVisible={storyModalVisible} 
                        setModalVisible={setStoryModalVisible}
                        title='Story'
                        text={story?.story}
                    />

                   
                </View>

                
                {/* characters */}
                {characters ? (
                    <View className='w-full h-[400px] '>
                    
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Characters' icon={icons.character as ImageSourcePropType}/>
                        <ObjectsList objects={characters} title='Character'/>
                        <PressableText title='add new Character' onPressHandler={()=>setCharacterUploadModalVisible(!characterUploadModalVisible)}/>
                        <CreateObject 
                            title="Upload your character"
                            modalVisible={characterUploadModalVisible}
                            setModalVisible={setCharacterUploadModalVisible}
                            type="character"
                            id={id}
                         />
                    
                    </View>):
                (
                    <View className='w-full h-[150px] '>
                    
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Characters' icon={icons.character as ImageSourcePropType}/>
                        <Text className='text-center text-third font-pregular text-mg'>
                            No characters available
                        </Text>
                        <PressableText title='add new Character' onPressHandler={()=>setCharacterUploadModalVisible(!characterUploadModalVisible)}/>
                        <CreateObject 
                            title="Upload your character"
                            modalVisible={characterUploadModalVisible}
                            setModalVisible={setCharacterUploadModalVisible}
                            type="Character"
                            id={id}
                         />

                    </View>
                )}

                
                {/* areas */}
                {areas ? (
                    <View className='w-full h-[400px] '>
               
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Areas' icon={icons.area as ImageSourcePropType}/>
                        <ObjectsList objects={areas} title='Area'/>
                        <PressableText title='add new Area' onPressHandler={()=>setAreaUploadModalVisible(!areaUploadModalVisible)}/>
                        <CreateObject 
                            title="Upload your area"
                            modalVisible={areaUploadModalVisible}
                            setModalVisible={setAreaUploadModalVisible}
                            type="Area"
                            id={id}
                         />
                        
                    </View>
                ) :

                (
                    <View className='w-full h-[150px] '>
                    
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Areas' icon={icons.character as ImageSourcePropType}/>
                        <Text className='text-center text-third font-pregular text-mg'>
                            No area available
                        </Text>
                        <PressableText title='add new Area' onPressHandler={()=>setAreaUploadModalVisible(!areaUploadModalVisible)}/>
                        <CreateObject 
                            title="Upload your area"
                            modalVisible={areaUploadModalVisible}
                            setModalVisible={setAreaUploadModalVisible}
                            type="Area"
                            id={id}
                         />

                    </View>
                )}

                
            </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Story;