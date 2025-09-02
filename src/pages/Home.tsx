import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/ui/navigation";
import { ChefHat, MessageSquare, Crown, Search, Utensils, Heart } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const features = [
    {
      icon: <ChefHat className="h-6 w-6" />,
      title: "Authentic Kenyan Recipes",
      description: "Discover traditional and modern Kenyan dishes with detailed cooking instructions and ingredient lists.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "AI Nutrition Chatbot",
      description: "Get instant answers about recipes, cooking tips, and nutrition guidance from our smart assistant.",
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: "Age-Specific Nutrition",
      description: "Premium recipes tailored for different age groups - from babies to elderly, with specialized nutrition.",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Recipe Search",
      description: "Find recipes by ingredients, dish type, cooking time, or dietary preferences.",
    },
  ];

  const popularRecipes = [
    { name: "Ugali & Sukuma Wiki", time: "30 min", calories: "400 kcal" },
    { name: "Githeri", time: "90 min", calories: "350 kcal" },
    { name: "Nyama Choma", time: "60 min", calories: "500 kcal" },
    { name: "Pilau", time: "75 min", calories: "450 kcal" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="absolute top-10 left-10 animate-float">
          <div className="text-4xl">🥕</div>
        </div>
        <div className="absolute top-20 right-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <div className="text-3xl">🍅</div>
        </div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <div className="text-3xl">🌽</div>
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <div className="text-4xl">🥬</div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  <Utensils className="w-3 h-3 mr-1" />
                  Kenyan Recipes & Nutrition
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-primary">Kenyan Recipes</span><br />
                  <span className="gradient-hero bg-clip-text text-transparent">& Nutrition</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Explore authentic Kenyan cuisine with detailed nutrition information, 
                  age-specific meal plans, and AI-powered cooking assistance.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gradient-hero shadow-elegant hover:shadow-glow transition-smooth">
                  <Link to="/recipes">
                    <ChefHat className="w-5 h-5 mr-2" />
                    Explore Recipes
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                  <Link to="/chatbot">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Ask AI Chef
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Kenyan Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant">
                <img 
                  src={heroImage} 
                  alt="Kenyan food ingredients and dishes" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-background p-4 rounded-xl shadow-card border">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Healthy & Nutritious</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">Nutriflavour</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your complete companion for Kenyan cuisine with modern nutrition science
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth bg-gradient-card border-border/50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-hero text-primary-foreground">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Popular <span className="text-primary">Recipes</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Most loved Kenyan dishes by our community
              </p>
            </div>
            <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/5">
              <Link to="/recipes">View All</Link>
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRecipes.map((recipe, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth cursor-pointer bg-gradient-card border-border/50 group">
                <CardContent className="p-6">
                  <div className="aspect-square bg-gradient-accent rounded-lg mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-smooth">
                    🍽️
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{recipe.time}</span>
                    <span>{recipe.calories}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers exploring authentic Kenyan recipes with 
            personalized nutrition guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-background hover:bg-background/90">
              <Link to="/signup">
                Get Started Free
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-yellow-500 hover:bg-primary-foreground/10">
              <Link to="/premium">
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;