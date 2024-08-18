import { View, Text, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StoryCard from '@/components/StoryCard'
import EmptyState from '@/components/EmptyState'
import { getUserFavoritePosts } from '@/lib/supabase'
import { useAuthContext } from '@/context/AuthContext'
import PressableText from '@/components/pressableText'


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

  useEffect(()=>{
    
    fethFavorites()
  },[])
  
  const [refreshing, setRefreshing] = useState(false)

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
                <StoryCard  story={item} textButton={true}/>
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

      </SafeAreaView>
    </View>
  )
}

export default BookMark