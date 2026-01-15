'use server';
/**
 * @fileOverview An AI flow for analyzing a student's Learning Activity Sheet (LAS).
 *
 * - analyzeLas - A function that takes an image of an LAS and returns a structured analysis.
 * - LasAnalysisInput - The input type for the analyzeLas function.
 * - LasAnalysisOutput - The return type for the analyzeLas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// 1. Define the input schema for the AI flow
const LasAnalysisInputSchema = z.object({
  subject: z.string().describe('The subject of the Learning Activity Sheet.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the LAS, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type LasAnalysisInput = z.infer<typeof LasAnalysisInputSchema>;

// 2. Define the structured output schema that we want the AI to return
const LasAnalysisOutputSchema = z.object({
  subject: z.string().describe('The subject name identified from the sheet.'),
  lasNumber: z.string().describe('The LAS number identified from the sheet.'),
  learningTarget: z.string().describe('The learning target or objective of the LAS.'),
  detailedSolutions: z.array(z.string()).describe('Step-by-step solutions for the exercises.'),
  finalAnswers: z.array(z.string()).describe('A list of the final answers.'),
  systemNote: z.string().describe("The concluding system note: 'Always verify against your teacher\\'s discussion.'"),
});
export type LasAnalysisOutput = z.infer<typeof LasAnalysisOutputSchema>;


// 3. Create the main exported function that the UI will call
export async function analyzeLas(input: LasAnalysisInput): Promise<LasAnalysisOutput> {
  return lasAnalyzerFlow(input);
}

// Helper function to get subject-specific instructions
function getSubjectSpecificInstructions(subject: string): string {
    switch (subject.toLowerCase()) {
        case 'math':
            return 'Show every step of the calculation.';
        case 'filipino':
        case 'english':
            return 'Check for grammar and formal tone.';
        case 'a.p.':
        case 'values ed.':
            return "Summarize the core moral or historical context.";
        default:
            return '';
    }
}


// 4. Define the Genkit prompt with the user's system instructions
const lasPrompt = ai.definePrompt({
    name: 'lasPrompt',
    input: { schema: LasAnalysisInputSchema },
    output: { schema: LasAnalysisOutputSchema },
    prompt: `You are a high-level academic assistant for a student using the Dynamic Learning Program (DLP). Your goal is to analyze the provided image of a Learning Activity Sheet (LAS) and provide a structured output in a terminal-style format.

Instructions:
* Identify: Extract the Subject, LAS Number, and Learning Target.
* Analyze: Read the 'Concept Notes' section carefully.
* Solve: Provide accurate answers to the 'Exercises' or 'Activities' section based only on the Concept Notes provided (unless the notes are insufficient).
* Predict: If handwriting is unclear or the image quality is poor, make a reasonable prediction for the text.
* Format: Output the response using a 'Terminal HUD' style. Use > for lines and uppercase for headers.
* Subject-Specific Rule: {{#if subjectInstructions}}{{subjectInstructions}}{{/if}}

Output Structure:
> SUBJECT: [Subject Name] | LAS #: [Number]
> TARGET: [Learning Target]
>
> [DETAILED SOLUTIONS]
> Step 1: ...
> Step 2: ...
>
> [FINAL ANSWERS]
> 1. ...
> 2. ...
>
> SYSTEM NOTE: Always verify against your teacher's discussion.

Image to be analyzed is below:
{{media url=photoDataUri}}
`,
});


// 5. Define the Genkit flow that orchestrates the AI call
const lasAnalyzerFlow = ai.defineFlow(
  {
    name: 'lasAnalyzerFlow',
    inputSchema: LasAnalysisInputSchema,
    outputSchema: LasAnalysisOutputSchema,
  },
  async (input) => {
    const subjectInstructions = getSubjectSpecificInstructions(input.subject);

    const { output } = await lasPrompt({ ...input, subjectInstructions });

    // Ensure the output is not null
    if (!output) {
      throw new Error('The AI model failed to return a valid analysis.');
    }

    return output;
  }
);
