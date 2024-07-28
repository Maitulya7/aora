import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.mv.aora",
  projectId: "6684fddf00250ac75f04",
  databaseId: "668513b60032afe4e4c9",
  userCollectionId: "668513ec00351c794def",
  videoCollectionId: "6685142300165701004d",
  storageId: "668517200022c3f8e973",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)

// Create User
export const createUser = async (email, password, username) => {
  console.log("creating account");
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

//GET CURRENT USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get all post from database

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
export async function searchPost(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
}
export async function getUserPost(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId) ,  Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }
}

export const singOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getFilePreview = async (fileId , type) => {
  let fileUrl;

  try {
    if(type === 'video'){
      fileUrl = storage.getFileView(appwriteConfig.storageId , fileId)
    }else if (type === 'image'){
      fileUrl = storage.getFilePreview(appwriteConfig.storageId , fileId , 2000 , 2000 , 'top' ,100)
    }else{
      throw new Error('Invalid file type')
    }
    if(!fileUrl) throw Error;
    return fileUrl
  } catch (error) {
    throw new Error(error.message)
  }
}


export const uploadFile = async (file , type) =>{
  if(!file) return

  const {mimeType , ...rest} = file;

  const asset = {type:mimeType , ...rest}

  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    )
    
    const fileUrl = await getFilePreview(uploadFile.$id ,type)
    return fileUrl;
  } catch (error) {
    throw new Error(error.message)
  }
}

export const createPost = async (form) => {
  try {
    const [thumbnailUrl , videoUrl]  = await Promise.all([
      uploadFile(form.thumbnail , 'image'),
      uploadFile(form.video, 'video'),
    ])
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title:form.title,
        thumbnail:thumbnailUrl,
        video:videoUrl,
        prompt:form.prompt,
        creator:form.userId,
        like:[],
      }
    )
    return newPost;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const likePost = async (postId, userId) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId
    );

    if (!post.like.includes(userId)) {
      const updatedLikedBy = [...post.like, userId];

      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        postId,
        { like: updatedLikedBy }
      );

      return updatedPost;
    } else {
      throw new Error("User has already liked this post");
    }
  } catch (error) {
    throw new Error(`Error liking post: ${error.message}`);
  }
};


export const unlikePost = async (postId, userId) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId
    );

    const updatedLikedBy = post.like.filter(id => id !== userId);

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      postId,
      { like: updatedLikedBy }
    );

    return updatedPost;
  } catch (error) {
    throw new Error(`Error unliking post: ${error.message}`);
  }
};

export const getUserLikedPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("like", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(`Error fetching liked posts: ${error.message}`);
  }
};

