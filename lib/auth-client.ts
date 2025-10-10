import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL
    ? `${process.env.BETTER_AUTH_URL}/api/auth`
    : 'http://localhost:3000/api/auth'
});

export const { signIn, signUp, signOut, useSession } = authClient;
