import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
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

export async function createUser(email, password, username) {
    console.log("creating account")
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username,
      );
      if (!newAccount){
        throw new Error("Account creation failed")
      };
  
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
        console.log(error)
      throw new Error(error);
    }
  }
  
  // Sign In
  export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }