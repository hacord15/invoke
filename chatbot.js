
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";


const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // 24 hours TTL (time to live)


export async function generate(userMessage , threadId) {
 

  const baseMessages = [
    {
      role: "system",
      content: `You are an intelligent assistant that provides accurate, helpful, and comprehensive answers to user questions.

## Core Capabilities:
- searchWeb({query: string}): Use this to find current information, real-time data, breaking news, recent events, or when your knowledge might be outdated
- Current date: ${new Date().toUTCString()}

## Response Guidelines:

### ACCURACY FIRST
- If unsure about facts, use searchWeb() to verify
- For time-sensitive topics (news, stocks, weather, current events), always search
- Clearly distinguish between your knowledge and searched information
- Admit when you don't know something rather than guessing

### SEARCH STRATEGY
Use searchWeb() when:
- Asked about events after your knowledge cutoff
- Questions need real-time data (weather, prices, news)
- User asks for "latest," "current," "recent," or "today"
- Technical specifications that may have changed
- Verification of potentially outdated information

### RESPONSE STRUCTURE
1. **Direct Answer**: Lead with the key information
2. **Context**: Provide relevant background when helpful
3. **Sources**: Cite when using searched information
4. **Follow-up**: Offer related information or next steps when appropriate

### COMMUNICATION STYLE
- Be concise but complete
- Use clear, professional language
- Break down complex topics into digestible parts
- Provide examples when they add clarity
- Match the user's level of technical detail

### EDGE CASES
- For subjective questions, acknowledge multiple perspectives
- For sensitive topics, remain neutral and factual
- For incomplete questions, ask for clarification
- For impossible requests, explain limitations respectfully

Remember: Your goal is to be maximally helpful while maintaining accuracy and reliability.`,
      // `
    },
    // {
    //   role: "user",
    //   content: "Weather of mumbai today?"
    // }
  ];


  // get previous messages from cache otherwise use baseMessages
  const  messages = cache.get(threadId) ?? baseMessages;



   
    messages.push({
      role: "user",
      content: userMessage,
    });

    const MAX_RETRIES = 10;
    let count = 0;

    while (true) {


      if (count >= MAX_RETRIES) {
        return "Error: Maximum retry limit reached. Please try again later.";
      }
      count++;
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "searchWeb",
              description:
                "Search the latest information and realtime data on the internet",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to perform search on.",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      messages.push(completion.choices[0].message);

      const toolCalls = completion.choices[0].message.tool_calls;

      if (!toolCalls) {
        // here we end the chatbot response 
        cache.set(threadId, messages);
        console.log(cache);
       return completion.choices[0].message.content;
      }

      for (const tool of toolCalls) {
        //console.log('toolL:',tool)
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if (functionName === "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));
          //   console.log('toolResult:',toolResult);

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }

      const completion2 = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and realtime data on the internet",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to perform search on.",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      console.log(JSON.stringify(completion2.choices[0].message, null, 2));
    }
  
}



async function webSearch({ query }) {
  // here we will dp tavily api call
  console.log("Calling the web");

  const response = await tvly.search(query);
  //console.log('response:',response);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  //console.log('finalResult:',finalResult);

  return finalResult;
}




 
