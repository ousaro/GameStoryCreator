import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Json } from '@/types/database.types'
import LecturePage from './lecturePage'

const objectsList = ({objects, title}:{objects:Json[], title:string}) => {


    const [modalVisible, setModalVisible] = useState<boolean[]>(Array(objects.length).fill(false));

    const handleModalToggle = (index: number) => {
      const updatedModalVisible = [...modalVisible];
      updatedModalVisible[index] = !updatedModalVisible[index];
      setModalVisible(updatedModalVisible);
    };
  

  return (
    
    <View className='space-y-1 w-full '>
                       

        {Object.entries(objects)?.map((item: any, index: number) =>(
            <View key={index} className='flex-row space-x-1'>
                <View className='w-[120px] h-[150px]  border  border-secondary '>
                    <Image 
                        source={{uri: item[1]?.image}}
                        className='w-full h-full'
                        resizeMode='contain'
                    />
                </View>

                <TouchableOpacity 
                className='w-2/3 h-[150px] bg-fourth p-4'
                onPress={() => handleModalToggle(index)}
                >
                    <Text 
                    className='text-third font-pregular text-mg'
                    numberOfLines={5} 
                    ellipsizeMode='tail'  >
                        {item[1]?.description}
                    </Text>
                </TouchableOpacity>

                <LecturePage  
                    modalVisible={modalVisible[index]}
                    setModalVisible={() => handleModalToggle(index)}
                    title={title}
                    text={item[1]?.description}
                    imageUri={item[1]?.image}
                    />
            </View>
        ))}

       

   
    </View>

  )
}

export default objectsList