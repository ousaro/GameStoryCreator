
import React from 'react'
import {Redirect, Stack} from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuthContext } from "@/context/AuthContext";




const AuthLayout = () => {

  const {isLoading, isLoggedIn} = useAuthContext()


  // if user is logged in, redirect to home page
  if(!isLoading && isLoggedIn) return <Redirect href="/home" />
  return (
    <> 
      
      <Stack>
        <Stack.Screen 
          name="signIn"
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="signUp" 
          options={{headerShown: false}}
          />
      </Stack>


      <StatusBar backgroundColor="#161622" style="light" />
    </>
  )
}

export default AuthLayout