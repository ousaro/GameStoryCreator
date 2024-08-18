import { View, Text, TextInput, TouchableOpacity, Image, ImageSourcePropType, Alert } from 'react-native'
import React, { useState } from 'react'

import { SearchProps } from '@/types/GlobalTypes';
import { icons } from '@/constants';
import { router, usePathname } from 'expo-router';



const SearchInput = ({value, otherStyle, keyboardType,placeholder, ...props}: SearchProps) => {
    const pathName = usePathname()
    const [query, setQuery] = useState<string>(value || '');

  return (
    <View className='border-2 border-black-200 w-full h-12 px-4 bg-fourth rounded-xl focus:border-secondary items-center flex-row'>
        <TextInput 
            className='flex-1 w-full text-third font-psemibold text-base self-center'
            value={query}
            placeholder={placeholder}
            placeholderTextColor="#A6A6B4"
            autoCapitalize="none"
            onChangeText={(e) => setQuery(e)}
        />

        <TouchableOpacity 
            onPress={()=>{
                if(!query){
                    Alert.alert("Missing query", "Please input something to search results across database")
                    return;
                }

                if(pathName.startsWith("/search")){
                    router.setParams({query})
                }else{
                    router.push(`/search/${query}`)
                }
            }}
        >
            <Image
                source={icons.search as ImageSourcePropType} 
                className='w-6 h-6 opacity-60'
                resizeMode='contain' 
            />
        </TouchableOpacity>
    </View>
  )
}

export default SearchInput