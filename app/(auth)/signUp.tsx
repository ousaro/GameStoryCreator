import { View, Text, ScrollView, Image, ImageSourcePropType, AppState, Alert} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router';
import { images } from "@/constants";
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { supabase } from '@/lib/supabase';


// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})



const SignUp = () => {
  const [form , setForm] = useState({
    username:"",
    email:"",
    password: ""
  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const Submit = async () => {
    
    setisSubmitting(true);
    try {
      const { data: { session }, error } = await supabase.auth.signUp({
        email : form.email,
        password : form.password,
        options: {
          data: {
            username: form.username, // Store the username in user_metadata
          },
        },
      });
  
      if (error) {
        Alert.alert(error.message);
        
      } else if (!session) {
        Alert.alert('Please check your inbox for email verification!');
       
      }

      if(session){
        Alert.alert("registered")
      }
  
      
    } catch (e) {
      Alert.alert('An unexpected error occurred');
     
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
    </SafeAreaView>
  )
}

export default SignUp