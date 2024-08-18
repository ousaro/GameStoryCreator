import { View, Text, ScrollView, Image, ImageSourcePropType, AppState, Alert, ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router';
import { images } from "@/constants";
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { RefreshSession, SignUpWithEmail } from '@/lib/supabase';
import { useAuthContext } from '@/context/AuthContext';



RefreshSession();


const SignUp = () => {
  const [form , setForm] = useState({
    username:"",
    email:"",
    password: ""
  })

  const [isSubmitting, setisSubmitting] = useState(false)
  const {setIsLoggedIn, setUser} = useAuthContext() 

  const Submit = async () => {

    if(!form.email || !form.password || !form.username){
      Alert.alert("Error", "Please fill in all the fields")
      return;
    }
    
    setisSubmitting(true);
    try {
     
      const result = await SignUpWithEmail(form.email.trim(), form.password, form.username);
      const user  = {
        id: result?.user?.id || "",
        username: result?.user?.user_metadata?.username || "",
        email: result?.user?.email || ""
      }
      setUser(user)
      setIsLoggedIn(true)


      router.replace("/home")
      
    } catch (e: any) {
      Alert.alert("Error", e.message);
     
    } finally {
      setisSubmitting(false);
    }
   
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className="w-full min-h-[83px] justify-center  px-4 my-14">
            <Image 
              source={images.logo as ImageSourcePropType}
              className="w-[190px] h-[120px] self-center"
              resizeMode="contain"
            />

            <Text className="text-3xl text-third font-pbold mt-5">
               Sign Up
            </Text>

            <FormField 
              title="Username"
              value={form.username}
              handleChageText={(e)=> setForm({...form, username:e})}
              otherStyle="mt-7"
              placeholder="username"
            
            />

            <FormField 
              title="Email"
              value={form.email}
              handleChageText={(e)=> setForm({...form, email:e})}
              otherStyle="mt-7"
              placeholder="test@gmail.com"
              keyboardType="email-address"
            
            />

            <FormField 
              title="Password"
              value={form.password}
              handleChageText={(e)=> setForm({...form, password:e})}
              otherStyle="mt-7"
            />

            <CustomButton 
              title='Sign Up'
              handlePress={Submit}
              containerStyles='mt-7'
              isLoading={isSubmitting}

            />

            <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-mg text-third font-psemibold'>
                Already have an account?
              </Text>
              <Text className='text-mg text-secondary font-psemibold'>
                <Link href="/signIn">Log In</Link>
              </Text>

            </View>

        </View>
      </ScrollView>

      {isSubmitting && 
        <View className='absolute h-full w-full justify-center items-center'>
          <View className='h-full w-full bg-primary opacity-50'>
              {/* This view is just for the overlay */}
          </View>
          <View className='bg-third p-10   bottom-[45%] rounded-lg justify-center items-cente z-10'>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
        }
    </SafeAreaView>
  )
}

export default SignUp