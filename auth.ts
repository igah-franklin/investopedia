import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        type: { type: "text" },
        user: { type: "text" },
        token: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const type = credentials.type as string;
        if (type === "login-success") {
          try {
            const user = JSON.parse(credentials.user as string);
            const token = credentials.token as string;
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              accessToken: token,
            };
          } catch (e) {
            console.error("Failed to parse user credentials in authorize:", e);
            return null;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
