import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const SaveInterviewQuestion = mutation({
  args: {
    question: v.any(),
    uid: v.id("UserTable"),
    resumeUrl: v.union(v.string(), v.null()),
    jobTitle: v.union(v.string(), v.null()),
    jobDescription: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewSessionTable", {
      interviewQuestions: args.question ?? [],
      resumeUrl: args.resumeUrl ?? null,
      userId: args.uid,
      status: "draft",
      jobTitle: args.jobTitle ?? null,
      jobDescription: args.jobDescription ?? null,
    });

    return result;
  },
});


export const GetInterviewQuestions=query({
  args:{
    interviewRecordsId:v.id('InterviewSessionTable')
  },
  handler:async(ctx,args)=>{
    const result = await ctx.db.query('InterviewSessionTable')
    .filter(q=>q.eq(q.field('_id'),args.interviewRecordsId))
    .collect();
    
    return result[0]
  }
})