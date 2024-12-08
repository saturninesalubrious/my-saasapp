import { auth } from "@/auth"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import mongoose from "mongoose";
import { User } from "next-auth";



export default async function DELETE(request: Request, {params}: {params: {messageid: string}}) {

 const messageId = params.messageid

 await dbConnect()

 const session = await auth()

 const user: User = session?.user as User

 if (!session || !session.user) {
  return Response.json({
   success: false,
   message: "Not Authenticated"
  },
 {status: 401})

 }

 try {

  const updateResult =   await UserModel.updateOne(
   {_id: user._id}, {$pull: {messages: {_id: messageId}}}
   
  )

  if (updateResult.modifiedCount == 0){
   return Response.json({
    success: false,
    message: "Message not found or already delete"
   }, {status: 404})
  }
  
 } catch (error) {
  console.log("Error")
  return Response.json({
   success: false,
   message: " Error deleteing message"
  }, {status: 500})
  
 }

}