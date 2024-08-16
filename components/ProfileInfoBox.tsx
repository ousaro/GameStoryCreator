import {Text, View } from 'react-native'
import React from 'react'
import {ProfileInfoBoxProps} from "@/types/GlobalTypes"



const ProfileInfoBox = ({title, subtitle, containerStyles, titleStyles} : ProfileInfoBoxProps)  => {


  return (
    <View className={containerStyles}>

      <Text className={`text-third text-center font-psemibold ${titleStyles}`}>{title}</Text>
      <Text className={`text-third text-sm text-center font-pregular`}>{subtitle}</Text>
        
        
    </View>
  )
}

export default ProfileInfoBox;