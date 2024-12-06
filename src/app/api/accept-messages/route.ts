import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"

export async function POST(request: Request) {
 await dbConnect()

 const session = await auth()

  const user: User = session?.user as User

  if (!session || !session.user) {
   return Response.json({
    success: false,
    message: "Not Authenticated"
   }, {status : 401})
  }

  const userId = user._id;

  const {acceptMessages} = await request.json()

  try {

   const updatedUser =  await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessages}, {new: true})

   if (!updatedUser) {
    
    return Response.json({
     success: false,
     message: "Failed to update user status accept messages"
    }, {status: 401})


   } 
   
   
    return Response.json({
     success: true,
     message: "Message acceptance status updated successfully",
     updatedUser
    }, {status: 401})
   
   
  } catch (error) {

   console.log("failed to update user status to accept messages")

   return Response.json({
    success: false,
    message: "failed to update user status to accept messages"
   },
  {status : 500})
   
  }
}


export async function GET(request: Request) {
 
 await dbConnect()

 const session = await auth()

  const user: User = session?.user as User

  if (!session || !session.user) {
   return Response.json({
    success: false,
    message: "Not Authenticated"
   }, {status : 401})
  }

  const userId = user._id;

  const foundUser = await UserModel.findById(userId) 

  try {
   if (!foundUser) {
    return Response.json({
     success: false,
     message: "User not found"
    }, {status: 400})
   }
 
   return Response.json({
    success: true,
    isAcceptingMessages: foundUser.isAcceptingMessage
   },
   {status: 200}
  )
  } catch (error) {

   console.log("failed to update user status to accept messages")

   return Response.json({
    success: false,
    message: "Error is getting message acceptance status"
   }, {status : 500})
   
  }
}