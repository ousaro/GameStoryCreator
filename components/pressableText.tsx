import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const pressableText = ({title, onPressHandler, otherStyles}:{title:string, onPressHandler:any, otherStyles?:string}) => {
  return (
    <TouchableOpacity 
    className={`justify-center items-end pt-1.5 ${otherStyles}`}
    onPress={onPressHandler}>
        <Text className='text-secondary text-psemibol'>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default pressableText

const styles = StyleSheet.create({})