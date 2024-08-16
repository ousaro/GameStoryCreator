import { View, Text, FlatList , RefreshControl, TouchableOpacity, Image , ImageSourcePropType} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getUserPosts, SignOut } from '@/lib/supabase'
import { useAuthContext } from "@/context/AuthContext";
import {router} from "expo-router"

import {icons} from "@/constants"

import EmptyState from '@/components/EmptyState'
import useSupaBase from '@/lib/useSupaBase'
import StoryCard from '@/components/StoryCard'
import ProfileInfoBox from "@/components/ProfileInfoBox"

const Profile = () => {

  const {user, setUser, setIsLoggedIn} = useAuthContext()

  const {data: userPosts , refetch, isLoading} = useSupaBase(()=>getUserPosts(user.id))

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async ()=>{
    setRefreshing(true)
    await refetch()
    setRefreshing(false)

  }

  const logOut = async () => {
    await SignOut();
    setUser(null)
    setIsLoggedIn(false)

    router.replace("/signIn")

  }

  return (
    <View>
      <SafeAreaView className='bg-primary h-full'>
        {!isLoading ? (
            <FlatList
            data={userPosts}
            keyExtractor={(item)=> item.id.toString()}
            renderItem= {({item})=>(
                <StoryCard  story={item} />
            )}

            ListHeaderComponent={() =>(
              <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
                
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

                <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">

                  <Image
                    source={{uri: user?.avatar_url}}
                    className="w-[90%] h-[90%] rounded-lg"
                    resizeMode="cover"
                  />

                </View>

                <ProfileInfoBox 
                  title={user?.username}
                  containerStyles="mt-5"
                  titleStyles="text-lg"
                />

                <View className="mt-1 flex-row">

                    <ProfileInfoBox 
                      title={userPosts.length.toString() || "0"}
                      subtitle="Posts"
                      containerStyles="mt-1"
                      titleStyles="text-xl"
                    />


                </View>
    
              </View>
            )}  

            ListEmptyComponent={() =>(
              <EmptyState 
                title = "Be the first one to create a story"
                subtitle = "No Posts Found for this profile"
                buttonTitle = 'Create Post'
              />
            )}

            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

          >

            </FlatList>
        ):(

          <View className="justify-center items-center h-full">
            <Text className="text-third text-2xl justify-center items-center">Loading...</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  )
}

export default Profile
