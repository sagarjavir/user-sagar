import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();
const DB_ID = "65b8c6d89b2df94abe96";
const COLLECTION_ID = "65b8c711e87ba5bd74d9";

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("65b8c652633c7004423f");

export const account = new Account(client);
export const databases = new Databases(client);
export { DB_ID, COLLECTION_ID, ID };
