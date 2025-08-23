// services/chatbotService.ts

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'wellness-tip';
  metadata?: any;
}

interface ChatbotResponse {
  content: string;
  type?: 'text' | 'suggestion' | 'wellness-tip';
  metadata?: any;
}

class ChatbotService {
  private readonly GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  // Wellness knowledge base for quick responses
  private wellnessKnowledge = {
    'stress management': {
      tips: [
        'Practice deep breathing exercises for 5 minutes daily',
        'Try progressive muscle relaxation before bed',
        'Take short walks during lunch breaks',
        'Use the 4-7-8 breathing technique when overwhelmed'
      ],
      content: 'Stress management is crucial for working mothers. Simple techniques like mindfulness, regular exercise, and setting boundaries can significantly reduce stress levels.'
    },
    'work-life balance': {
      tips: [
        'Set clear boundaries between work and family time',
        'Create a dedicated workspace at home',
        'Use time-blocking to prioritize important tasks',
        'Learn to delegate and say no to non-essential commitments'
      ],
      content: 'Achieving work-life balance requires intentional planning and boundary setting. Remember that balance looks different for everyone.'
    },
    'self-care': {
      tips: [
        'Schedule 15 minutes daily for yourself',
        'Take a warm bath with essential oils',
        'Practice gratitude journaling',
        'Get adequate sleep (7-9 hours per night)'
      ],
      content: 'Self-care isn\'t selfish - it\'s essential. Taking care of yourself allows you to better care for your family and perform at work.'
    },
    'nutrition': {
      tips: [
        'Meal prep on weekends to save time during the week',
        'Keep healthy snacks readily available',
        'Stay hydrated with 8 glasses of water daily',
        'Include protein in every meal for sustained energy'
      ],
      content: 'Good nutrition provides the energy you need to juggle work and family responsibilities. Focus on whole foods and regular meal times.'
    },
    'exercise': {
      tips: [
        'Take stairs instead of elevators when possible',
        'Do bodyweight exercises during TV time',
        'Go for family walks after dinner',
        'Try 10-minute morning yoga routines'
      ],
      content: 'Regular exercise boosts energy, improves mood, and helps manage stress. Even short bursts of activity can make a difference.'
    }
  };

  async sendMessage(message: string, conversationHistory: ChatMessage[]): Promise<ChatbotResponse> {
    try {
      // First, check if it's a simple wellness query we can answer quickly
      const quickResponse = this.getQuickWellnessResponse(message);
      if (quickResponse) {
        return quickResponse;
      }

      // For complex queries, use Gemini AI
      const geminiResponse = await this.queryGeminiAI(message, conversationHistory);
      if (geminiResponse) {
        return geminiResponse;
      }

      // Fallback to predefined responses
      return this.getFallbackResponse(message);
    } catch (error) {
      console.error('Error in chatbot service:', error);
      return this.getErrorResponse();
    }
  }

  private getQuickWellnessResponse(message: string): ChatbotResponse | null {
    const lowerMessage = message.toLowerCase();
    
    // Check for wellness keywords
    for (const [topic, knowledge] of Object.entries(this.wellnessKnowledge)) {
      if (
        lowerMessage.includes(topic) ||
        this.containsRelatedKeywords(
          lowerMessage,
          topic as 'stress management' | 'work-life balance' | 'self-care' | 'nutrition' | 'exercise'
        )
      ) {
        return {
          content: `${knowledge.content}\n\nHere are some practical tips:\n${knowledge.tips.map(tip => `• ${tip}`).join('\n')}`,
          type: 'wellness-tip',
          metadata: {
            topic,
            tags: [topic, 'wellness', 'tips']
          }
        };
      }
    }

    // Quick responses for common questions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        content: 'Hello! I\'m here to help with your wellness journey. You can ask me about stress management, work-life balance, nutrition, exercise, or any other health-related questions. What would you like to know about today?',
        type: 'text'
      };
    }

    if (lowerMessage.includes('thank')) {
      return {
        content: 'You\'re very welcome! Remember, taking care of yourself is one of the best things you can do for your family. Is there anything else I can help you with today?',
        type: 'text'
      };
    }

    return null;
  }

  private async queryGeminiAI(message: string, conversationHistory: ChatMessage[]): Promise<ChatbotResponse | null> {
    if (!this.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured');
      return null;
    }

    try {
      // Build context from conversation history
      const context = conversationHistory
        .slice(-5) // Last 5 messages for context
        .map(msg => `${msg.sender}: ${msg.content}`)
        .join('\n');

      const prompt = `You are a helpful wellness assistant for working mothers. You provide supportive, practical advice about health, work-life balance, parenting, and self-care.

Context from conversation:
${context}

Current question: ${message}

Please provide a helpful, empathetic response focused on wellness and practical tips for working mothers. Keep responses conversational and supportive.`;

      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        return {
          content: generatedText.trim(),
          type: 'text',
          metadata: {
            source: 'gemini-ai',
            tags: this.extractTagsFromMessage(message)
          }
        };
      }
    } catch (error) {
      console.error('Error querying Gemini AI:', error);
    }

    return null;
  }

  private getFallbackResponse(message: string): ChatbotResponse {
    const lowerMessage = message.toLowerCase();
    
    // Categorize the question and provide relevant response
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return {
        content: 'Sleep is crucial for working mothers! Here are some tips for better rest:\n\n• Establish a consistent bedtime routine\n• Limit screen time 1 hour before bed\n• Keep your bedroom cool and dark\n• Try relaxation techniques like deep breathing\n• If possible, take short 20-minute power naps\n\nRemember, adequate sleep helps you be more productive and patient with your family.',
        type: 'wellness-tip',
        metadata: { tags: ['sleep', 'rest', 'energy'] }
      };
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('busy') || lowerMessage.includes('overwhelmed')) {
      return {
        content: 'Feeling overwhelmed is common for working mothers. Here are some time management strategies:\n\n• Use time-blocking to schedule important tasks\n• Batch similar activities together\n• Delegate household tasks when possible\n• Say no to non-essential commitments\n• Focus on progress, not perfection\n\nRemember, you\'re doing an amazing job juggling so many responsibilities!',
        type: 'wellness-tip',
        metadata: { tags: ['time management', 'productivity', 'stress'] }
      };
    }

    // Generic supportive response
    return {
      content: 'I understand you\'re looking for support and guidance. As a working mother, you\'re handling so many responsibilities! While I may not have a specific answer to your question right now, I encourage you to:\n\n• Take things one day at a time\n• Reach out to your support network\n• Consider speaking with a healthcare provider if needed\n• Remember that asking for help is a sign of strength\n\nIs there a specific wellness topic I can help you with instead?',
      type: 'text',
      metadata: { tags: ['support', 'encouragement'] }
    };
  }

  private getErrorResponse(): ChatbotResponse {
    return {
      content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment, or feel free to ask me about wellness topics like stress management, nutrition, exercise, or work-life balance.',
      type: 'text'
    };
  }

  private containsRelatedKeywords(
    message: string,
    topic: 'stress management' | 'work-life balance' | 'self-care' | 'nutrition' | 'exercise'
  ): boolean {
    const keywords: {
      [key in 'stress management' | 'work-life balance' | 'self-care' | 'nutrition' | 'exercise']: string[]
    } = {
      'stress management': ['anxiety', 'overwhelmed', 'pressure', 'tension', 'worried', 'stressed'],
      'work-life balance': ['juggling', 'balance', 'time', 'priorities', 'career', 'family'],
      'self-care': ['me time', 'self care', 'burnout', 'exhausted', 'recharge'],
      'nutrition': ['eating', 'food', 'diet', 'meals', 'healthy', 'energy'],
      'exercise': ['workout', 'fitness', 'active', 'movement', 'physical activity']
    };

    const topicKeywords = keywords[topic] || [];
    return topicKeywords.some(keyword => message.includes(keyword));
  }

  private extractTagsFromMessage(message: string): string[] {
    const tags = [];
    const lowerMessage = message.toLowerCase();

    const topicKeywords = {
      'parenting': ['child', 'kid', 'baby', 'toddler', 'parenting', 'mother', 'mom'],
      'work': ['job', 'career', 'office', 'work', 'professional', 'boss'],
      'health': ['health', 'doctor', 'medical', 'symptoms', 'wellness'],
      'nutrition': ['food', 'eat', 'meal', 'diet', 'nutrition', 'cooking'],
      'exercise': ['exercise', 'workout', 'fitness', 'gym', 'yoga', 'run'],
      'sleep': ['sleep', 'tired', 'rest', 'exhausted', 'insomnia'],
      'stress': ['stress', 'anxiety', 'overwhelmed', 'pressure', 'worried']
    };

    for (const [tag, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        tags.push(tag);
      }
    }

    return tags.length > 0 ? tags : ['general'];
  }

  async generateWellnessTip(): Promise<ChatbotResponse> {
    const tips = [
      'Take 5 deep breaths when you feel overwhelmed - it activates your body\'s relaxation response.',
      'Drink a glass of water first thing in the morning to kickstart your metabolism.',
      'Set a phone alarm for every 2 hours to remind yourself to take a 2-minute stretch break.',
      'Keep a gratitude journal - write down 3 things you\'re grateful for each night.',
      'Use the 2-minute rule: if a task takes less than 2 minutes, do it immediately.',
      'Practice the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.',
      'Prep healthy snacks on Sunday to avoid grabbing unhealthy options during busy weekdays.'
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return {
      content: `💡 Daily Wellness Tip: ${randomTip}`,
      type: 'wellness-tip',
      metadata: { tags: ['daily tip', 'wellness'] }
    };
  }
}

export const chatbotService = new ChatbotService();