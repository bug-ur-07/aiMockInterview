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

export const GetUserInterviews = query({
  args: {
    uid: v.id("UserTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("InterviewSessionTable")
      .filter(q => q.eq(q.field("userId"), args.uid))
      .order("desc")
      .collect();

    return result;
  },
});




export const SaveUserAnswer = mutation({
  args: {
    interviewId: v.id("InterviewSessionTable"),
    questionNumber: v.number(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId);

    if (!interview) return null;

    // Add userAnswers array if not present
    const updatedAnswers = interview.userAnswers ?? [];

    updatedAnswers.push({
      questionNumber: args.questionNumber,
      answer: args.answer,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.interviewId, {
      userAnswers: updatedAnswers,
    });

    return true;
  },
});
