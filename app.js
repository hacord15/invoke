import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a smart assistant who answers the asked questions.
        1. searchWeb({query}: {query:string}) // Search the latest information and realtime data on the internet`
      },
      {
        role: "user",
        content: "When was iPhone 16 launched?"
      }
    ],
    tools: [
     {
      "type": "function",
      "function": {
        "name": "webSearch",
        "description": "Search the latest information and realtime data on the internet",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "The search query to perform search on."
            },
          
          },
          "required": ["query"]
        }
      }
    }
    ],
    tool_choice: "auto"
  });

  
const toolCalls = completion.choices[0].message.tool_calls
if(!toolCalls){
  console.log(`Final Answer: ${completion.choices[0].message.content}`);
  return;
}

for (const tool of toolCalls) {
  console.log('toolL:',tool)
  const functionName = tool.function.name;
  const functionParams = tool.function.arguments;

  if (functionName === "webSearch") {
   const toolResult = await webSearch(JSON.parse(functionParams));
    console.log('toolResult:',toolResult);
  }
}

  console.log(JSON.stringify(completion.choices[0].message, null, 2));
}

main();



async function webSearch({query}) { 
  // here we will dp tavily api call
  console.log("Calling the web");

  const response = await tvly.search(query);
  console.log('response:',response);
   return 'Iphone 16 was launched on 20 september 2024';
   }
