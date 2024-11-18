import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}: CustomButtonProps) => {
  return (
   <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-secondary rounded-xl min-h-[55px] justify-center items-center ${containerStyles}
    ${isLoading ? "opacity-50": ""}`}
    disabled = {isLoading} >

        <Text className={`text-third font-psemibold text-lg ${textStyles}`}>{title}</Text>

   </TouchableOpacity>
  )
}

export default CustomButton