-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  steps TEXT[] NOT NULL,
  nutrition JSONB NOT NULL, -- {calories: 400, protein: 9, carbs: 30, fats: 9, vitamins: ['A', 'C', 'K']}
  category TEXT NOT NULL CHECK (category IN ('free', '0-5yrs', 'teenagers', 'youth', 'elderly')),
  dish_type TEXT NOT NULL, -- 'main', 'side', 'snack', 'drink'
  cooking_time INTEGER, -- in minutes
  servings INTEGER DEFAULT 4,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Recipes policies  
CREATE POLICY "Everyone can view free recipes" 
ON public.recipes 
FOR SELECT 
USING (category = 'free');

CREATE POLICY "Premium users can view premium recipes" 
ON public.recipes 
FOR SELECT 
USING (
  category = 'free' OR 
  (category != 'free' AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND subscription_tier = 'premium'
  ))
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'),
    'free'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample Kenyan recipes
INSERT INTO public.recipes (title, ingredients, steps, nutrition, category, dish_type, cooking_time, servings, image_url) VALUES
('Ugali & Sukuma Wiki', 
 ARRAY['2 cups maize flour', '3 cups water', '1 bunch sukuma wiki (kale)', '2 onions', '3 tomatoes', '2 cloves garlic', 'Salt', 'Cooking oil'],
 ARRAY['Boil water in a pot', 'Gradually add maize flour while stirring', 'Cook for 15 minutes stirring continuously', 'In another pan, sauté onions and garlic', 'Add tomatoes and cook until soft', 'Add sukuma wiki and cook for 5 minutes', 'Season with salt', 'Serve ugali with sukuma wiki'],
 '{"calories": 400, "protein": 9, "carbs": 30, "fats": 9, "vitamins": ["A", "C", "K"]}',
 'free', 'main', 30, 4, null),

('Githeri', 
 ARRAY['1 cup maize', '1 cup beans', '2 onions', '3 tomatoes', '2 carrots', 'Salt', 'Cooking oil', 'Water'],
 ARRAY['Soak maize and beans overnight', 'Boil maize and beans until tender', 'In a pan, sauté onions until golden', 'Add tomatoes and cook until soft', 'Add boiled maize and beans', 'Add diced carrots', 'Season with salt and simmer for 10 minutes'],
 '{"calories": 350, "protein": 12, "carbs": 60, "fats": 6, "vitamins": ["B"]}',
 'free', 'main', 90, 6, null),

('Chapati', 
 ARRAY['2 cups all-purpose flour', '1 tsp salt', '2 tbsp oil', '3/4 cup warm water'],
 ARRAY['Mix flour and salt in a bowl', 'Add oil and mix well', 'Gradually add water to form soft dough', 'Knead for 10 minutes until smooth', 'Rest dough for 30 minutes', 'Roll into thin circles', 'Cook on hot pan until golden spots appear', 'Brush with oil and serve warm'],
 '{"calories": 200, "protein": 5, "carbs": 40, "fats": 8, "vitamins": ["B"]}',
 'free', 'side', 45, 8, null),

('Nyama Choma', 
 ARRAY['1 kg beef or goat meat', '2 tsp salt', '1 tsp black pepper', '2 tsp coriander seeds', '1 tsp cumin', '2 onions', 'Lemon juice'],
 ARRAY['Cut meat into medium pieces', 'Season with salt, pepper, and spices', 'Marinate for 2 hours', 'Prepare charcoal fire', 'Grill meat turning occasionally', 'Cook for 45 minutes until well done', 'Serve with sliced onions and lemon'],
 '{"calories": 500, "protein": 45, "carbs": 0, "fats": 30, "vitamins": ["B12", "Iron"]}',
 'free', 'main', 60, 4, null),

('Pilau', 
 ARRAY['2 cups basmati rice', '500g beef', '2 onions', '4 cloves garlic', '1 inch ginger', 'Pilau masala', 'Cinnamon stick', 'Cardamom', 'Cloves', 'Bay leaves', 'Salt', 'Oil'],
 ARRAY['Soak rice for 30 minutes', 'Brown meat with onions', 'Add garlic, ginger, and spices', 'Add rice and stir gently', 'Add hot water (ratio 1:2)', 'Bring to boil then simmer covered', 'Cook for 20 minutes until rice is tender', 'Let it rest for 10 minutes before serving'],
 '{"calories": 450, "protein": 25, "carbs": 55, "fats": 15, "vitamins": ["B", "Iron"]}',
 'free', 'main', 75, 6, null),

('Mukimo', 
 ARRAY['4 large potatoes', '2 cups green peas', '1 bunch spinach', '2 cups pumpkin leaves', '1 cup maize kernels', 'Salt', '2 tbsp cooking fat'],
 ARRAY['Boil potatoes until tender', 'Steam green peas and maize separately', 'Blanch spinach and pumpkin leaves', 'Mash potatoes with cooking fat', 'Mix in all vegetables', 'Season with salt', 'Mash everything together until well combined', 'Serve hot as a side dish'],
 '{"calories": 280, "protein": 8, "carbs": 45, "fats": 7, "vitamins": ["A", "C", "K", "Folate"]}',
 'free', 'side', 40, 6, null),

('Samosa', 
 ARRAY['2 cups all-purpose flour', '4 tbsp oil', '1 tsp salt', 'Water', '500g minced meat', '2 onions', '2 tsp garam masala', 'Oil for deep frying'],
 ARRAY['Make dough with flour, oil, salt and water', 'Rest dough for 30 minutes', 'Cook minced meat with onions and spices', 'Roll dough into thin sheets', 'Cut into strips and form triangular pockets', 'Fill with meat mixture and seal edges', 'Deep fry until golden brown', 'Serve hot with chutney'],
 '{"calories": 180, "protein": 8, "carbs": 20, "fats": 12, "vitamins": ["B"]}',
 'free', 'snack', 60, 20, null),

('Mandazi', 
 ARRAY['3 cups all-purpose flour', '1/2 cup sugar', '2 tsp baking powder', '1/2 tsp salt', '1/2 cup coconut milk', '2 eggs', '2 tbsp oil', 'Oil for frying'],
 ARRAY['Mix dry ingredients in a bowl', 'Beat eggs and add coconut milk', 'Combine wet and dry ingredients', 'Knead into soft dough', 'Rest for 1 hour', 'Roll and cut into triangles', 'Deep fry until golden brown', 'Drain on paper towels and serve'],
 '{"calories": 220, "protein": 6, "carbs": 35, "fats": 8, "vitamins": ["B", "E"]}',
 'free', 'snack', 90, 12, null),

('Chai ya Tangawizi', 
 ARRAY['4 cups water', '4 cups milk', '4 tsp black tea leaves', '2 inch ginger piece', '4 tsp sugar', '2 cardamom pods', '1 cinnamon stick'],
 ARRAY['Crush ginger and spices', 'Boil water with ginger and spices', 'Add tea leaves and boil for 2 minutes', 'Add milk and sugar', 'Simmer for 5 minutes', 'Strain and serve hot'],
 '{"calories": 120, "protein": 6, "carbs": 15, "fats": 4, "vitamins": ["Calcium", "Antioxidants"]}',
 'free', 'drink', 15, 4, null),

('Coconut Rice', 
 ARRAY['2 cups basmati rice', '1 can coconut milk', '2 cups water', '1 tsp salt', '2 tbsp sugar', '1 cinnamon stick', '3 cardamom pods', '2 cloves'],
 ARRAY['Wash and soak rice for 30 minutes', 'In a pot, combine coconut milk and water', 'Add salt, sugar, and whole spices', 'Bring to boil and add rice', 'Cover and simmer for 18 minutes', 'Let it rest for 10 minutes', 'Fluff with fork and serve'],
 '{"calories": 320, "protein": 6, "carbs": 50, "fats": 12, "vitamins": ["Manganese", "Selenium"]}',
 'free', 'side', 35, 6, null),

-- Premium recipes for different age groups
('Baby Porridge (6-12 months)', 
 ARRAY['1/2 cup millet flour', '2 cups water', '1/2 cup milk', '1 tbsp honey', '1 mashed banana'],
 ARRAY['Mix millet flour with a little water to form paste', 'Boil remaining water', 'Add millet paste and stir continuously', 'Cook for 15 minutes until thick', 'Add milk and mashed banana', 'Sweeten with honey', 'Cool before serving'],
 '{"calories": 150, "protein": 5, "carbs": 25, "fats": 3, "vitamins": ["Iron", "Calcium", "B6"]}',
 '0-5yrs', 'main', 25, 2, null),

('Teen Power Smoothie', 
 ARRAY['1 banana', '1 cup milk', '2 tbsp peanut butter', '1 tbsp honey', '1/2 cup oats', '1 tsp chia seeds'],
 ARRAY['Blend banana with milk until smooth', 'Add peanut butter and honey', 'Add oats and chia seeds', 'Blend until creamy', 'Serve immediately', 'Great for breakfast or post-workout'],
 '{"calories": 380, "protein": 15, "carbs": 45, "fats": 18, "vitamins": ["Protein", "Fiber", "Omega-3"]}',
 'teenagers', 'drink', 5, 1, null),

('Youth Energy Bowl', 
 ARRAY['1 cup quinoa', '1 avocado', '2 boiled eggs', '1 cup spinach', '1/2 cup cherry tomatoes', '2 tbsp olive oil', 'Lemon juice', 'Salt', 'Pepper'],
 ARRAY['Cook quinoa according to package instructions', 'Slice avocado and halve cherry tomatoes', 'Arrange quinoa in a bowl', 'Top with spinach, avocado, eggs, and tomatoes', 'Drizzle with olive oil and lemon juice', 'Season with salt and pepper', 'Perfect for busy young professionals'],
 '{"calories": 520, "protein": 20, "carbs": 45, "fats": 28, "vitamins": ["Complete proteins", "Healthy fats", "Folate"]}',
 'youth', 'main', 20, 1, null),

('Elderly Soft Fish Stew', 
 ARRAY['500g white fish fillets', '2 sweet potatoes', '1 cup spinach', '1 onion', '2 tomatoes', '1 tsp turmeric', 'Ginger', 'Garlic', 'Low sodium broth'],
 ARRAY['Cut fish into small pieces', 'Cube sweet potatoes and boil until tender', 'Sauté onion, ginger, and garlic', 'Add tomatoes and cook until soft', 'Add fish and turmeric', 'Add sweet potatoes and spinach', 'Simmer gently for 10 minutes', 'Easy to chew and digest'],
 '{"calories": 280, "protein": 28, "carbs": 25, "fats": 8, "vitamins": ["Omega-3", "Beta-carotene", "B12"]}',
 'elderly', 'main', 35, 4, null);