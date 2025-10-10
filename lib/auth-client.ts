import { createAuthClient } from 'better-auth/react';

// Better Auth usa automaticamente window.location.origin como baseURL
// Não é necessário (e nem funciona) passar process.env no cliente
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
