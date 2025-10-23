import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import {MemberData} from "@/model/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await MemberData.findOne({ email: credentials.email }).lean();
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password || "");
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role || "user",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // ✅ 必須要有
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.email) session.user.email = token.email;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
};

// ✅ Next.js 13+ API Route Handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
