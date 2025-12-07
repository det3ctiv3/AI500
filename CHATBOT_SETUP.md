# AI Chatbot Configuration Guide

## Setting Up OpenAI API

### Step 1: Get Your API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy the API key (it starts with `sk-...`)

### Step 2: Add API Key to the Code

Open `assets/js/main.js` and find this line (around line 640):

```javascript
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
```

Replace `'YOUR_OPENAI_API_KEY'` with your actual API key:

```javascript
const OPENAI_API_KEY = 'sk-proj-YOUR_ACTUAL_KEY_HERE';
```

### Step 3: Test the Chatbot

1. Open `index.html` in your browser
2. Click the chatbot button in the bottom right corner (🤖)
3. Type a message like "What is NDVI?"
4. The AI assistant will respond!

---

## Important Security Notes

### ⚠️ API Key Security

**DO NOT:**
- Commit your API key to GitHub
- Share your API key publicly
- Use your API key in production frontend code

**For Production:**
- Move API calls to your backend server
- Store API key as environment variable
- Create a proxy endpoint: `/api/chat` → OpenAI API

### Recommended Production Setup

```
Frontend → Your Backend (/api/chat) → OpenAI API
                ↓
         API Key stored securely
```

---

## Fallback Mode

If OpenAI API is not available or the key is not set, the chatbot will use **rule-based responses** that answer common questions about:
- NDVI and satellite data
- Risk scoring methodology
- How to use the demo
- Data sources
- Pricing and accuracy

---

## API Costs

OpenAI GPT-3.5-turbo pricing:
- **$0.0015 per 1K input tokens**
- **$0.002 per 1K output tokens**

Average chatbot message cost: **~$0.001** (very affordable!)

---

## Customizing the Chatbot

### Change AI Personality

Edit the `systemPrompt` in `assets/js/main.js`:

```javascript
const systemPrompt = `You are a friendly AI assistant for FieldScore AI...`;
```

### Adjust Response Length

Modify `max_tokens` parameter:

```javascript
max_tokens: 250,  // Increase for longer responses
```

### Change Model

Use GPT-4 for better responses (but higher cost):

```javascript
model: 'gpt-4',  // Instead of 'gpt-3.5-turbo'
```

---

## Testing Without API Key

The chatbot works without an API key using fallback responses!

Try these test questions:
- "What is NDVI?"
- "How does the risk score work?"
- "How do I use the demo?"
- "What data sources do you use?"
- "How much does it cost?"

---

## Troubleshooting

### Chatbot not opening?
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

### API key not working?
- Verify key starts with `sk-`
- Check OpenAI account has credits
- Test key at https://platform.openai.com/playground

### CORS errors?
- This is expected in production
- Use backend proxy for API calls
- See "Production Setup" section

---

## Features

✅ Floating button in bottom right corner  
✅ Smooth animations and transitions  
✅ Auto-expanding textarea  
✅ Typing indicator  
✅ OpenAI GPT-3.5 integration  
✅ Fallback rule-based responses  
✅ Mobile responsive design  
✅ Clean, modern UI  

---

**Created:** December 7, 2025  
**Chatbot Model:** OpenAI GPT-3.5-turbo
