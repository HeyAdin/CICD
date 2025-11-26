import type { AuthOptions, DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { id?: string | null };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials) {
        if (!credentials?.phone || !credentials.password) return null;

        const existingUser = await db.user.findFirst({
          where: { number: credentials.phone },
        });

        if (existingUser) {
          const isValid = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (!isValid) return null;

          return {
            id: existingUser.id.toString(),
            name: existingUser.name,
            email: `${existingUser.number}@example.com`, // must be a string email
          };
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        const newUser = await db.user.create({
          data: {
            number: credentials.phone,
            password: hashedPassword,
          },
        });

        return {
          id: newUser.id.toString(),
          name: newUser.name,
          email: `${newUser.number}@example.com`,
        };
      },
    }),
  ],

  secret: process.env.JWT_SECRET || "secret",

  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
