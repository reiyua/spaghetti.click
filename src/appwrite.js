import { Client, Databases } from 'appwrite'

const client = new Client()

client
  .setEndpoint('https://syd.cloud.appwrite.io/v1') // or your custom endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const databases = new Databases(client)

export const DATABASE_ID = '68946b0f0038d0cbdb28'
export const COLLECTION_ID = 'global_clicks'     
export const DOCUMENT_ID = 'global_counter'      
