import {  Text, View,Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import LecturePage from './lecturePage'
import PressableText from './pressableText';
import { deletePost_CreateCharacter_Area } from '@/lib/supabase';

const objectContainer = ({item, index, title , storyId, type , setDeleting, refetch}: {item:any, index:number, title:string, storyId:string , type:string, setDeleting:any, refetch:any}) => {


    const [modalVisible, setModalVisible] = useState<boolean>(false);

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
                <Text 
                className='text-third font-pregular text-mg'
                numberOfLines={5} 
                ellipsizeMode='tail'  >
                    {item[1]?.description}
                </Text>
            </TouchableOpacity>

            <LecturePage  
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={title}
                text={item[1]?.description}
                imageUri={item[1]?.image}
                />
        </View>

        <View>
            <PressableText title='delete' onPressHandler={handleDeleteItem}/>
        </View>

        
    </View>

  )
}

export default objectContainer