import { Account, Client } from 'appwrite'
import type { Models } from 'appwrite'

// Centralized Appwrite client and account instance
// Requires Vite env vars: VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID

export const appwriteClient = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT as string)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID as string)

export const appwriteAccount = new Account(appwriteClient)

export type AppwriteSession = Models.Session
export type AppwriteUser = Models.User<Models.Preferences>


