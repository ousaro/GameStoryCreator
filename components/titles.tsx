import { StyleSheet, Text, View,ImageSourcePropType, Image } from 'react-native'
import React from 'react'

const titles = ({title, icon}: {title:string, icon: ImageSourcePropType}) => {
  return (
    <View className='flex-row  items-start space-x-2  mt-4 mb-4'>

        <Image 
            source={icon}
            className='w-10 h-10 rounded-lg'
            resizeMode='contain'

        />

        <Text className='text-third text-lg font-psemibold mt-1'>
             {title}
        </Text>

    </View>
  )
}

export default titles

const styles = StyleSheet.create({})