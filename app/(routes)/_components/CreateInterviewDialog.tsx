import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import ResumeUpload from './ResumeUpload'
import JobDescription from './JobDescription'
function CreateInterviewDialog() {
    const [formData,setFormData] = useState<any>();

    const onHandleInputChange =  (field:string,value:string)=>{
        setFormData((prev:any)=>({
            ...prev,
            [field]:value
        }))
    }
  return (
     <Dialog>
  <DialogTrigger>
    <Button>+ Create Interview</Button>
  </DialogTrigger>
<DialogContent className="w-[0vw] sm:min-w-[600px] md:min-w-3xl">

    <DialogHeader>
      <DialogTitle>Please Submit following details.</DialogTitle>
      <DialogDescription>
        <Tabs defaultValue="resume-upload" className="w-[500px]">
  <TabsList>
    <TabsTrigger value="resume-upload">Resume Upload</TabsTrigger>
    <TabsTrigger value="job-description">Job Description</TabsTrigger>
  </TabsList>
  <TabsContent value="resume-upload"><ResumeUpload/></TabsContent>
  <TabsContent value="job-description"><JobDescription onHandleInputChange={onHandleInputChange}/></TabsContent>
</Tabs>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className='flex gap-6'>
        <DialogClose>
            <Button variant={'ghost'}>Cancel</Button>
        </DialogClose>
        <Button>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default CreateInterviewDialog