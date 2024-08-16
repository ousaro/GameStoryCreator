import React from "react";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View, ImageSourcePropType } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/context/AuthContext";
import { RefreshSession } from "@/lib/supabase";

import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";

RefreshSession()

export default function App() {

  const {isLoading, isLoggedIn} = useAuthContext()


  if(!isLoading && isLoggedIn) return <Redirect href="/home" />


  return (
    <SafeAreaView  className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height: "100%"}}>
        <View className="w-full min-h-[85vh] justify-center items-center px-4 my-auto">

            <Image 
              source={images.logo as ImageSourcePropType}
              className="w-[190px] h-[120px]"
              resizeMode="contain"
            />

            <Image 
              source={images.welcomeHero as ImageSourcePropType}
              className="max-w-[400px] w-full h-[350px]"
              resizeMode="contain"
            />

            <View className="relative mt-5">
              <Text className="text-3xl text-third font-bold text-center">
                Welcome to 
              </Text>

              <Text className="text-3xl text-secondary font-bold text-center">
                StoryGameCreator !
              </Text>
            </View>

            <Text className="text-third text-mg font-pregular text-center mt-4">
                Start creating your own game stories and characters.
            </Text>

            <CustomButton 
            title="Get Started"
            handlePress={() => { router.push("/signIn") } }
            containerStyles="w-full mt-7" 
            />

        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />


    </SafeAreaView >
  );
}