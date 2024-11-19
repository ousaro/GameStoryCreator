import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native';
import { Database, Json } from '@/types/database.types';
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

export const getUserById = async (id:string) => {
  
  if (!id) {
    throw new Error("Unvalid User")
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
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

export const getFilesPathsUser = async(storageName:string) =>{

  const data = await getUserProfile()

  // Construct the URL
  const fileUrl = data.avatar_url;
  const filePath = fileUrl?.split(`/public/${storageName}/`)[1]

  const filePaths = [filePath];

  return filePaths;

}

export const updateUserAvatar = async (file:Json, id:string) =>{
  try{
    
    const filePaths : any[] = await getFilesPathsUser("avatars");
    console.log(filePaths)
    await deleteFileFromStorage(filePaths, 'avatars');
  
    const imageUri = await uploadFile(file,"avatars", id)

    const {data : newUser, error} = await supabase
        .from("profiles")
        .update({
         avatar_url: imageUri
        })
        .eq('id',id)
        


    if(error){
      throw new Error(error.message)
    }

    return newUser;

  }
  catch (error: any){
      throw new Error(error.message)
  }
}

export const uploadFile = async (file:any, storageName:string, folder:string) =>{
   try{

      const uuidv4 = uuid.v4();
      const uniqueId = uuidv4.toString();

      const fileExt = file.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';

      const path = `${folder}/${uniqueId}.${fileExt}`;
     
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
    const thumbnailUri = await uploadFile(form.thumbnail,"story_ressources","thumbnails")

   
    const {data : newPost, error} = await supabase
        .from("stories")
        .insert([
          {
            title: form.title,
            story: form.story,
            thumbnail: thumbnailUri,
            ownerid: form.ownerid
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
      const imageUri = await uploadFile(form.image,"story_ressources", type)

       
      const uuidv4 = uuid.v4();
      const uniqueId = uuidv4.toString();

      // Construct the new entry
    const newEntry = {
      description: form.description,
      image: imageUri
    };

    // Fetch the current story to update
    const { data: currentStory, error: fetchError } = await supabase
      .from('stories')
      .select(type)
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Merge the new entry with the existing entries
    const updatedTypeField = {
      // @ts-ignore
      ...currentStory[type] ,
      [uniqueId]: newEntry
    };

    // Update the specified field in the stories table
    const { data: newPost, error: updateError } = await supabase
      .from('stories')
      .update({ [type]: updatedTypeField })
      .eq('id', id);

    // Handle potential errors
    if (updateError) {
      throw updateError;
    }

    return newPost;

    }
    catch (error: any){
        throw new Error(error.message)
    }
}


export const deletePost_CreateCharacter_Area = async(id:string, ele_id:string, type:string) =>{
  try{

     
  // Fetch the current story to update
  const { data: currentStory, error: fetchError } = await supabase
    .from('stories')
    .select(type)
    .eq('id', id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // @ts-ignore
  if (!currentStory[type]) {
    throw new Error(`Field '${type}' does not exist in the story`);
  }


  // remove from storage
  // @ts-ignore
  const uri = currentStory[type][ele_id].image.split("/story_ressources/")[1]

  await deleteFileFromStorage([uri], "story_ressources")

  // Remove the specified element from the existing entries
  // @ts-ignore
   // Remove the specified element from the existing entries
   const updatedTypeField = { ...currentStory[type] };
   delete updatedTypeField[ele_id];

   console.log(updatedTypeField)
   
  // Update the specified field in the stories table
  const { data: newPost, error: updateError } = await supabase
    .from('stories')
    .update({ [type]: updatedTypeField })
    .eq('id', id);

  // Handle potential errors
  if (updateError) {
    throw updateError;
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
  const filePath = fileUrl?.split(`/public/${storageName}/`)[1]

  const filePaths = [filePath];

  const areas : any = data.areas
  const characters : any = data.characters
  
  if(data){
    for(const ele in characters){
      const fileUrl = characters[ele].image;
      const filePath = fileUrl?.split(`/public/${storageName}/`)[1]
      filePaths.push(filePath)
    }

    for(const ele in areas){
      const fileUrl = areas[ele].image;
      const filePath = fileUrl?.split(`/public/${storageName}/`)[1]
      filePaths.push(filePath)
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


  } catch (error: any) {
    throw new Error(`Error: ${error.message}`);
  }
}

export const addToFavorite = async(ownerId:string , storyId:string) => {
  
  try{
   
    const {data , error} = await supabase
        .from("favorites")
        .insert([
          {
            ownerid: ownerId,
            storyid: storyId
          }
        ])
        


    if(error){
      throw new Error(error.message)
    }

    return data;

   }
   catch (error: any){
       throw new Error(error.message)
   }
}


export const getUserFavoriteId = async (userId:string) => {


  try{
   
    const {data , error} = await supabase
        .from("favorites")
        .select("*")
        .eq("ownerid",userId)
        


    if(error){
      throw new Error(error.message)
    }

    return data;

   }
   catch (error: any){
       throw new Error(error.message)
   }
  
}


export const getUserFavoritePosts = async (userId:string) => {


  try{

    const favoritesIds = await getUserFavoriteId(userId);

   
     // Step 2: Extract story IDs from the favorite IDs
     const storyIds = favoritesIds
     .filter(favorite => favorite.storyid)
     .map(favorite => favorite.storyid);


   // Step 3: Query the stories table to get the favorite posts
   const { data, error } = await supabase
     .from('stories')
     .select('*')
     .in('id', storyIds); // Filter by story IDs
        

    if(error){
      throw new Error(error.message)
    }

    return data;

   }
   catch (error: any){
       throw new Error(error.message)
   }
  
}


export const deleteFavorite = async (ownerId: string, storyId: string) => {
  
  try{
    const { data, error } = await supabase
    .from('favorites')
    .delete()
    .match({ ownerid: ownerId, storyid: storyId });

    if (error) {
      throw new Error(error.message);
    } 


    return data;


  }
  catch (error: any){
      throw new Error(error.message)
  }

};


export const updatePost = async (field:string, updates: any, id:string) =>{
  try{

    // Update the specified field in the stories table
    const { data: newPost, error: updateError } = await supabase
      .from('stories')
      .update({ [field] : updates })
      .eq('id', id);

    // Handle potential errors
    if (updateError) {
      throw updateError;
    }

    return newPost;

  }
  catch (error: any){ 
      throw new Error(error.message)
  }
}


export const updatePost_Character_Area_desc = async (type:string, updates: any, id:string, objId:string) =>{
  try{
      // Fetch the current story to update
      const { data: currentStory, error: fetchError } = await supabase
      .from('stories')
      .select(type)
      .eq('id', id)
      .single();

      if (fetchError) {
      throw fetchError;
      }

      // Merge the new entry with the existing entries
      const updatedTypeField = {
      // @ts-ignore
      ...currentStory[type] ,
      [objId]: {
        // @ts-ignore
        ...currentStory[type][objId],
        description: updates,
      },
      
      };

      // Update the specified field in the stories table
      const { data: newPost, error: updateError } = await supabase
      .from('stories')
      .update({ [type]: updatedTypeField })
      .eq('id', id);

      // Handle potential errors
      if (updateError) {
      throw updateError;
      }

      return newPost;

  }
  catch (error: any){ 
      throw new Error(error.message)
  }
}