import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: { email: unknown; password: string; }) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials or password");
        }
        try {
          await connectToDatabase();
          const user = await User.findOne({
            email: credentials.email,
            password: credentials.password,
          });
          if (!user) {
            throw new Error("No user found with this");
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("InValid Password");
          }
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error: ", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages:{
    signIn:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
    maxAge:30*24*60*60,
  },
  secret:process.env.NEXTAUTH_SECRET,
};
