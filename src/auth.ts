import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"



export const authOptions = NextAuth({
 providers: [
  Credentials({
   id: "credentials",
   name: "Credentials",
   credentials: {
    email: {label: "email", type: "text"},
    password: {label: "password", type: "password"},
  },
  async authorize(credentials: any): Promise<any> {

   await dbConnect()
   try {

    const user = await UserModel.findOne({
     $or: [
      
      {email: credentials.identifier }
     ]
    })

    if (!user) {
     throw new Error("No user found with this email")
    }
    
  const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

  if (isPasswordCorrect) {
   return user
  } else {
   throw new Error('Incorrect User')

  }

   } catch (error: any) {
    throw new Error(error) 
    
   }


  }
  })
 ],
 callbacks: {
  async jwt({token, user}){
   if (user) {
    token._id = user._id?.toString()
    token.isVerified = user.isVerified;
    token.isAcceptingMessages = user.isAcceptingMessages;
    token.username = user.username
   }
   return token
  },
  async session({ session, token }) {
   if (token) {
       session.user._id = token._id;
       session.user.isVerified = token.isVerified;
       session.user.isAcceptingMessages = token.isAcceptingMessages;
       session.user.username = token.username;
   }
   return session;
},

 },
 pages: {
  signIn: "/sign-in"
 },
 session: {
  strategy: "jwt"
 },
 secret:  process.env.AUTH_SECRET!,
 
})























// Your own logic for dealing with plaintext password strings; be careful!
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
 
        // logic to salt and hash password
        
 
        // logic to verify if the user exists
       
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
})