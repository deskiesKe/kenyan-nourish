import { useState, useEffect } from "react";
import { Search, Filter, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import RecipeCard from "@/components/RecipeCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dishTypeFilter, setDishTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, dishTypeFilter]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('category', 'free')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (dishTypeFilter !== "all") {
      filtered = filtered.filter(recipe => recipe.dish_type === dishTypeFilter);
    }

    setFilteredRecipes(filtered);
  };

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading delicious recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            <span className="text-primary">Kenyan</span> Recipe Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic Kenyan dishes with detailed nutrition information and cooking instructions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by dish name or ingredient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={dishTypeFilter} onValueChange={setDishTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Dish type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="main">Main Dishes</SelectItem>
                <SelectItem value="side">Side Dishes</SelectItem>
                <SelectItem value="snack">Snacks</SelectItem>
                <SelectItem value="drink">Drinks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </p>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find more recipes.
            </p>
          </div>
        )}

        {/* Recipe Detail Modal */}
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary">
                    {selectedRecipe.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Recipe Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {selectedRecipe.cooking_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{selectedRecipe.cooking_time} minutes</span>
                      </div>
                    )}
                    {selectedRecipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedRecipe.servings} servings</span>
                      </div>
                    )}
                    <Badge variant="secondary" className="capitalize">
                      {selectedRecipe.dish_type}
                    </Badge>
                  </div>

                  {/* Ingredients */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Ingredients</h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Instructions */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Instructions</h3>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {selectedRecipe.steps.map((step, index) => (
                          <li key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <p className="text-sm leading-relaxed">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  {/* Nutrition Info */}
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Nutrition Information (per serving)</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {selectedRecipe.nutrition.calories}
                          </div>
                          <div className="text-sm text-muted-foreground">Calories</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {selectedRecipe.nutrition.protein}g
                          </div>
                          <div className="text-sm text-muted-foreground">Protein</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {selectedRecipe.nutrition.carbs}g
                          </div>
                          <div className="text-sm text-muted-foreground">Carbs</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {selectedRecipe.nutrition.fats}g
                          </div>
                          <div className="text-sm text-muted-foreground">Fats</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Vitamins & Minerals</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecipe.nutrition.vitamins.map((vitamin, index) => (
                            <Badge key={index} variant="outline">
                              {vitamin}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Recipes;