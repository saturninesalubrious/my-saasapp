import mongoose,{Schema,Document} from "mongoose";
import { Message } from "@/model/User";

export interface ApiResponse {
success: boolean;
message: string;
isAcceptingMessages?: boolean
messages?: Array<Message>
}