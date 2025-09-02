import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/ui/navigation";
import { Send, Bot, User, Loader2, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI nutrition assistant. I can help you with Kenyan recipes, cooking tips, and nutrition guidance. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockResponses: Record<string, string> = {
    "How do I cook ugali?": "To cook ugali:\n\n1. Boil 2 cups of water with a pinch of salt\n2. Gradually add 1½ cups of maize flour while stirring continuously\n3. Stir vigorously to avoid lumps\n4. Cook for 5-7 minutes until thick and smooth\n5. Shape into a mound and serve hot\n\nUgali is perfect with sukuma wiki, nyama choma, or any stew!",
    
    "What are the health benefits of sukuma wiki?": "Sukuma wiki (collard greens) is incredibly nutritious:\n\n• High in Vitamin K for bone health\n• Rich in Vitamin C for immunity\n• Contains folate for cell division\n• Good source of calcium and iron\n• High fiber content aids digestion\n• Low calories, perfect for weight management\n\nIt's one of Kenya's healthiest vegetables - packed with antioxidants!",
    
    "Show me a recipe for githeri": "Here's a delicious Githeri recipe:\n\n**Ingredients:**\n• 1 cup boiled maize\n• 1 cup boiled beans\n• 2 onions, chopped\n• 3 tomatoes, diced\n• 2 cloves garlic\n• Oil, salt, and spices\n\n**Steps:**\n1. Sauté onions until golden\n2. Add garlic and tomatoes\n3. Mix in boiled maize and beans\n4. Season with salt and spices\n5. Simmer for 10 minutes\n\nServe hot - it's a complete protein meal!"
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const response = mockResponses[currentInput] || 
        "I'd love to help you with that! For now, I can answer these specific questions:\n\n• How do I cook ugali?\n• What are the health benefits of sukuma wiki?\n• Show me a recipe for githeri\n\nPlease try one of these questions, or ask something similar about Kenyan cuisine!";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const quickQuestions = [
    "How do I cook ugali?",
    "What are the health benefits of sukuma wiki?",
    "Show me a recipe for githeri"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-hero mb-4">
            <ChefHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI <span className="text-primary">Nutrition</span> Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers about Kenyan recipes, cooking techniques, and nutrition guidance
          </p>
        </div>

        {/* Quick Questions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Try These Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="justify-start h-auto p-4 text-left border-primary/20 hover:bg-primary/5 hover:border-primary/40 font-medium"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-elegant bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Chat with AI Chef
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted/50 rounded-lg px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about recipes, nutrition, or cooking tips..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !inputMessage.trim()}
                  className="gradient-hero hover:shadow-glow transition-smooth"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">💡 Ask about recipes</h3>
              <p className="text-sm text-muted-foreground">
                "How do I make ugali?" or "What ingredients do I need for githeri?"
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">🥗 Nutrition guidance</h3>
              <p className="text-sm text-muted-foreground">
                "How much protein is in sukuma wiki?" or "Is this recipe healthy for children?"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;