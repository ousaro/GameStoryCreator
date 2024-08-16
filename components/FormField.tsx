import { View, Text, TextInput, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React, { useState } from 'react'

import { FormFieldProps } from '@/types/GlobalTypes';
import { icons } from '@/constants';


const FormField = ({title, value, handleChageText, otherStyle, keyboardType,placeholder, ...props}: FormFieldProps) => {
    const [showPassword, setshowPassword] = useState(false)


  return (
    <View className={`space-y-2 ${otherStyle}` }>
        <Text className='text-base text-third font-pmedium'>{title}</Text>

        <View className='border-2 border-black-200 w-full h-16 px-4 bg-fourth rounded-xl focus:border-secondary items-center flex-row'>
            <TextInput 
                className='flex-1 w-full text-third font-psemibold text-base self-center'
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#A6A6B4"
                onChangeText={handleChageText}
                secureTextEntry={title === "Password" && !showPassword}
 
            />

            {title === "Password" && (
                <TouchableOpacity 
                    onPress={() => setshowPassword(!showPassword)}
                >
                    <Image
                        source={showPassword ? icons.eye as ImageSourcePropType : icons.eyeHide as ImageSourcePropType} 
                        className='w-6 h-6 opacity-60'
                        resizeMode='contain' 
                    />
                </TouchableOpacity>
            )}
        </View>

    </View>
  )
}

export default FormField