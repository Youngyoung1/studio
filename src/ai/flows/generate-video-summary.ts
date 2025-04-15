'use server';
/**
 * @fileOverview A video summary generator AI agent.
 *
 * - generateVideoSummary - A function that handles the video summary generation process.
 * - GenerateVideoSummaryInput - The input type for the generateVideoSummary function.
 * - GenerateVideoSummaryOutput - The return type for the generateVideoSummary function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateVideoSummaryInputSchema = z.object({
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('The description of the video.'),
});
export type GenerateVideoSummaryInput = z.infer<typeof GenerateVideoSummaryInputSchema>;

const GenerateVideoSummaryOutputSchema = z.object({
  summary: z.string().describe('A short summary of the video content.'),
});
export type GenerateVideoSummaryOutput = z.infer<typeof GenerateVideoSummaryOutputSchema>;

export async function generateVideoSummary(input: GenerateVideoSummaryInput): Promise<GenerateVideoSummaryOutput> {
  return generateVideoSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoSummaryPrompt',
  input: {
    schema: z.object({
      title: z.string().describe('The title of the video.'),
      description: z.string().describe('The description of the video.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A short summary of the video content.'),
    }),
  },
  prompt: `You are a video summarization expert.  Given the title and description of a video, you will generate a short summary of the video content.

Title: {{{title}}}
Description: {{{description}}}

Summary: `,
});

const generateVideoSummaryFlow = ai.defineFlow<
  typeof GenerateVideoSummaryInputSchema,
  typeof GenerateVideoSummaryOutputSchema
>({
  name: 'generateVideoSummaryFlow',
  inputSchema: GenerateVideoSummaryInputSchema,
  outputSchema: GenerateVideoSummaryOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

