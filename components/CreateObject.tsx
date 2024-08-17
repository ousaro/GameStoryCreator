import { Modal, Text, View, Image, ScrollView, TextInput, TouchableOpacity, ImageSourcePropType, Alert } from 'react-native'
import React, { useState } from 'react'
import PressableText from './pressableText';
import { icons } from '@/constants';
import CustomButton from './CustomButton';
import * as ImagePicker from "expo-image-picker"
import {updatePost_CreateCharacter_Area} from "@/lib/supabase"

const CreateObject =  ({ title ,modalVisible , setModalVisible, type, id}: {title:string, modalVisible: boolean, setModalVisible: any, type:string, id:string}) => {
   
    const [form , setForm] = useState({
        description: "",
        image: {
          uri:""
        }

      })


      const openPicker = async () =>{

        const result = await ImagePicker
        .launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [4,3],
          quality:1
        })
  
        if(!result.canceled){
          setForm({...form, image: result.assets[0]})         
        }
        
  
       
  
    }

    const Submit = async () =>{

        if(!form.description || !form.image){
          return Alert.alert("Missing Info", "Please fill in all the fields")
        }
        
        setisSubmitting(true)
  
        try {
            if(type==="Character"){
                await updatePost_CreateCharacter_Area(id,form,"characters")
            }else{
                await updatePost_CreateCharacter_Area(id,form,"areas")
            }
          
          console.log(form)
          setisSubmitting(false)
          setModalVisible(false)
        } catch (error: any) {
          setisSubmitting(false)
          Alert.alert("Error", error.message)
        }finally{
            setForm({
                description: "",
                image: {
                  uri:""
                }
        
              })
        }
  
      }
  
    const [isSubmitting, setisSubmitting] = useState(false)
    
   
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                
                visible={modalVisible}
                onRequestClose={() => {
                setModalVisible(!modalVisible);
                }}
                >
                <ScrollView className="pt-10 px-4 bg-primary h-full">

                        <PressableText title='close' 
                            onPressHandler={() => setModalVisible(!modalVisible)}
                            otherStyles='mb-4'
                            />

                        <Text className="text-2xl text-third font-pbold mt-5">
                            {title}
                        </Text>



                        <Text className="text-base text-third font-pmedium mt-7 mb-3">
                            {type} Image
                        </Text>

                        <TouchableOpacity onPress={()=> openPicker()}>
                            
                        {form.image.uri ? (
                            <Image 
                            source={{uri: form.image.uri}}
                            className="h-64 w-full rounded-center"
                            resizeMode="cover"
                        />

                        ): (
                            <View className="flex-row border-2 border-black-200 w-full h-16 px-4 py-2 bg-fourth rounded-2xl justify-center items-center space-x-4">
                            <Image 
                                source={icons.upload as ImageSourcePropType}
                                className="h-6 w-6"
                                resizeMode="contain"
                                />

                            <Text className='text-third font-pregular text-sm'>Choose a file</Text>
                        </View>
                
                        )}

                        </TouchableOpacity>




                        <Text className="text-base text-third font-pmedium mt-7 mb-3">
                            Write Your {type} Description
                        </Text>

                        <View className="flex-row border-2 border-black-200 w-full h-48 px-4 py-2 bg-fourth rounded-2xl justify-center items-center space-x-4">
                            <TextInput 
                                className={`flex-1 w-full self-center text-third font-psemibold text-base px-1 py-2 ${
                                form.description === '' ? 'text-transparent' : '' }`}
                                value={form.description}
                                placeholderTextColor="#A6A6B4"
                                onChangeText={(e)=> setForm({...form, description:e})}
                                multiline={true} // Make it multiline
                                scrollEnabled={true} // Enable scrolling
                                numberOfLines={4} // Initial number of lines
                                textAlignVertical="top" // Align text to the top
                                
                            />
                            {form.description === '' && (
                            <Text className="absolute top-1/2 left-18 text-base text-third-100 font-psemibold">
                                {type} Description...
                            </Text>
                        )}

                        </View>


                        <CustomButton 
                        title='Submit & Publish'
                        handlePress={Submit}
                        containerStyles='mt-7'
                        isLoading={isSubmitting}

                        />
                </ScrollView>
            </Modal>
        </View>
      )
}

export default CreateObject

