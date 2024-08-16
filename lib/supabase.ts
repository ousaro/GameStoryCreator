import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native';
import { Database } from '@/types/database.types';
 

const supabaseUrl =  process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export const RefreshSession = () => {
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

}


export const SignUpWithEmail = async (email: string, password: string, username: string) => {
  try {
    const { data: { session }, error } = await supabase.auth.signUp({
      email : email,
      password : password,
      options: {
        data: {
          username: username, // Store the username in user_metadata
        },
      },
    });

    if (error) {
     throw new Error(error.message);
      
    } else if (!session) {
      throw new Error('Please check your inbox for email verification!');
    }

    return session;

  } catch (e) {
    throw new Error(e as string);
   
  } 
}


export const SignInWithEmail = async (email: string , password: string) => {
   
  try {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email : email,
      password : password,
    });

    if (error) {
      throw new Error(error.message)
    
    }

    return session;

    // Return the session object on success
  } catch (e: any) {
    throw new Error(e)
  
  } 
}

export const SignOut = async ()  =>{

  try{

    const {error} = await supabase.auth.signOut({ scope: 'local' })
       


    if(error){
      throw new Error(error.message)
    }

  }
  catch (error: any){
    throw new Error(error.message)
  }

}


async function getCurrentUserId(){
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }

  return user?.id || null;
}


export const getUserProfile = async () => {

  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("No user logged in")
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
   throw new Error(error.message);
  }

  return data;
}


export const getAllPosts = async ()  =>{

  try{

    const {data : stories, error} = await supabase
        .from("stories")
        .select('*')

    if(error){
      throw new Error(error.message)
    }

    return stories;

  }
  catch (error: any){
    throw new Error(error.message)
  }

}

export const searchPosts = async (query:string)  =>{

  try{

    const {data : searchResults, error} = await supabase
        .from("stories")
        .select('*')
        .ilike('title', `%${query}%`)


    if(error){
      throw new Error(error.message)
    }

    return searchResults;

  }
  catch (error: any){
    throw new Error(error.message)
  }

}

export const getUserPosts = async (id:string)  =>{

  try{
   
    const {data : userPosts, error} = await supabase
        .from("stories")
        .select('*')
        .eq("ownerid", id)


    if(error){
      throw new Error(error.message)
    }

    return userPosts;

  }
  catch (error: any){
    throw new Error(error.message)
  }

}

