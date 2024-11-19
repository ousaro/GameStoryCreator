import { View, Text, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StoryCard from '@/components/StoryCard'
import EmptyState from '@/components/EmptyState'
import { getUserFavoritePosts } from '@/lib/supabase'
import { useAuthContext } from '@/context/AuthContext'
import { useFocusEffect } from 'expo-router'


const BookMark = () => {


  const {user}= useAuthContext()
  const [favoritePosts, setFavoritePosts] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const fethFavorites = async () => {
    try{
      setIsLoading(true)
      const data = await getUserFavoritePosts(user?.id)
      setFavoritePosts(data)

    }catch(error: any){
      Alert.alert("Error", error.message)
    }finally{
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fethFavorites()
    }, [])
  )

  
  const [refreshing, setRefreshing] = useState(false)
  const [removeFromFavorite, setRemoveFromFavorite] = useState(false)

  const onRefresh = async ()=>{
    //console.log(savedPosts)
    setRefreshing(true)
    await fethFavorites()
    setRefreshing(false)
  }


  return (
    <View>
      <SafeAreaView className='bg-primary h-full'>
          <FlatList
            data={favoritePosts}
            keyExtractor={(item)=> item.id.toString()}
            renderItem= {({item})=>( 
                <StoryCard  story={item} textButton={true} setIsDeleting={setRemoveFromFavorite} refetching={fethFavorites}/>
            )}

            ListHeaderComponent={() =>(
              <View className='my-6 px-4 space-y-4'>
                <View className='justify-between items-start flex-row mb-6'>
                  <View className="w-full mt-8">
                      <Text className='font-pmedium text-sm text-third'>Saved Posts</Text>
                      <Text className='text-2xl font-pbold text-third'>Your favirote Stories</Text>

                      
                  </View>   
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
                title = "You have no favorite posts"
                subtitle = "No Posts Found"
                buttonTitle = "Back To Explore"
                route='/home'
              />
              )
            
            }

            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}

          >

          </FlatList>


          {(removeFromFavorite) && 
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

export default BookMark