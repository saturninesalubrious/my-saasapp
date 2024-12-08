import { auth } from '@/auth'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { Axios, AxiosError } from 'axios'
import { watchFile } from 'fs'
import { User } from 'next-auth'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const page = async () => {
const [messages, setMessages] = useState<Message[]>([])

const [isLoading, setIsLoading] = useState(false)

const [IsSwitchLoading, setIsSwitchLoading] = useState(false)

const {toast} = useToast()


const handleDeleteMessage = (messageId: string) => {
setMessages(messages.filter((message) =>
message._id !== messageId))
}


const session = await auth()

const form = useForm({
 resolver: zodResolver(AcceptMessageSchema)

})

const {register, watch,setValue} = form

const acceptMessages = watch('acceptMessages')

const fetchAcceptMessage = useCallback(async () => {
 setIsSwitchLoading(true)



 try {
  const response = await axios.get('/api/accept-messages')

  setValue('acceptMessages', response.data.isAcceptingMessage)
 } catch (error) {
  const axiosError = error as AxiosError<ApiResponse>

  toast({
   title: "Error",
   description: axiosError.response?.data.message || "Failed to fetch message settings"
  })
 } finally {

  setIsSwitchLoading(false)

 }


}, [setValue])


const fetchMessages = useCallback(async (refresh: boolean = false) => {

 setIsSwitchLoading(true)

 setIsLoading(true)
 setIsSwitchLoading(false)

 try {

  const response =  await axios.get<ApiResponse>('/api/get-messages')

  setMessages(response.data.messages || [])

  if (refresh) {
   toast({
    title: "Refreshed Messages",
    description: "Showing latest messages"

    
   })
  }
  
 } catch (error) {

  const axiosError = error as AxiosError<ApiResponse>

  toast({
   title: "Error",
   description: axiosError.response?.data.message || "Failed to fetch message settings",
   variant: "destructive"
   
  })
 } finally {
  setIsLoading(false)
  setIsSwitchLoading(false)
 }




}, [setIsLoading, setMessages])

useEffect(() => {

 if (!session || !session.user) return
 fetchMessages()
 fetchMessages()

 //handleSwitchChange

 const handleSwitchChange = async() => {
  try {

   const response = await axios.post<ApiResponse>('/api/accept-messages', {
    acceptMessages: !acceptMessages
   })

   setValue('acceptMessages', !acceptMessages)

   toast({
    title: response.data.message,
    variant:'default'
   })


   
  } catch (error) {
   const axiosError = error as AxiosError<ApiResponse>;

   toast({
    title: "Error",
    description: axiosError.response?.data.message || "Failed to fetch message settings",
    variant: "destructive"
   })


   
  }
 }



}, [session, setValue, fetchAcceptMessage, fetchMessages])

 const {username} = session?.user as User

 const baseUrl = `${window.location.protocol}//${window.location.host}`

 const profileUrl = `${baseUrl}/u/${username}`

 const copyToClipboard = () => {
  navigator.clipboard.writeText(profileUrl)
  toast({
   title: "URL copied",
   description: "Profile URL has been copied to clipboard"
  })
 }

if (!session || !session.user) {
 return <div>Please Login</div>
}

  return (
    <div>

      
    </div>
  )
}

export default page
