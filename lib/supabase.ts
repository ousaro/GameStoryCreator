import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native';
import { Database } from '@/types/database.types';
import * as FileSystem from 'expo-file-system';
import { decode as base64Decode } from 'base64-arraybuffer'; // Import the package for decoding
import uuid from 'react-native-uuid';




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

export const getPostById = async (id:string)  =>{

  try{
   
    const {data, error} = await supabase
        .from("stories")
        .select('*')
        .eq("id", id)
        .single()


    if(error){
      throw new Error(error.message)
    }

    return data;

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

export const uploadFile = async (file:any, storageName:string) =>{
   try{

      const fileExt = file.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';

      const path = `${Date.now()}.${fileExt}`;
     
      const fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 });

     
       // Decode the Base64 content to ArrayBuffer
    const decodedFileContent = base64Decode(fileContent);

   
      const { data, error: uploadError } = await supabase.storage
        .from(storageName)
        .upload(path,decodedFileContent, {
          contentType: file.mimeType,
          cacheControl: "3600",
          upsert: false
        })

    if(uploadError){
      throw uploadError
    }

   // Construct the URL
    const fileUrl = `${supabaseUrl}/storage/v1/object/public/${storageName}/${data.path}`;

    return fileUrl;
    

  }
  catch (error: any){
  
    throw new Error(error.message)
  }
}

export const createPost = async (form:any)  =>{

  try{
    const thumbnailUri = await uploadFile(form.thumbnail,"story_ressources")

   
    const {data : newPost, error} = await supabase
        .from("stories")
        .insert([
          {
            title: form.title,
            story: form.story,
            thumbnail: thumbnailUri,
            ownerid: form.ownerid,
            ownerdata:form.ownerdata
          }
        ])
        


    if(error){
      throw new Error(error.message)
    }

    return newPost;

   }
   catch (error: any){
       throw new Error(error.message)
   }

}

export const updatePost_CreateCharacter_Area = async(id:string, form:any, type:string) =>{
    try{
      const imageUri = await uploadFile(form.image,"story_ressources")

       
      const uuidv4 = uuid.v4();
      const uniqueId = uuidv4.toString();

      const {data : newPost, error} = await supabase
          .from("stories")
          .update({
            [type]:{

               [uniqueId]: {
                description: form.description,
                image: imageUri
              }
            }
          })
          .eq('id',id)
          


      if(error){
        throw new Error(error.message)
      }

      return newPost;

    }
    catch (error: any){
        throw new Error(error.message)
    }
}

export const deleteFileFromStorage = async (filePaths:string[], storageName:string) =>{

  try{
    // Step 2: Delete the file from Supabase storage
    const { error: deleteFileError } = await supabase
    .storage
    .from(storageName)
    .remove(filePaths);

    if (deleteFileError) {
      throw new Error(`Error deleting file: ${deleteFileError.message}`);
    }
  }catch(error : any){
    throw new Error(error.message);
  }
    
}


export const getFilesPathsPost = async(id:string, storageName:string) =>{

  const data = await getPostById(id)

  // Construct the URL
  const fileUrl = data.thumbnail;

  const filePaths = [fileUrl];

  const areas : any = data.areas
  const characters : any = data.characters
  
  if(data){
    for(const ele in characters){
      const fileUrl = characters[ele].image;
      filePaths.push(fileUrl)
    }

    for(const ele in areas){
      const fileUrl = areas[ele].image;
      filePaths.push(fileUrl)
    }
   
  }

  return filePaths;

}

export const deletePost = async(id:string) => {

  try {

      // Step 1: Get the file paths associated with the post
      const filePaths : any[] = await getFilesPathsPost(id,"story_ressources");

      // Step 2: Delete each file from Supabase storage
      await deleteFileFromStorage(filePaths, 'story_ressources'); // Replace 'your-storage-name' with the actual storage name
   
    // // Step 3: Delete the row from the database
    const { error: deleteRowError } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (deleteRowError) {
      throw new Error(`Error deleting row: ${deleteRowError.message}`);
    }

    return { message: 'Row and associated file deleted successfully.' };

  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
}
