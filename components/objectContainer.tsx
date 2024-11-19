import {  Text, View,Image, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import LecturePage from './lecturePage'
import PressableText from './pressableText';
import { deletePost_CreateCharacter_Area, updatePost_Character_Area_desc } from '@/lib/supabase';

const objectContainer = ({item, index, title , storyId, type , setDeleting, refetch, ownerId, userId , setUpdating}: 
    {item:any, index:number, title:string, storyId:string , type:string, setDeleting:any, refetch:any, ownerId?:string, userId?:string, setUpdating:any}) => {


    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [description, setDescription] = useState(item[1]?.description)
    const [isEditable, setIsEditable] = useState(false);

    const handleDeleteItem = async () => {
        try{

            setDeleting(true)
            await deletePost_CreateCharacter_Area(storyId,item[0],type)
            refetch()
            setDeleting(false)

        }catch(error : any){
            Alert.alert("Error", error.message)
        }
    }

    const submitChanges = async (type:string, updates:string) => {

        try{
          
            setUpdating(true)
            await updatePost_Character_Area_desc(type, updates, storyId ,item[0])
            refetch()

        }catch(error : any){
            Alert.alert("Error", "Can't update")
        }finally{
            setUpdating(false)
            setIsEditable(false)
        }
       
        
    }


  return (
    
    <View key={index} className=' mb-1'>
        <View className='flex-row space-x-1'>
            <View className='w-[120px] h-[150px]  border  border-secondary '>
                    <Image 
                        source={{uri: item[1]?.image}}
                        className='w-full h-full'
                        resizeMode='contain'
                    />
            </View>

            <TouchableOpacity 
            className='w-2/3 h-[150px] bg-fourth p-4'
            onPress={() => setModalVisible(!modalVisible)}
            >
                <TextInput 
                    className='text-third font-pregular text-mg '
                    value={description}
                    onChangeText={(e)=>setDescription(e)}
                    multiline={true} // Make it multiline
                    scrollEnabled={true} // Enable scrolling
                    numberOfLines={5} // Initial number of lines
                    textAlignVertical="top" // Align text to the top
                    placeholderTextColor="#A6A6B4"
                    editable={isEditable} // Control editable state
                />
            </TouchableOpacity>

            <LecturePage  
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={title}
                text={item[1]?.description}
                imageUri={item[1]?.image}
                />
        </View>

        <View className='flex-row justify-end'>

            <View className='mr-3'>
                {ownerId === userId && 
                ( !isEditable ?  
                    (
                        <>
                            <PressableText title="edit" onPressHandler={()=>setIsEditable(true)}/>
                        </>
                    ) 
                    :
                    (
                        <>
                            <PressableText title="save" onPressHandler={()=>submitChanges(type,description)}/>
                        </>
                    )  
                )}


            </View>
            
            <View className='ml-3'>
                { ownerId === userId &&<PressableText title='delete' onPressHandler={handleDeleteItem}/>}
            </View>
            
        </View>

        
    </View>

  )
}

export default objectContainer