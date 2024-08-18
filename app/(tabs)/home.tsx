import { View, Text, FlatList , Image, ImageSourcePropType, RefreshControl, ActivityIndicator} from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAllPosts } from '@/lib/supabase'
import { useAuthContext } from "@/context/AuthContext";
import { useFocusEffect } from '@react-navigation/native'

import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { images } from '@/constants'
import useSupaBase from '@/lib/useSupaBase'
import StoryCard from '@/components/StoryCard'


const Home = () => {


  const {user, fetchUserProfile} = useAuthContext()

  const {data: stories , refetch, isLoading} = useSupaBase(getAllPosts)

  const [refreshing, setRefreshing] = useState(false)


  useFocusEffect(
    useCallback(() => {
      refetch()
      fetchUserProfile()
    }, [])
  )

  const onRefresh = async ()=>{
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <View>
      <SafeAreaView className='bg-primary h-full'>
        <FlatList
          data={stories}
          keyExtractor={(item)=> item.id.toString()}
          renderItem= {({ item }) => (
                <StoryCard story={item} canDelete={false} refetch={refreshing}/>
              )}

          ListHeaderComponent={() =>(
            <View className='my-6 px-4 space-y-4'>
              <View className='justify-between items-start flex-row mb-6'>
                <View>
                    <Text className='font-pmedium text-sm text-third'>Welcome Back,</Text>
                    <Text className='text-2xl font-pbold text-third'>{user?.username}</Text>
                </View>
                <View>
                    <Image 
                      source={images.logoWithoutText as ImageSourcePropType}
                      className=''
                      resizeMode='contain'
                    />
                </View>
              </View>

              <SearchInput 
                value=""
                placeholder='Search for a game story'
              />

             
            </View>
          )}  

          ListEmptyComponent={
            
            isLoading ? (
              <View className="h-20 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <EmptyState 
              title = "Be the first one to create a story"
              subtitle = "No Posts Found"
              buttonTitle = 'Create Post'
              route='/create'
            />
            )
           
          }

          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

        >

        </FlatList>

      </SafeAreaView>
    </View>
  )
}

export default Home