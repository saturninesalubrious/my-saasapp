import mongoose, {Schema,Document, Mongoose} from "mongoose"

export interface Message  extends Document {
 content: string;
 createdAt: Date;
};


const MessageSchema: Schema<Message> = new Schema ({

 content: {
  type: String,
  required: true,
 },
 createdAt: {
  type: Date,
  required: true,
  default: Date.now
 }

})

export interface User extends Document {
 username: String;
 email: string;
 password: string;
 verifyCode: string;
 verifyCodeExpiry: Date;
 isVerified: boolean;
 isAcceptingMessage: boolean;
 message: Message;
}

const UseSchema: Schema<User> = new Schema ({

 username: {
  type: String,
  required: [true, "Username is required "],
  trim: true,
  unique: true,
 },
 email: {
  type: String,
  required: [true,"Email is required"],
  unique: true,
  match: [/^[\w-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/ ,'please use a valid email address']
 },
 password: {
  type: String,
  required: [true, "Password is required"]
 },
 verifyCode: {
  type: String,
  required: [true, "Verify code is required"]
 },
 verifyCodeExpiry: {
  type: Date,
  required: [
   true, "Verify code is required "]
 },
 isVerified: {
  type: Boolean,
  default: false,
 },
 isAcceptingMessage: {
  type: Boolean,
  default: true,
 },
 message: [MessageSchema]

});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UseSchema)

export default UserModel;