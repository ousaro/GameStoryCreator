import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'


import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import useSupaBase from '@/lib/useSupaBase'
import StoryCard from '@/components/StoryCard'
import { searchPosts } from '@/lib/supabase'

const Search = () => {

  const {query} = useLocalSearchParams<{query:string}>();

  const {data: searchResults , refetch} = useSupaBase(()=> searchPosts(query || "") )
 
  useEffect(()=>{
    refetch() 
  }, [query])

  return (
    <View>
      <SafeAreaView className='bg-primary h-full'>
        <FlatList
          data={searchResults}
          keyExtractor={(item)=> item.id.toString()}
          renderItem= {({item})=>(
              <StoryCard  story={item} />
          )}

          ListHeaderComponent={() =>(
            <View className='my-6 px-4 space-y-4'>
              <View className='justify-between items-start flex-row mb-6'>
                <View className="w-full">
                    <Text className='font-pmedium text-sm text-third'>Search results</Text>
                    <Text className='text-2xl font-pbold text-third'>{query}</Text>

                    <View className="mt-6 w-full">
                      <SearchInput 
                      value={query}
                      placeholder='Search for a game story'
                    />
                </View>

                </View> 


               
              </View>

             

             
            </View>
          )}  

          ListEmptyComponent={() =>(
            <EmptyState 
              title = "No post match this query"
              subtitle = "No Posts Found"
              buttonTitle = "Back To Explore"
            />
          )}

        >

        </FlatList>
      </SafeAreaView>
    </View>
  )
}

export default Search