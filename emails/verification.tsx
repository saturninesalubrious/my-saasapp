import {Html,Head,Font,Preview,Heading,Row, Section, Text, Button} from "@/react-email/components"

interface VerificationEmailProps{
 username: string;
 otp:string;
}

export default function VerificationEmail({username,otp}: VerificationEmailProps){

 return (<Html lang="en" dir="ltr">

  <Head>
   <Head>
    <title>Verification code</title>
    <Font fontFamily="Roboto" 
    fallbackfontfamily="Verdana" 
    webFont={{url: "https://fontgstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2", format: "woff2"}} 
    fontWeight={400} 
    fontStyle="normal"/>
   </Head>
   <Preview>Here&apos;s your verification code: {otp}</Preview>
   <Section>
    <Row>
     <Text>
      Thank you trgistering. Please use the following verification code to complete your registration
     </Text>
     
    </Row>
    <Row>
     <Text>{otp}</Text>
     <Text>
      If you didnot request this code, please ignore this email.
     </Text>
    </Row>
    
    
   </Section>
  </Head>

 </Html>)

}