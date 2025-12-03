import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Intentando login con:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credenciales vacías");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          console.log("👤 Usuario encontrado:", user?.email);

          if (!user || !user.password) {
            console.log("❌ Usuario no encontrado");
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("🔑 Password match:", passwordMatch);

          if (!passwordMatch) {
            console.log("❌ Password incorrecto");
            return null;
          }

          console.log("✅ Login exitoso");
          return {
            id: user.id,
            email: user.email,
            name: user.nombre,
            role: user.role
          };
        } catch (error) {
          console.error("💥 Error en authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true  // ← Esto habilita logs detallados
};