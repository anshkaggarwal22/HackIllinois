// scholarship.js
import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from 'openai';
import puppeteer from 'puppeteer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `
I'm building a website to find scholarship opportunities for college students with deadlines in 2025.
For a sample user who is black, female, from California, a computer science major, muslim, and plays chess for fun,
find me 5 primary scholarship opportunities. For each, provide the scholarship number, title, due date, award amount, eligibility,
a URL of the scholarship page (which may not be the direct application link), GPA requirement, and the associated university.
Order the primary scholarships by scholarship number in ascending order.
Additionally, create another section for scholarships that apply to overlapping categories (e.g., multiple eligibility criteria).
Output the result as JSON in a code block (using triple backticks and starting with 'json') with two keys: 'primary' and 'overlapping'.
Each should be an array of objects with the following keys: 'number', 'title', 'due_date', 'award_amount', 'eligibility',
'apply_link', 'gpa', and 'university'.
If an exact direct link is not known, use the general scholarship page URL.
`;

function extractJSON(text) {
  const regex = /```json([\s\S]*?)```/;
  const match = text.match(regex);
  if (match && match[1]) return match[1].trim();
  const start = text.indexOf('{');
  return start !== -1 ? text.substring(start).trim() : text;
}

async function getDirectApplyLink(pageUrl) {
  if (!pageUrl || pageUrl === 'N/A') return 'N/A';
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    const link = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('a, button'));
      const candidate = candidates.find(el => {
        const text = el.innerText?.toLowerCase() || '';
        return text.includes('apply');
      });
      if (candidate) {
        if (candidate.tagName.toLowerCase() === 'a' && candidate.href)
          return candidate.href;
        else if (candidate.tagName.toLowerCase() === 'button')
          return candidate.getAttribute('data-link') || '';
      }
      return null;
    });
    return link || 'N/A';
  } catch (error) {
    console.error(`Error scraping ${pageUrl}: ${error.message}`);
    return 'N/A';
  } finally {
    if (browser) await browser.close();
  }
}

async function updateApplyLink(scholarship) {
  if (!scholarship.apply_link || scholarship.apply_link === 'N/A') return 'N/A';
  const scrapedLink = await getDirectApplyLink(scholarship.apply_link);
  // If the scraped link is generic or not improved, fallback to the original
  if (!scrapedLink || scrapedLink === 'N/A' || scrapedLink.includes('example.com') || scrapedLink === scholarship.apply_link)
    return scholarship.apply_link;
  return scrapedLink;
}

// Fallback scholarship data if API fails
const fallbackScholarships = {
  primary: [
    {
      number: 1,
      title: "Google Scholarship for Women in Tech",
      due_date: "May 15, 2025",
      award_amount: "$10,000",
      eligibility: "Women in Computer Science",
      apply_link: "https://edu.google.com/scholarships/",
      gpa: "3.5",
      university: "Any accredited university"
    }
  ],
  overlapping: [
    {
      number: 101,
      title: "Gates Millennium Scholars Program",
      due_date: "January 15, 2025",
      award_amount: "Full Tuition",
      eligibility: "Minority students with financial need",
      apply_link: "https://www.thegatesscholarship.org/",
      gpa: "3.3",
      university: "Any accredited university"
    },
    {
      number: 102,
      title: "NSBE Technical Scholarship",
      due_date: "March 1, 2025",
      award_amount: "$5,000",
      eligibility: "Black students in STEM",
      apply_link: "https://www.nsbe.org/scholarships",
      gpa: "3.0",
      university: "Any accredited university"
    },
    {
      number: 103,
      title: "Islamic Scholarship Fund",
      due_date: "April 10, 2025",
      award_amount: "$7,500",
      eligibility: "Muslim students in STEM fields",
      apply_link: "https://islamicscholarshipfund.org/",
      gpa: "3.2",
      university: "Any accredited university"
    }
  ]
};

export async function getScholarships() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const resultText = response.choices[0].message.content;
    const jsonString = extractJSON(resultText);
    let data;
    
    try {
      data = JSON.parse(jsonString);
      
      // Validate data structure
      if (!data.overlapping || !Array.isArray(data.overlapping) || data.overlapping.length === 0) {
        console.warn('OpenAI returned invalid data structure, using fallback data');
        data = fallbackScholarships;
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      data = fallbackScholarships;
    }
    
    // Update the apply_link field in each scholarship entry
    const sections = ['primary', 'overlapping'];
    for (const section of sections) {
      if (Array.isArray(data[section])) {
        for (let scholarship of data[section]) {
          scholarship.apply_link = await updateApplyLink(scholarship);
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error processing scholarships:', error);
    // Return fallback data if anything goes wrong
    return fallbackScholarships;
  }
}
