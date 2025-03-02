# 🤖 Angular Generative AI Demo  

[🎥 Watch the Demo](https://www.loom.com/share/174a79905b9d42968f574f8b6f1eda85?sid=7452f8ea-e830-4e2d-bfbd-094af2aca5ce)  

## 🚀 Why Does This Matter?  

Generative AI is transforming the way we interact with technology. As AI-powered chatbots become more prevalent, users expect features like real-time text updates. By leveraging LLM APIs, Angular Signals, and RxJS, we can build modern AI-driven user experiences with seamless interactions.  

## 🏗️ Getting Started  

> **Note:** The Gemini API is free to use, but your usage data will be shared with Google.  

Follow these steps to set up the project:  

1. Clone the repository:  
   ```sh
   git clone https://github.com/imjaydeepvaghela/generative-ai-angular
   ```  

2. Generate an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).  

3. Create a `.env` file in the project root and add your API key:  
   ```sh
   GOOGLE_AI_STUDIO_API_KEY=paste-api-key-here
   ```  

4. Install dependencies:  
   ```sh
   npm install
   ```  

5. Start the backend server on port 3000:  
   ```sh
   npm run server
   ```  

6. In a separate terminal, start the Angular dev server on port 4200:  
   ```sh
   npm start
   ```  

7. Open your browser and visit:  
   ```
   http://localhost:4200/
   ```  

## 🔑 Key Takeaways  

### ⚡ State Management with Signals  
Use Angular Signals to track chat state, including message history and LLM processing status.  

### 🔄 Real-time Text Streaming with RxJS  
Leverage RxJS to handle real-time updates from the LLM API, ensuring smooth and dynamic responses.  

### 🔌 Configuring the Angular HTTP Client for Streaming  
1. Enable the HTTP client with fetch in [`app.config.ts`](src/app/app.config.ts):  
   ```typescript
   provideHttpClient(withFetch());
   ```  

2. Configure the HTTP client to observe text events and report progress:  
   ```typescript
   this.http.post('http://localhost:3000/message', prompt, {
     responseType: 'text',
     observe: 'events',
     reportProgress: true,
   });
   ```  

### ✨ Blinking Cursor Effect  
Create a blinking cursor to indicate message generation using CSS animations:  
```scss
.message {
  &.generating {
    &::after {
      content: '▋';
      animation: fade-cursor 500ms ease-in-out infinite alternate;
    }
  }
}

@keyframes fade-cursor {
  from {
    opacity: 25%;
  }
  to {
    opacity: 100%;
  }
}
```  

## 📂 Files to Explore  
- [`message.service.ts`](src/app/message.service.ts)  
- [`app.config.ts`](src/app/app.config.ts)  
- [`server.ts`](src/server.ts)  

This README provides a concise yet detailed overview of the Angular Generative AI Demo, ensuring a smooth setup and understanding of key concepts. 🚀
