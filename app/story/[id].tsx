import { View, Text, Image, TouchableOpacity , ImageSourcePropType, ScrollView, RefreshControl, Alert, ActivityIndicator, TextInput} from 'react-native'
import React, { useEffect, useState,useCallback  } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import ObjectContainer from '@/components/objectContainer'
import Titles from '@/components/titles'
import PressableText from '@/components/pressableText'
import LecturePage from "@/components/lecturePage"
import CreateObject from "@/components/CreateObject"

import { getPostById, getUserById, addToFavorite, updatePost } from '@/lib/supabase'
import useSupaBase from '@/lib/useSupaBase'

import { useAuthContext } from '@/context/AuthContext'

import { icons } from '@/constants'

const Story = () => {


    const {id} = useLocalSearchParams<{id:string}>();

    const {user} = useAuthContext()

    const {data: story, refetch} = useSupaBase(()=> getPostById(id || "") )

    const [owner, setOwner] = useState<any>()

    
    const characters = story?.characters || {}
    
    const areas  = story?.areas || {}
    
    const fetchOwner = async () => {
        try{
            
            const owner =  await getUserById(story?.ownerid)
            setOwner(owner)
            
        }catch(error: any){
        Alert.alert("Error", error.message)
        }
    }
    
    useFocusEffect(
        useCallback(() => {
          refetch()
        }, [])
      )

    useEffect(()=>{
        refetch()
    }, [id])


    useEffect(() => {
        if (story?.ownerid ) {
        fetchOwner();
        }
    }, [story?.ownerid]);

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

    const [deleting , setDeleting]= useState(false)
    const [isAddingToFavorite, setIsAddingToFavorite] = useState(false)
    const [updating, setUpdating ] = useState(false)
  

    const addToFavorites = async () =>{

        try{
            setIsAddingToFavorite(true)
            await addToFavorite(user?.id, id)

        }catch(error : any){
            Alert.alert("Error", "Already in your favorite")
        }finally{
            setIsAddingToFavorite(false)
        }
       
        

    }


    const [storyText, setStoryText] = useState(story?.story)
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        if (story?.story) {
          setStoryText(story.story);
        }
      }, [story]);
    


    const submitChanges = async (field:string, updates:string) => {

        try{
          
            setUpdating(true)
            await updatePost(field, updates, id)
            refetch()

        }catch(error : any){
            Alert.alert("Error", "Can't update")
        }finally{
            setUpdating(false)
            setIsEditable(false)
        }
       
        
    }


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
                            onPress={()=> {
                                if(owner?.id === user?.id)
                                    router.push('/profile')
                            }
                            }
                            >

                            <Image 
                                source={{ uri: owner?.avatar_url}}
                                className='w-full h-full rounded-lg'
                                resizeMode='contain'
                            />


                        </TouchableOpacity>

                        <View className='relative justify-center flex-1 ml-3 gap-y-1'>

                            <Text className='absolute top-14 text-third font-pbold text-2xl' numberOfLines={1}>
                                    {owner?.username}
                            </Text>

                        </View>

                        <TouchableOpacity className='w-10 h-10 absolute top-14 right-8' 
                            activeOpacity={0.8}
                            onPress={()=> {addToFavorites()}}
                            >

                            <Image 
                                source={icons.bookmark as ImageSourcePropType}
                                className='w-full h-full rounded-lg'
                                resizeMode='contain'
                            />


                        </TouchableOpacity>

                        
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
                        
                        <TextInput 
                            className='text-third font-pregular text-mg '
                            value={storyText}
                            onChangeText={(e)=>setStoryText(e)}
                            multiline={true} // Make it multiline
                            scrollEnabled={true} // Enable scrolling
                            numberOfLines={19} // Initial number of lines
                            textAlignVertical="top" // Align text to the top
                            placeholderTextColor="#A6A6B4"
                            editable={isEditable} // Control editable state
                        />
                    </TouchableOpacity>

                   {owner?.id === user?.id && 
                   ( !isEditable ?  
                        (
                            <TouchableOpacity className='w-full justify-end items-end mt-2' 
                                onPress={() => setIsEditable(true)}
                            >
                                <Image 
                                source={icons.edit2 as ImageSourcePropType}
                                className='w-5 h-5'
                                resizeMode='cover'
                                />

                            </TouchableOpacity>
                        ) 
                        :
                        (
                            <>
                                <PressableText title="save" onPressHandler={()=>submitChanges("story",storyText)}/>
                            </>
                        )  
                    )}

                    <LecturePage  
                        modalVisible={storyModalVisible} 
                        setModalVisible={setStoryModalVisible}
                        title='Story'
                        text={story?.story}
                    />

                   
                </View>

                
                {/* characters */}
                {Object.keys(characters).length !== 0  ? (
                    <View className='w-full'>
                    
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Characters' icon={icons.character as ImageSourcePropType}/>
                        <View className='space-y-2'>

                            {Object.entries(characters)?.map((item: any, index: number) =>(
                                <ObjectContainer 
                                key={index} 
                                index={index} 
                                item={item} 
                                title="Character" 
                                storyId={id}
                                type="characters"
                                setDeleting={setDeleting}
                                refetch = {refetch}
                                ownerId={owner?.id}
                                userId={user?.id}
                                setUpdating={setUpdating}
                                />
                            ) )}

                        </View>
                        {owner?.id === user?.id && <PressableText title='add new Character' onPressHandler={()=>setCharacterUploadModalVisible(!characterUploadModalVisible)}/>}
                        <CreateObject 
                            title="Upload your character"
                            modalVisible={characterUploadModalVisible}
                            setModalVisible={setCharacterUploadModalVisible}
                            type="Character"
                            id={id}
                            refetch={refetch}
                         />
                    
                    </View>):
                (
                    <View className='w-full h-[150px] '>
                    
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Characters' icon={icons.character as ImageSourcePropType}/>
                        <Text className='text-center text-third font-pregular text-mg'>
                            No characters available
                        </Text>
                        {owner?.id === user?.id && <PressableText title='add new Character' onPressHandler={()=>setCharacterUploadModalVisible(!characterUploadModalVisible)}/>}
                        <CreateObject 
                            title="Upload your character"
                            modalVisible={characterUploadModalVisible}
                            setModalVisible={setCharacterUploadModalVisible}
                            type="Character"
                            id={id}
                            refetch={refetch}
                         />

                    </View>
                )}

                
                {/* areas */}
                {Object.keys(areas).length !== 0  ? (
                    <View className='w-full'>
               
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Areas' icon={icons.area as ImageSourcePropType}/>
                        <View className='space-y-2'>

                            {Object.entries(areas)?.map((item: any, index: number) =>(
                                <ObjectContainer 
                                key={index} 
                                index={index} 
                                item={item} 
                                title="Area" 
                                storyId={id} 
                                type="areas"
                                setDeleting={setDeleting}
                                refetch = {refetch}
                                ownerId={owner?.id}
                                userId={user?.id}
                                setUpdating={setUpdating}
                                />
                            ) )}

                        </View>

                        { owner?.id === user?.id && <PressableText title='add new Area' onPressHandler={()=>setAreaUploadModalVisible(!areaUploadModalVisible)}/>}
                        <CreateObject 
                            title="Upload your area"
                            modalVisible={areaUploadModalVisible}
                            setModalVisible={setAreaUploadModalVisible}
                            type="Area"
                            id={id}
                            refetch={refetch}
                         />
                        
                    </View>
                ) :

                (
                    <View className='w-full h-[150px] '>
                    
                        <View className=' bg-third w-full h-0.5 mt-8' />
                        <Titles title='Game Areas' icon={icons.area as ImageSourcePropType}/>
                        <Text className='text-center text-third font-pregular text-mg'>
                            No area available
                        </Text>
                        { owner?.id === user?.id && <PressableText title='add new Area' onPressHandler={()=>setAreaUploadModalVisible(!areaUploadModalVisible)}/>}
                        <CreateObject 
                            title="Upload your area"
                            modalVisible={areaUploadModalVisible}
                            setModalVisible={setAreaUploadModalVisible}
                            type="Area"
                            id={id}
                            refetch={refetch}
                         />

                    </View>
                )}

                
            </View>
        </ScrollView>

            {(deleting || isAddingToFavorite || updating ) && 
                <View className='absolute h-[150vh] w-full justify-center items-center'>
                    <View className='h-[150vh] w-full bg-primary opacity-50'>
                        {/* This view is just for the overlay */}
                    </View>
                    <View className='bg-third p-10   bottom-[65%] rounded-lg justify-center items-cente z-10'>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </View>
                }
      </SafeAreaView>
    </View>
  )
}

export default Story;