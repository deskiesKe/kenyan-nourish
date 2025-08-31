import { Clock, Users, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  nutrition: any; // Using any to handle Json type from Supabase
  category: string;
  dish_type: string;
  cooking_time?: number;
  servings?: number;
  image_url?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  isPremium?: boolean;
  onViewDetails: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, isPremium = false, onViewDetails }: RecipeCardProps) => {
  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-elegant transition-smooth cursor-pointer bg-gradient-card border-border/50">
      <div 
        className="aspect-video bg-gradient-accent relative overflow-hidden"
        onClick={() => onViewDetails(recipe)}
      >
        {recipe.image_url ? (
          <img 
            src={recipe.image_url} 
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full gradient-accent flex items-center justify-center">
            <div className="text-4xl text-accent-foreground/80">🍽️</div>
          </div>
        )}
        {isPremium && (
          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground border-0">
            <Star className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-foreground leading-tight group-hover:text-primary transition-smooth">
            {recipe.title}
          </h3>
          <Badge variant="secondary" className="ml-2 shrink-0 capitalize">
            {recipe.dish_type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {recipe.cooking_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cooking_time}min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Nutrition (per serving)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 px-2 py-1 rounded-md">
                <span className="font-medium">{recipe.nutrition.calories}</span> kcal
              </div>
              <div className="bg-muted/50 px-2 py-1 rounded-md">
                <span className="font-medium">{recipe.nutrition.protein}g</span> protein
              </div>
              <div className="bg-muted/50 px-2 py-1 rounded-md">
                <span className="font-medium">{recipe.nutrition.carbs}g</span> carbs
              </div>
              <div className="bg-muted/50 px-2 py-1 rounded-md">
                <span className="font-medium">{recipe.nutrition.fats}g</span> fats
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Key Vitamins</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.nutrition.vitamins.slice(0, 3).map((vitamin, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {vitamin}
                </Badge>
              ))}
              {recipe.nutrition.vitamins.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.nutrition.vitamins.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          onClick={() => onViewDetails(recipe)}
          className="w-full gradient-hero hover:shadow-glow transition-smooth"
          size="sm"
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;