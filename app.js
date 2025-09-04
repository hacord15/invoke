import readline from "readline/promises";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const messages = [
    {
        role: "system",
        content: `You are a smart assistant who answers the asked questions.
        1. searchWeb({query}: {query:string}) // Search the latest information and realtime data on the internet.
        current date: ${new Date().toUTCString()}`
        // `
      },
      // {
      //   role: "user",
      //   content: "Weather of mumbai today?"
      // }
    ];


 while (true) { 
    
    const question = await rl.question("You:");

    //bye  

    if (question === 'bye') {
      break;
    }
    messages.push({ role: "user", content: question });

     while (true) {
      const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: messages,
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
  
  messages.push(completion.choices[0].message);
  
const toolCalls = completion.choices[0].message.tool_calls
if(!toolCalls){
  console.log(`Final Answer: ${completion.choices[0].message.content}`);
  break;
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
      content: toolResult
    });
  }
}

  const completion2 = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: messages,
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

  console.log(JSON.stringify(completion2.choices[0].message, null, 2));
    }
 }

  
}

main();



async function webSearch({query}) { 
  // here we will dp tavily api call
  console.log("Calling the web");

  const response = await tvly.search(query);
  //console.log('response:',response);

  const finalResult = response.results.map(result => result.content).join('\n\n');
  //console.log('finalResult:',finalResult);
  
   return finalResult;
   }
