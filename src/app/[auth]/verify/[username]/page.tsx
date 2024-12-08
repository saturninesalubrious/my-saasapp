"use client"
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z  from "zod";
import axios from "axios";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const VerifyAccount = () => {
const [isSubmitting, setIsSubmitting] = useState<boolean>()

 const router = useRouter();
 const params = useParams<{username: string}>()
 const {toast} = useToast
 const form = useForm<z.infer<typeof verifySchema>>({
  resolver: zodResolver(verifySchema),
 })

 const onSubmit = async (data: z.infer<typeof verifySchema>) => {
  try {

   const response = await axios.post(`/api/verify-code`, {
    username: params.username,
    code: data.code
   })

   toast({
    title: "Success",
    description: response.data.message
   })

   setIsSubmitting(false)
   
  } catch (error) {
   
  }
 }

 return (
  <div>

<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  </div>
 )
}
