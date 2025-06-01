import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from '$env/static/private';

export const { handle } = SvelteKitAuth({
	secret: AUTH_SECRET,
	trustHost: true,
	providers: [
		Google({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		})
	],
	pages: {
		signIn: '/login',
		error: '/login'
	},
	callbacks: {
		async jwt({ token, account, profile }) {
			// Persist the OAuth access_token and or the user id to the token right after signin
			if (account) {
				token.accessToken = account.access_token as string;
				token.id = profile?.sub as string;
			}
			return token;
		},
		async session({ session, token }: { session: any; token: any }) {
			// Send properties to the client, like an access_token and user id from a provider.
			session.accessToken = token.accessToken as string;
			session.user.id = token.id as string;
			return session;
		},
		async signIn({ user, account, profile }) {
			// Allow sign in
			console.log(user);
			console.log(account);
			console.log(profile);
			return true;
		},
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		}
	},
});