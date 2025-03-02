// scholarship.js
import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Fetch scholarship data using provided user parameters.
 * @param {string} userUniversity - The university provided by the user.
 * @param {string} race - The user's race.
 * @param {string} gender - The user's gender.
 * @returns {Promise<Object>} An object with a "scholarships" array.
 */
export async function getScholarships(userUniversity, race, gender) {
  if (!userUniversity) {
    throw new Error("University parameter is required.");
  }
  if (!race) {
    throw new Error("Race parameter is required.");
  }
  if (!gender) {
    throw new Error("Gender parameter is required.");
  }
  
  const prompt = `
I'm building a website to find scholarship opportunities for a user with the following profile:
- Race: ${race}
- Gender: ${gender}
- Attending: ${userUniversity}

Find me 10 scholarship opportunities with deadlines in 2025 that match these criteria.
Sort them from the earliest due date to the latest.
For each scholarship, output the following fields: "number", "title", "due_date", "award_amount", "eligibility", "apply_link", "gpa", and "university".
If an exact direct link is not known, output the URL of the scholarship page.
Output the result as JSON in a code block (using triple backticks and starting with "json") with a single key "scholarships" whose value is an array of objects.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });
    
    const rawText = response.choices[0].message.content;
    const data = extractJSON(rawText);
    
    if (Array.isArray(data.scholarships)) {
      // Sort by due_date (earliest first)
      data.scholarships.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    }
    
    return data;
  } catch (error) {
    console.error("Error processing scholarships:", error);
    throw error;
  }
}

/**
 * Extract JSON from a code block in the provided text.
 * @param {string} text - The text containing a JSON code block.
 * @returns {Object} - The parsed JSON object.
 */
function extractJSON(text) {
  const regex = /```json([\s\S]*?)```/;
  const match = text.match(regex);
  if (match && match[1]) {
    return JSON.parse(match[1].trim());
  }
  const startIndex = text.indexOf('{');
  if (startIndex !== -1) {
    return JSON.parse(text.substring(startIndex).trim());
  }
  throw new Error("No valid JSON found in GPT response.");
}
