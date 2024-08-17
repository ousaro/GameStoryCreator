import { Modal, Text, View, Image, ScrollView } from 'react-native'
import React from 'react'
import PressableText from './pressableText';

const lecturePage = ({ title ,modalVisible , setModalVisible, imageUri , text}: {title:string, modalVisible: boolean, setModalVisible: any,text:string, imageUri?:string}) => {
  return (
    <View>
        <Modal
            animationType="slide"
            transparent={false}
            
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
            }}
            >
            <ScrollView className='bg-primary h-full p-4 w-full'>
                <View  className=' h-full p-2 w-full'>

                    <View className='w-full mb-4 pb-4'>
                        <PressableText title='close' 
                        onPressHandler={() => setModalVisible(!modalVisible)}
                        otherStyles='mb-4'
                        />

                        <Text className='text-third text-3xl font-pbold '>{title}</Text>
                        <View className=' bg-third w-2- h-2 ' />
                    </View>

                    {title === "Story" ?
                     (<></>)
                     :
                    (
                        <View className='  justify-center items-center mb-4 '>
                            <View className='w-[200px] h-[200px] border border-secondary  rounded-xl '>
                                <Image
                                    source={{uri:imageUri}}
                                    className='w-full h-full'
                                    resizeMode='contain'
                                />
                            </View>
                        </View>
                    )}

                    <View className='mt-4'>
                        <Text className='text-third text-sm font-pregular'>{text}</Text>
                    </View>

                </View>
            </ScrollView>
        </Modal>
    </View>
  )
}

export default lecturePage
