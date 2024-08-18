import { Text, View, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { EmptyStateProps } from '@/types/GlobalTypes'
import { Href, router } from 'expo-router'

import { images } from '@/constants'
import CustomButton from './CustomButton'

const EmptyState = ({title, subtitle, buttonTitle, route} : EmptyStateProps) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image  
        source={images.empty as ImageSourcePropType} 
        className='w-[300px] h-[230px]' 
        resizeMode='contain'/>

      <Text  className='font-pmedium text-sm text-third'>{title}</Text>
      <Text  className='text-third text-lg font-pbold'>{subtitle}</Text>

      <CustomButton 

        title={`${buttonTitle}`} 
        handlePress={()=> router.push(`${route}` as Href)}
        containerStyles='w-full mt-7 mb-5'
        
      />

    </View>
  )
}
export default EmptyState;