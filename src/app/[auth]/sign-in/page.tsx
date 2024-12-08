"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {  ControllerFieldState, ControllerRenderProps, FieldValues, useForm, UseFormStateReturn } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axios, { AxiosError } from "axios"
import Link from "next/link"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from "usehooks-ts"
import { useRouter } from "next/navigation"
import { singUpSchema } from "@/schemas/signUpSchema"
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader, Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "@/auth"



const page = () => {

 const [username,setUsername] = useState('')

 const[usernameMessage, setUsernameMessage] = useState('')

 const [isCheckingUsername, setIscheckingUsername] = useState(false)

 const [isSubmitting,setIsSubmitting] = useState(false)

 const debounced =  useDebounceCallback(setUsername,500)

 const {toast} = useToast()

 const router = useRouter()

 //zod implementation

 const form = useForm<z.infer<typeof signInSchema>>({
  resolver: zodResolver(signInSchema),
  defaultValues: {
   identifier: '',
   password: ''
  }
 })


 useEffect(() => {
  const checkUsernameUnqiue = async () => {
   if(username) {
    setIscheckingUsername(true)
    setUsernameMessage('')
   }
   try {

    const response = await axios.get(`/api/check-username-unique?username=${username}`)

    setUsernameMessage(response.data.Message)

    
   } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
    
   } finally {

    setIscheckingUsername(false)

   }
  }

  checkUsernameUnqiue()

 }, [username]
)

const onSubmit = async (data: z.infer<typeof singUpSchema>) => {

 const result =  await signIn('credentials', {
  redirect: false
  identifier: data.identifier,
  password: data.password
 }
 )

 if (result.error) {

  if (result.error === 'CredentialsSignin') {
   toast({
    title:"Login Failed",
    description: "Incorrect username or password",
    variant: "destructive"
   })



  }
  toast({
   title: "Login Faile",
   description: "Incorrect username or Password",
   variant: "destructive"
  })
 }

 if (result.url) {
  router.replace('/dashboard')
 }

}

 return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
     <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
       Join Mystery Message
      </h1>
      <p className="mb-4">Sign up to join your anonymous adventure</p>
     </div>
     <Form {...form}> 
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

      <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/username</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} onChange={(e) => {
                 debounced(e.target.value)
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         

        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (<><Loader2 className="mr-w h-4 w-4 animated-spin"/></>) : ('signin')}
         </Button>
      

      </form>
       </Form>
    </div>
    <p>Already a member? {' '} <Link href="/sign-in" className="Text-Blue-600 hover:text-blue-800">Sign in</Link></p>
    </div>
 )
}

export default page