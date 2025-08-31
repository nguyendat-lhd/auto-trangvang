import { Client, Account, type Models } from "appwrite";

export interface AppwriteConfig {
	endpoint: string;
	projectId: string;
}

// Read from Vite env vars
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string;

if (!endpoint || !projectId) {
	// eslint-disable-next-line no-console
	console.warn(
		"Missing Appwrite env vars VITE_APPWRITE_ENDPOINT or VITE_APPWRITE_PROJECT_ID"
	);
}

export const appwriteClient = new Client()
	.setEndpoint(endpoint || "http://localhost/v1")
	.setProject(projectId || "");

export const account = new Account(appwriteClient);

export type AppwriteUser = Models.User<Models.Preferences> | null;


