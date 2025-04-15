// 'use server'
'use server';

/**
 * @fileOverview Generates video tags based on the video's title and description.
 *
 * - generateVideoTags - A function that generates tags for a video.
 * - GenerateVideoTagsInput - The input type for the generateVideoTags function.
 * - GenerateVideoTagsOutput - The return type for the generateVideoTags function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateVideoTagsInputSchema = z.object({
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('The description of the video.'),
});
export type GenerateVideoTagsInput = z.infer<typeof GenerateVideoTagsInputSchema>;

const GenerateVideoTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of tags generated for the video.'),
});
export type GenerateVideoTagsOutput = z.infer<typeof GenerateVideoTagsOutputSchema>;

export async function generateVideoTags(input: GenerateVideoTagsInput): Promise<GenerateVideoTagsOutput> {
  return generateVideoTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoTagsPrompt',
  input: {
    schema: z.object({
      title: z.string().describe('The title of the video.'),
      description: z.string().describe('The description of the video.'),
    }),
  },
  output: {
    schema: z.object({
      tags: z.array(z.string()).describe('An array of tags generated for the video.'),
    }),
  },
  prompt: `You are an expert in generating relevant tags for videos.

  Based on the title and description of the video, generate a list of tags that can improve the discoverability of the video.

  Title: {{{title}}}
  Description: {{{description}}}

  The tags should be relevant and specific to the content of the video.
  Return the tags as an array of strings.
  `,
});

const generateVideoTagsFlow = ai.defineFlow<
  typeof GenerateVideoTagsInputSchema,
  typeof GenerateVideoTagsOutputSchema
>({
  name: 'generateVideoTagsFlow',
  inputSchema: GenerateVideoTagsInputSchema,
  outputSchema: GenerateVideoTagsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
