import { View, Text, ScrollView, Image, TouchableOpacity, ImageSourcePropType, TextInput,Alert, ActivityIndicator } from'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { useAuthContext } from '@/context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';

import {icons} from "@/constants"
import { createPost } from '@/lib/supabase';


const Create = () => {

  const {user} = useAuthContext()

  const [form , setForm] = useState({
    title:"",
    story: "",
    thumbnail: {
      uri:""
    },
    ownerid : user?.id
  })


  const openPicker = async () =>{

      const result = await DocumentPicker.getDocumentAsync
        ({
          type: ["image/png", "image/jpg", "image/jpge", "image/gif"]
        })

      if(!result.canceled){
        setForm({...form, thumbnail: result.assets[0]})     
      }

  }

  const [isSubmitting, setisSubmitting] = useState(false)
   

  const Submit = async () =>{

    if(!form.title || !form.story || !form.thumbnail  || !form.ownerid){
      return Alert.alert("Missing Info", "Please fill in all the fields")
    }
    
    setisSubmitting(true)

    try{
     

      await createPost(form);


      Alert.alert("Success", "Post updloaded successfully")
      router.push("/home")

    }catch (error: any){
       Alert.alert("Error", error.message)
    }
    finally{
      setForm({
        title:"",
        story: "",
        thumbnail:  {
          uri:""
        },
        ownerid : user?.id
      })

      setisSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className="px-4 my-6">
            <Text className="text-2xl text-third font-pbold mt-5">
               Create Your Game Story
            </Text>

            <FormField 
              title="Game Title"
              value={form.title}
              handleChageText={(e)=> setForm({...form, title:e})}
              otherStyle="mt-7"
              placeholder="Give your Game a catchy title..."
            
            />

            <Text className="text-base text-third font-pmedium mt-7 mb-3">
                Write Your Game Story
            </Text>

            <View className="flex-row border-2 border-black-200 w-full h-48 px-4 py-2 bg-fourth rounded-2xl justify-center items-center space-x-4">
                <TextInput 
                     className={`flex-1 w-full self-center text-third font-psemibold text-base px-1 py-2 ${
                      form.story === '' ? 'text-transparent' : '' }`}
                    value={form.story}
                    placeholderTextColor="#A6A6B4"
                    onChangeText={(e)=> setForm({...form, story:e})}
                    multiline={true} // Make it multiline
                    scrollEnabled={true} // Enable scrolling
                    numberOfLines={4} // Initial number of lines
                    textAlignVertical="top" // Align text to the top
                    
                />
                {form.story === '' && (
                <Text className="absolute top-1/2 left-16 text-base text-third-100 font-psemibold">
                    Share your game story
                </Text>
            )}

              </View>


            <Text className="text-base text-third font-pmedium mt-7 mb-3">
                Thumbnail Image
            </Text>

            <TouchableOpacity onPress={()=> openPicker()}>
                 
              {form.thumbnail.uri ? (
                <Image 
                  source={{uri: form.thumbnail.uri}}
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

            <CustomButton 
              title='Submit & Publish'
              handlePress={Submit}
              containerStyles='mt-7'
              isLoading={isSubmitting}

            />
      </ScrollView>


      {isSubmitting && 
              <View className='absolute h-full w-full justify-center items-center'>
                <View className='h-full w-full bg-primary opacity-50'>
                    {/* This view is just for the overlay */}
                </View>
                <View className='bg-third p-10   bottom-1/3 rounded-lg justify-center items-cente z-10'>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
              </View>
            }
    </SafeAreaView>
  )
}

export default Create