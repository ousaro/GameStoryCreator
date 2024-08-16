import { View, Text, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

import { icons } from '../../constants'
import { Tabs } from 'expo-router'


const TabIcon = ({icon, color, name, focused}: {icon: any, color: any, name: any, focused: any}) => {
  return (
    <View className='items-center justify-center gap-[1px]'>
        <Image 
          source={icon}
          resizeMode='contain'
          tintColor={color}
          className='w-6 h-6'
        />
        <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-sm`} style={{color: color}}>
          {name}
        </Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
    <Tabs
       screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3D5AF1",
        tabBarInactiveTintColor : "#D9D9D9",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#3D5AF1",
          height: 60,
        },


        }}
     >

      <Tabs.Screen 
        name='home'
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
              <TabIcon 
                  icon={icons.home}
                  color={color}
                  name='Home'
                  focused={focused}
              />
          )
        }}
      />

      <Tabs.Screen 
          name='bookMark'
          options={{
            title: "BookMark",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon 
                    icon={icons.bookmark}
                    color={color}
                    name='BookMark'
                    focused={focused}
                />
            )
          }}
        />

      <Tabs.Screen 
          name='create'
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon 
                    icon={icons.add}
                    color={color}
                    name='Create'
                    focused={focused}
                />
            )
          }}
      />

      <Tabs.Screen 
          name='profile'
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon 
                    icon={icons.profile}
                    color={color}
                    name='Profile'
                    focused={focused}
                />
            )
          }}
      />


    </Tabs>



    <StatusBar backgroundColor="#161622" style="light" />
    </>
  )
}

export default TabsLayout