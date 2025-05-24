import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Configuration, OpenAIApi } from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
  basePath: 'https://api.v3.cm/v1',
});

const openai = new OpenAIApi(configuration);

async function getReadmeContent(owner: string, repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      throw new Error('README not found');
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching README:', error);
    throw error;
  }
}

async function analyzeReadme(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a technical analyst specializing in analyzing GitHub repositories. Provide a concise but comprehensive summary of the repository based on its README content. Focus on the key features, purpose, and technical aspects.'
        },
        {
          role: 'user',
          content: content
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing README:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { owner, repo } = await req.json();

    if (!owner || !repo) {
      throw new Error('Owner and repo parameters are required');
    }

    const readmeContent = await getReadmeContent(owner, repo);
    const analysis = await analyzeReadme(readmeContent);

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});