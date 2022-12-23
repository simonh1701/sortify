import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the oauth access token to the token right after signin
      if (account) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      // Send access token to the client
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    maxAge: 50 * 60, // 50 minutes
  },
};

export default NextAuth(authOptions);
