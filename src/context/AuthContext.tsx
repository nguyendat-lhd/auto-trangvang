import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { account, type AppwriteUser } from "../lib/appwrite";

interface AuthContextValue {
	user: AppwriteUser;
	loading: boolean;
	signInWithEmail: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AppwriteUser>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				const current = await account.get();
				if (isMounted) setUser(current);
			} catch (_) {
				if (isMounted) setUser(null);
			} finally {
				if (isMounted) setLoading(false);
			}
		})();
		return () => {
			isMounted = false;
		};
	}, []);

	const signInWithEmail = async (email: string, password: string) => {
		await account.createEmailPasswordSession(email, password);
		const current = await account.get();
		setUser(current);
	};

	const signOut = async () => {
		try {
			await account.deleteSessions();
		} finally {
			setUser(null);
		}
	};

	const value = useMemo(
		() => ({ user, loading, signInWithEmail, signOut }),
		[user, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}


