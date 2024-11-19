import { View, Text, FlatList , RefreshControl, TouchableOpacity, Image , ImageSourcePropType, ActivityIndicator, TurboModuleRegistry, Alert} from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserPosts, SignOut } from '@/lib/supabase'
import { useAuthContext } from "@/context/AuthContext";
import {router, useFocusEffect} from "expo-router"
import * as DocumentPicker from 'expo-document-picker';

import {icons} from "@/constants"

import EmptyState from '@/components/EmptyState'
import useSupaBase from '@/lib/useSupaBase'
import StoryCard from '@/components/StoryCard'
import ProfileInfoBox from "@/components/ProfileInfoBox"
import { Json } from '@/types/database.types';
import { updateUserAvatar } from '@/lib/supabase';

const Profile = () => {

  const {user, setUser, setIsLoggedIn, fetchUserProfile} = useAuthContext()

  const {data: userPosts , refetch, isLoading} = useSupaBase(()=>getUserPosts(user.id))

  const [refreshing, setRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [])
  )

  const onRefresh = async ()=>{
    setRefreshing(true)
    await refetch()
    setRefreshing(false)

  }

  const logOut = async () => {
    setisSubmitting(true)
    await SignOut();
    setUser(null)
    setIsLoggedIn(false)
    setisSubmitting(false)

    router.replace("/signIn")

  }


  const openPicker = async () =>{

    const result = await DocumentPicker.getDocumentAsync
    ({
        type: ["image/png", "image/jpg", "image/jpge", "image/gif"]
    })

    
    if(!result.canceled){
      Submit(result.assets[0])
    }
    
}

const [isUpdatingAvatar, setisUpdatingAvatar] = useState(false)

const Submit = async (file:any)=>{

  try{
    setisUpdatingAvatar(true)
    await updateUserAvatar(file, user.id)
    fetchUserProfile()

  }catch(error: any){
    Alert.alert("Error", error.message)
  }finally{
    setisUpdatingAvatar(false)
  }

}


  return (
    <View>
      <SafeAreaView className='bg-primary h-full'>         
            <FlatList
              data={userPosts}
              keyExtractor={(item)=> item.id.toString()}
              renderItem= {({ item }) => (
                <StoryCard story={item} canDelete={true} setIsDeleting={setIsDeleting}  refetch={refreshing}/>
              )}

              ListHeaderComponent={() =>(
                <View className='w-full justify-center items-center mt-6 mb-8 px-4 '>
                  
                  <TouchableOpacity 
                  className="w-full items-end mb-10"
                  onPress={logOut}
                  >

                    <Image
                      source = {icons.logout as ImageSourcePropType}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />

                  </TouchableOpacity>

                  <View className="w-32 h-32 border border-secondary rounded-lg justify-center items-center">

                    <Image
                      source={{uri: user?.avatar_url}}
                      className="w-[90%] h-[90%] rounded-lg"
                      resizeMode="cover"
                    />

                    <TouchableOpacity 
                    className='absolute  -bottom-2 -right-2'
                    onPress={openPicker}
                    >

                          <Image
                            source={icons.edit as ImageSourcePropType}
                            className='w-5 h-5' 
                          />
                    </TouchableOpacity>
                   
                  </View>

                  <ProfileInfoBox 
                    title={user?.username}
                    containerStyles="mt-5"
                    titleStyles="text-lg"
                  />

                  <View className=" flex-row mb-3">

                      <ProfileInfoBox 
                        title={userPosts?.length.toString() || "0"}
                        subtitle="Posts"
                        containerStyles="mt-1"
                        titleStyles="text-xl"
                      />


                  </View>

      
                </View>
              )}  

              ListEmptyComponent={
                isLoading ? (
                  <View className="h-20 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                ) : (
                  <EmptyState 
                  title = " Create your own stories"
                  subtitle = "No Posts Found for this profile"
                  buttonTitle = 'Create Post'
                  route="/create"
                />
                )
               }

              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

            >

            </FlatList>


            {(isDeleting || isSubmitting || isUpdatingAvatar) && 
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

export default Profile
