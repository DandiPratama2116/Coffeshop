export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  subCategory?: string;
  originalPrice?: number;
}

export const MENU_CATEGORIES = [
  { id: 'Coffee', label: 'Coffee', shortLabel: 'Coffee' },
  { id: 'Non-Coffee', label: 'Non-Coffee', shortLabel: 'Non-Coffee' },
  { id: 'Mocktails & Juice', label: 'Mocktails & Juice', shortLabel: 'Mocktails' },
  { id: 'Food', label: 'Food', shortLabel: 'Food' },
  { id: 'Snacks', label: 'Snacks', shortLabel: 'Snacks' },
  { id: 'Pastry & Dessert', label: 'Pastry & Dessert', shortLabel: 'Pastry' }
];

export const MENU_ITEMS: MenuItem[] = [
  // Page 2: Basic Coffee
  { id: 'c1', name: 'Black', description: 'Americano/Long black. Using Our Special Blend Espresso.', price: 25000, image: '/assets/Menu/BlackCoffe.jpeg', category: 'Coffee', subCategory: 'Basic Coffee' },
  { id: 'c2', name: 'White', description: 'Latte/Cappucino/Magic. Using Our Special Blend Espresso', price: 32000, image: '/assets/Menu/whitecoffe.jpeg', category: 'Coffee', subCategory: 'Basic Coffee' },
  { id: 'c3', name: 'Traditional/Vietnam Drip', description: 'Traditional coffee its unique flavor that combines the boldness of black coffee with the creamy sweetness of condensed milk.', price: 25000, image: '/assets/Menu/Vietnamese Coffee.jpeg', category: 'Coffee', subCategory: 'Basic Coffee' },
  // Page 3: Sweet Edition
  { id: 'c4', name: 'Sweet & Cream', description: 'Sweet and rich flavor profile, combining the boldness of espresso with the creamy smoothness of fresh milk. Finished with vanilla ice cream and granola.', price: 37000, image: '/assets/Menu/Sweet&Cream.jpeg', category: 'Coffee', subCategory: 'Sweet Edition' },
  { id: 'c5', name: 'Affogato', description: 'A perfect blend of hot and cold—smooth espresso poured over a scoop of creamy vanilla ice cream.', price: 30000, image: '/assets/Menu/Tiramisu latte.jpeg', category: 'Coffee', subCategory: 'Sweet Edition' },
  { id: 'c6', name: 'Biscoffgato', description: 'A rich fusion of pure chocolate and creamy vanilla ice cream, topped with crunchy granola for added texture.', price: 37000, image: '/assets/Menu/Lotus Biscoff Croissant.jpeg', category: 'Coffee', subCategory: 'Sweet Edition' },
  { id: 'c7', name: 'Matchagato', description: 'Earthy, smooth matcha meets creamy vanilla ice cream in this refreshing dessert.', price: 35000, image: '/assets/Menu/matchagato.jpeg', category: 'Coffee', subCategory: 'Sweet Edition' },
  // Page 4: Taste of Coffee Shop
  { id: 'c8', name: 'Black & White', description: 'Combination Between our special Marry Blend Espresso with Indonesian Palm Sugar and Creamy Fresh Milk.', price: 30000, image: '/assets/Menu/coffeblack&white.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c9', name: 'Spanish Ice Coffee', description: 'Combination of Condensed Milk and Regular Milk with Our Special Marry Blend Espresso.', price: 30000, image: '/assets/Menu/SpanishIceCoffee.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c10', name: 'Cafe Mocha', description: 'Sweet and Bitter Our Special Marry Blend Espresso with Holland Chocolate and Fresh Milk.', price: 38000, image: '/assets/Menu/Cafe Mocha.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c11', name: 'Sweet Cinnamon Latte', description: 'A Sweet and Woody Flavour of Cinnamon Combine with Our Special Marry Blend Espresso and Fresh Milk.', price: 37000, image: '/assets/Menu/Sweet Cinnamon Latte.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c12', name: 'ButterScotch', description: 'Soft, Rich and Sweet Butterscotch Extract Combine with Our Special Marry Blend Espresso and Fresh Milk.', price: 35000, image: '/assets/Menu/Butterscotch coffee.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c13', name: 'Salted Caramel Cheese Latte', description: 'A silky blend of espresso and steamed milk infused, salted caramel, cheese cream.', price: 38000, image: '/assets/Menu/Iced Caramel Macchiato.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c14', name: 'Black & Berry', description: 'Made with a Shot of Espresso, Combine with Lemon and Strawberry, Soda on It and All Perfect.', price: 35000, image: '/assets/Menu/Black&Berry.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c15', name: 'Blucoffee', description: 'Mix of blueberry puree and black coffee—bright, fruity, and refreshingly unique.', price: 35000, image: '/assets/Menu/Blucoffee.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  { id: 'c16', name: 'Cheese Tiramisu Coffee', description: 'Combines chocolate, coffee, milk, and tiramisu sauce in one delicious cup. Topped with a smooth layer of cream cheese.', price: 38000, image: '/assets/Menu/Tiramisu latte.jpeg', category: 'Coffee', subCategory: 'Taste of Coffee Shop' },
  // Page 5: Barista Choice
  { id: 'c17', name: 'Magic', description: 'A harmonious blend of espresso and silky milk. Gentle coffee notes meet a creamy texture.', price: 32000, image: '/assets/Menu/CoffeMagic.jpeg', category: 'Coffee', subCategory: 'Barista Choice' },
  { id: 'c18', name: 'Dirty Latte', description: 'A balanced blend of rich espresso and chilled milk featuring bold coffee notes, a velvety mouthfeel.', price: 36000, image: '/assets/Menu/Iced Dirty Chai Latte.jpeg', category: 'Coffee', subCategory: 'Barista Choice' },
  { id: 'c19', name: 'Mont Blanc', description: 'A refreshing blend of cold brew, fresh orange, and silky milk. Bright citrus notes complement the coffee\'s richness.', price: 38000, image: '/assets/Menu/Mont Blanc.jpeg', category: 'Coffee', subCategory: 'Barista Choice' },
  { id: 'c20', name: 'Manual Brew', description: 'A more personal and precise way to enjoy coffee. Brewed using methods like the Origami Dripper.', price: 35000, image: '/assets/Menu/Manual Brew.jpeg', category: 'Coffee', subCategory: 'Barista Choice' },

  // Page 6: Non-Coffee
  { id: 'nc1', name: 'Jasmine Tea', description: 'Hot/Cold Tea', price: 20000, image: '/assets/Menu/JasmineTea.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc2', name: 'Peach Tea', description: 'Hot/Cold Tea', price: 20000, image: '/assets/Menu/Peach Tea.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc3', name: 'Earl Grey', description: 'Hot/Cold Tea', price: 20000, image: '/assets/Menu/Earl Grey.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc4', name: 'Lemon Tea', description: 'Hot/Cold Tea', price: 28000, image: '/assets/Menu/Lemon Tea.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc5', name: 'Lychee Tea', description: 'Hot/Cold Tea', price: 28000, image: '/assets/Menu/Summer Lychee.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc6', name: 'Lemongrass Tea', description: 'Hot/Cold Tea', price: 29000, image: '/assets/Menu/Lemongrass Iced tea.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc7', name: 'Japanese Matcha', description: 'Hot/Cold Milk Base', price: 34000, image: '/assets/Menu/Iced matcha.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc8', name: 'Red Velvet', description: 'Hot/Cold Milk Base', price: 34000, image: '/assets/Menu/Red velvet.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc9', name: 'Chocolate', description: 'Hot/Cold Milk Base', price: 34000, image: '/assets/Menu/Chocolate.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc10', name: 'Charcoal', description: 'Hot/Cold Milk Base', price: 34000, image: '/assets/Menu/Charcoal.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  { id: 'nc11', name: 'Matcha Special', description: 'Cold Milk Base', price: 39000, image: '/assets/Menu/Matcha Special.jpeg', category: 'Non-Coffee', subCategory: 'Non-Coffee' },
  
  // Page 8: Matcha Series
  { id: 'nc12', name: 'Usucha', description: 'A traditional Japanese matcha prepared in its purest form.', price: 33000, image: '/assets/Menu/Usucha.jpeg', category: 'Non-Coffee', subCategory: 'Matcha Series' },
  { id: 'nc13', name: 'Matcha Latte', description: 'Nice Smooth Texture and Creamy from Our Premium Japanese Matcha.', price: 38000, image: '/assets/Menu/Matcha Latte.jpeg', category: 'Non-Coffee', subCategory: 'Matcha Series' },
  { id: 'nc14', name: 'Coco Breeze Matcha', description: 'Earthy matcha layered with chilled coconut water for a light, refreshing sip.', price: 42000, image: '/assets/Menu/Coco Breeze Matcha.jpeg', category: 'Non-Coffee', subCategory: 'Matcha Series' },
  { id: 'nc15', name: 'Pistachio Matcha', description: 'The nutty richness of the pistachio perfectly balances the vibrant bitterness of the matcha.', price: 55000, image: '/assets/Menu/MatchaPistachio.jpeg', category: 'Non-Coffee', subCategory: 'Matcha Series' },
  { id: 'nc16', name: 'Rosecha', description: 'Premium Japanese matcha, gently whisked with fresh milk, and finished with soft cream mixed with rose liquid.', price: 45000, image: '/assets/Menu/Rosecha.jpeg', category: 'Non-Coffee', subCategory: 'Matcha Series' },
  { id: 'nc17', name: 'Pink Cloud Matcha', description: 'Sweet and tangy strawberry layered with milk and premium matcha, topped with silky strawberry cream foam.', price: 55000, image: '/assets/Menu/Pink Cloud Matcha.jpeg', category: 'Non-Coffee', subCategory: 'Matcha Series' },
  { id: 'nc18', name: 'Matcha Gato', description: 'Earthy, smooth matcha meets creamy vanilla ice cream in this refreshing dessert.', price: 35000, image: '/assets/Menu/matchagato.jpeg', category: 'Non-Coffee', subCategory: 'Matcha Series' },

  // Page 9: Mocktails
  { id: 'm1', name: 'Summer Lychee', description: 'Lychee Extract Combined with Fermented Milk, & Lychee Fruit.', price: 35000, image: '/assets/Menu/Summer Lychee.jpeg', category: 'Mocktails & Juice', subCategory: 'Mocktails' },
  { id: 'm2', name: 'Fruity De Bosco', description: 'Lemon Tea, Mix Berry Extract, & Simple Syrup.', price: 35000, image: '/assets/Menu/Fruity De Bosco.jpeg', category: 'Mocktails & Juice', subCategory: 'Mocktails' },
  { id: 'm3', name: 'Hay Cherry', description: 'Lemon Slice, Cherry Extract with Mint Leaves, & Soda Water.', price: 38000, image: '/assets/Menu/Hay Cherry.jpeg', category: 'Mocktails & Juice', subCategory: 'Mocktails' },
  { id: 'm4', name: 'Mix Berry Mango', description: 'Mix Berry Extract, Mango Puree, Mint, & a Little Bit of Soda Water.', price: 36000, image: '/assets/Menu/Mix Berry Mango.jpeg', category: 'Mocktails & Juice', subCategory: 'Mocktails' },
  { id: 'm5', name: 'Classic Mojito', description: 'Lemon Slices, with Mint Leaves & Soda Water.', price: 35000, image: '/assets/Menu/Classic Mojito.jpeg', category: 'Mocktails & Juice', subCategory: 'Mocktails' },
  { id: 'm6', name: 'Bloody Mary', description: 'Enjoy the Sexy Red of Fruity de Bosco, Butterfly Pea, Completed with Special Sweet Cream', price: 38000, image: '/assets/Menu/Bloody Mary.jpeg', category: 'Mocktails & Juice', subCategory: 'Mocktails' },

  // Page 10: Smoothies & Juice
  { id: 'm7', name: 'Strawberry Smoothies', description: 'Strawberries are Rich in Fibre, Vitamins and Antioxidants.', price: 47000, image: '/assets/Menu/Strawberry Smoothies.jpeg', category: 'Mocktails & Juice', subCategory: 'Smoothies & Juice' },
  { id: 'm8', name: 'Blueberry Smoothies', description: 'Contains Antioxidants, Molecules that Help Destroy Free Radicals.', price: 47000, image: '/assets/Menu/Blueberry Smoothies.jpeg', category: 'Mocktails & Juice', subCategory: 'Smoothies & Juice' },
  { id: 'm9', name: 'Mango', description: 'Tropical Floral Taste, Juicy, Somewhat Stingy, and Sweet with Underlying Hints of Sourness.', price: 38000, image: '/assets/Menu/Mango.jpeg', category: 'Mocktails & Juice', subCategory: 'Smoothies & Juice' },
  { id: 'm10', name: 'Watermelon Refresher', description: 'Freshly Watermelon Juice with Orange and Lemon.', price: 38000, image: '/assets/Menu/Watermelon Refresher.jpeg', category: 'Mocktails & Juice', subCategory: 'Smoothies & Juice' },

  // Page 12: Salad & Burger
  { id: 'f1', name: 'Coffee Shop Burger', description: 'Bun, Beef Patty, Cheese, Onion, BBQ Sauce, Mustard, Fries.', price: 55000, image: '/assets/Menu/Norma`s Burger.jpeg', category: 'Food', subCategory: 'Salad & Burger' },
  { id: 'f2', name: 'Crazy Cheese Burger', description: 'Bun, onion, Double Cheese, Double Beef Patty, Fries and Dried Oregano.', price: 65000, image: '/assets/Menu/Crazy Cheese Burger.jpeg', category: 'Food', subCategory: 'Salad & Burger' },
  { id: 'f3', name: 'Coffee Shop Salad', description: 'Red & Green Lettuce, Grilled Chicken Breast, Carrot, Cherry Tomato, Cucumber, Edamame Corn, Citrus Dressing.', price: 40000, image: '/assets/Menu/Norma Salad.jpeg', category: 'Food', subCategory: 'Salad & Burger' },
  { id: 'f4', name: 'Enoki Salad', description: 'Green Lettuce, Red & Green Paprika, Fried Enoki, with Thai Sweet Chili Sauce.', price: 38000, image: '/assets/Menu/Enoki Salad.jpeg', category: 'Food', subCategory: 'Salad & Burger' },
  { id: 'f5', name: 'Fish & Chips', description: 'Dory fish, Tempura Flour, Fries, Honey Mustard Coleslaw, Lemon Wedges, Mesclun Salad.', price: 40000, image: '/assets/Menu/Fish & Chips.jpeg', category: 'Food', subCategory: 'Salad & Burger' },

  // Page 13-14: Main Course
  { id: 'f6', name: 'Indonesian Fried Rice', description: 'Spices, Herbs, Rice, Sunny Side Up, Diced Local Pickles, Chicken Satai & Emping.', price: 48000, image: '/assets/Menu/Indonesian Fried Rice.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f7', name: 'Spicy Fried Rice with Katsu', description: 'Coffee Shop`s Signature Fried Rice with Sambal Matah, Topped with Chicken Katsu.', price: 48000, image: '/assets/Menu/Spicy Fried Rice with Katsu.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f8', name: 'Nasi Jeruk Ayam Serundeng', description: 'Nasi Daun Jeruk, Chicken Serundeng, Sambal Terasi, Anchovies, Green Lettuce.', price: 45000, image: '/assets/Menu/Nasi Jeruk Ayam Serundeng.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f9', name: 'Nasi Ayam Bawang', description: 'Chicken Fried with Fragrant Garlic, Rice, Cracker, Fried Tofu and Tempe.', price: 46000, image: '/assets/Menu/Nasi Ayam Bawang.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f10', name: 'Iga Bakar Honey Glazed', description: 'Rice, Imported Ribs, Shallot Pickles, Emping Cracker, Fried Onion, Mix Sesame Seed.', price: 85000, image: '/assets/Menu/Iga Bakar Honey Glazed.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f11', name: 'Mee Goreng', description: 'Stir-Fried with Our House-Made Noodles, This Savory Dish Features Diced Chicken.', price: 38000, image: '/assets/Menu/Mee Goreng.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f12', name: 'Tongseng Daging Khas Solo', description: 'Beef Tenderloin with Vegetables such as Cabbage, Garlic, Tomato and Soy Sauce.', price: 70000, image: '/assets/Menu/Tongseng Daging Khas Solo.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f13', name: 'Dori Asam Manis', description: 'Crispy Fried Dory Fillet Served in a Tangy Sweet and Sour Sauce with Bell peppers.', price: 40000, image: '/assets/Menu/Dori Asam Manis.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f14', name: 'Tomyam Goong with Udang Galah', description: 'Authentic and Distinct Hot and Sour Flavours, Shrimp = "Udang Galah".', price: 75000, image: '/assets/Menu/Tomyam Goong with Udang Galah.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f15', name: 'Beef Bulgogi Rice', description: 'Joy in a Bowl Filled with White Rice, Beef Short Plate, Mushroom Champign, Boiled Egg.', price: 50000, image: '/assets/Menu/Beef Bulgogi Rice.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f16', name: 'Chicken Teriyaki', description: 'A Beautiful Tasty White Rice, Chicken Breast, Boiled Egg Completed with Teriyaki Sauce.', price: 45000, image: '/assets/Menu/Chicken Teriyaki.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f17', name: 'Chicken Curry Rice', description: 'Premium Chicken Breast, Homemade Curry Roux, Curry Leaves, Potato, Mushroom, Carrot.', price: 60000, image: '/assets/Menu/Chicken Curry Rice.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f18', name: 'Aglio E Olio Piccante', description: 'Spaghetti, Garlic Chili Oil, Chili Flakes, Chicken Katsu, Parmesan Cheese, Parsley.', price: 55000, image: '/assets/Menu/Aglio E Olio Piccante.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f19', name: 'Spaghetti Bolognese', description: 'Spaghetti, Signature Sauce, Tomato Cherry, Parmesan Cheese, Baked Baugette, Oregano.', price: 50000, image: '/assets/Menu/Spaghetti Bolognese.jpeg', category: 'Food', subCategory: 'Main Course' },
  { id: 'f20', name: 'Spaghetti Carbonara', description: 'Spaghetti, Smoked Beef, Creamy Sauce, Baked Baugette, Parmesan Cheese, Parsley.', price: 52000, image: '/assets/Menu/Spaghetti Carbonara.jpeg', category: 'Food', subCategory: 'Main Course' },

  // Page 16: Noodle Edition
  { id: 'f21', name: 'Chili Oil Noodle', description: 'Artisan Noodles in Authentic Chili Oil with Crispy Wontons, Minced Chicken.', price: 43000, image: '/assets/Menu/Chili Oil Noodle.jpeg', category: 'Food', subCategory: 'Noodle Edition' },
  { id: 'f22', name: 'Spicy Noodle', description: 'Artisan Noodles in a Creamy Chili Sauce with Crispy Wontons, Minced Chicken.', price: 45000, image: '/assets/Menu/Spicy Noodle.jpeg', category: 'Food', subCategory: 'Noodle Edition' },
  { id: 'f23', name: 'Garlic Chicken Noodle', description: 'Slow-Cooked Homemade Broth Seasoned with a Variety of Indonesian Spices.', price: 50000, image: '/assets/Menu/Garlic Chicken Noodle.jpeg', category: 'Food', subCategory: 'Noodle Edition' },

  // Page 17: Neapolitan Pizza
  { id: 'f24', name: 'Margheritta', description: 'Tomato Sauce, Basil, Parmesan & Mozarella.', price: 83000, image: '/assets/Menu/Margheritta.jpeg', category: 'Food', subCategory: 'Neapolitan Pizza' },
  { id: 'f25', name: 'Garlic Shrimp Cheese', description: 'Shrimp, Cheese Sauce, Mozarella, Garlic, Parmesan Lemon.', price: 95000, image: '/assets/Menu/Garlic Shrimp Cheese.jpeg', category: 'Food', subCategory: 'Neapolitan Pizza' },
  { id: 'f26', name: 'Pepperoni', description: 'Beef Pepperoni, Mozarella. Tomato Sauce & Parmesan.', price: 95000, image: '/assets/Menu/Pepperoni.jpeg', category: 'Food', subCategory: 'Neapolitan Pizza' },
  { id: 'f27', name: 'Meat Champ', description: 'Brown Seat Ground Beef, Mozarella, Tomato Sauce & Parmesan.', price: 95000, image: '/assets/Menu/Meat Champ.jpeg', category: 'Food', subCategory: 'Neapolitan Pizza' },
  { id: 'f28', name: 'Mushroom Alfreddo', description: 'Mushroom, Ground Beef, Parmesan Cheese and Alfreddo Sauce.', price: 105000, image: '/assets/Menu/Mushroom Alfreddo.jpeg', category: 'Food', subCategory: 'Neapolitan Pizza' },
  { id: 'f29', name: 'Say Cheese', description: 'Cheese Sauce, Cheese Slice, Parmesan, Pistachio, Raisin, Mozarella, Topped with Rosemary.', price: 110000, image: '/assets/Menu/Say Cheese.jpeg', category: 'Food', subCategory: 'Neapolitan Pizza' },
  { id: 'f30', name: 'Calzone', description: 'A Circular Piece of Pizza Folded in Half, Fill with Alfreddo Sauce, Smoke Beef, Spinach.', price: 95000, image: '/assets/Menu/Calzone.jpeg', category: 'Food', subCategory: 'Neapolitan Pizza' },

  // Page 18-19: Sushi Club
  { id: 'f31', name: 'Kyoto Roll', description: 'Rice Roll with Shrimp, Tamago, Avocado and Kyuri, Topped with Salmon Slice And Spicy Mayo.', price: 40000, image: '/assets/Menu/Kyoto Roll.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f32', name: 'Geisha Fire Roll', description: 'Rice Roll with Crispy Crab Stick, Kyuri, Tamago, Topped with Salmon Slice, Cheese Sauce.', price: 48000, image: '/assets/Menu/Salmon Mentai Aburi.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f33', name: 'Kimono Roll', description: 'Rice Roll with Crab Stick, Tamago, Avocado and Kyuri, Topped with Salmon Slice And Spicy Mayo.', price: 46000, image: '/assets/Menu/Kimono Roll.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f34', name: 'Dragon Roll', description: 'Rice Roll with Crispy Shrimp, Crab Stick, Short Plate, Kyuri, Topped with Avocado Slice.', price: 50000, image: '/assets/Menu/Dragon Roll.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f35', name: 'N+ Sushi', description: 'Tamago, Kyuri and Kani Aburi Sushi Roll. Topped with Salmon, Mayo and Tobiko.', price: 50000, image: '/assets/Menu/N+ Sushi.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f36', name: 'Tobiko Kani Mayo', description: 'Chopped Kani with Mayo Served with Tobiko.', price: 32000, image: '/assets/Menu/Tobiko Kani Mayo.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f37', name: 'Salmon Mentai Aburi', description: 'Crabstick, Avocado, Kyuri sushi roll Topped with Salmon and Mentai Sauce.', price: 44000, image: '/assets/Menu/Salmon Mentai Aburi.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f38', name: 'Avocado Cheese Roll', description: 'Avocado, Kyuri Sushi Roll Topped with Cheese Sauce and Tobiko.', price: 35000, image: '/assets/Menu/Avocado Cheese Roll.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f39', name: 'Abon Katsu Roll', description: 'Chicken Katsu, Kyuri, and Soun with Beef Abon.', price: 48000, image: '/assets/Menu/Abon Katsu Roll.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f40', name: 'Spicy Salmon Tanuki', description: 'Fried Sushi Fill with Spicy Salmon, Kani, Tanuki, Kyuri and Spicy Mayo sauce.', price: 48000, image: '/assets/Menu/Spicy Salmon Tanuki.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f41', name: 'Spicy Salmon Crispy', description: 'Fried Sushi Fill with Spicy Salmon, Tanuki, Tobiko and Spicy Mentai.', price: 47000, image: '/assets/Menu/Spicy Salmon Crispy.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f42', name: 'Osaka Roll', description: 'Crabstick Sushi Roll, Served with Salmon and Mentai Sauce.', price: 45000, image: '/assets/Menu/Osaka Roll.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f43', name: 'Tamago Nigiri & Kani Mayo Nigiri', description: 'Nigiri set.', price: 39000, image: '/assets/Menu/Tamago Nigiri & Kani Mayo Nigiri.jpeg', category: 'Food', subCategory: 'Sushi Club' },
  { id: 'f44', name: 'Salmon Mentai Nigiri & Salmon Belly Nigiri', description: 'Nigiri set.', price: 45000, image: '/assets/Menu/Salmon Mentai Nigiri & Salmon Belly Nigiri.jpeg', category: 'Food', subCategory: 'Sushi Club' },

  // Page 20: Easy Bites
  { id: 's1', name: 'French Fries', description: 'Classic shoestring fries.', price: 28000, image: '/assets/Menu/French Fries.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's2', name: 'Street Cheesy Fries', description: 'Fries with cheese sauce.', price: 32000, image: '/assets/Menu/Street Cheesy Fries.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's3', name: 'Fried Banana', description: 'Sweet fried banana.', price: 30000, image: '/assets/Menu/Fried Banana.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's4', name: 'Chicken Spring Roll', description: 'Crispy spring rolls filled with chicken.', price: 35000, image: '/assets/Menu/Chicken Spring Roll.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's5', name: 'Coffee Shop Nachos', description: 'Crispy nachos with toppings.', price: 43000, image: '/assets/Menu/Norma Nachos.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's6', name: 'Spicy Tofu', description: 'Fried tofu with spicy seasoning.', price: 27000, image: '/assets/Menu/Spicy Tofu.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's7', name: 'Tempe Mendoan', description: 'Traditional battered fried tempeh.', price: 30000, image: '/assets/Menu/Tempe Mendoan.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's8', name: 'Ubi Goreng', description: 'Sweet potato fries.', price: 28000, image: '/assets/Menu/Ubi Goreng.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's9', name: 'Crunchy Enoki', description: 'Deep fried crispy enoki mushrooms.', price: 28000, image: '/assets/Menu/Crunchy Enoki.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's10', name: 'Lousiana Chicken Wings', description: 'Spicy Lousiana style chicken wings.', price: 35000, image: '/assets/Menu/Lousiana Chicken Wings.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's11', name: 'Smoke BBQ Wings', description: 'BBQ glazed chicken wings.', price: 40000, image: '/assets/Menu/Smoke BBQ Wings.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },
  { id: 's12', name: 'Half Boiled Egg', description: 'Perfectly soft boiled eggs.', price: 15000, image: '/assets/Menu/Half Boiled Egg.jpeg', category: 'Snacks', subCategory: 'Easy Bites' },

  // Page 21: Dimsum Series
  { id: 's13', name: 'Original Dimsum', description: 'Classic dimsum with quality ingredients.', price: 30000, image: '/assets/Menu/Original Dimsum.jpeg', category: 'Snacks', subCategory: 'Dimsum Series' },
  { id: 's14', name: 'Nori Dimsum', description: 'Savory Nori wrapped dimsum.', price: 30000, image: '/assets/Menu/Nori Dimsum.jpeg', category: 'Snacks', subCategory: 'Dimsum Series' },
  { id: 's15', name: 'Mozarella Dimsum', description: 'Dimsum filled with rich Mozarella.', price: 32000, image: '/assets/Menu/Mozarella Dimsum.jpeg', category: 'Snacks', subCategory: 'Dimsum Series' },
  { id: 's16', name: 'Chilli Oil Dimsum', description: 'Dimsum served with bold Chili Oil.', price: 35000, image: '/assets/Menu/Chilli Oil Dimsum.jpeg', category: 'Snacks', subCategory: 'Dimsum Series' },

  // Page 22: Cookies Series
  { id: 'p1', name: 'Choco Tiramisu Cookies', description: 'A Perfect harmony of Rich Milk Chocolate Cookies, Silky Tiramisu Sauce.', price: 25000, image: '/assets/Menu/Choco Tiramisu Cookies.jpeg', category: 'Pastry & Dessert', subCategory: 'Cookies Series' },
  { id: 'p2', name: 'Redvelvet Nutella Cookies', description: 'Soft and Classic Red Velvet Cookies with luscious Nutella filled center.', price: 27000, image: '/assets/Menu/Redvelvet Nutella Cookies.jpeg', category: 'Pastry & Dessert', subCategory: 'Cookies Series' },
  { id: 'p3', name: 'Choco Almond Cookies', description: 'Buttery cookies loaded with Crunchy Almonds and Dark chocolate.', price: 25000, image: '/assets/Menu/Choco Almond Cookies.jpeg', category: 'Pastry & Dessert', subCategory: 'Cookies Series' },
  { id: 'p4', name: 'Double Matcha Cookies', description: 'Infused, and layered with matcha, this buttery cookie blends premium Japanese matcha.', price: 30000, image: '/assets/Menu/Double Matcha Cookies.jpeg', category: 'Pastry & Dessert', subCategory: 'Cookies Series' },

  // Page 23: Croissant
  { id: 'p5', name: 'Omelette Croissant', description: 'French Butter Croissant, Omelette, Signature Sauce and Dip Sweet Mayo.', price: 49000, image: '/assets/Menu/Omelette Croissant.jpeg', category: 'Pastry & Dessert', subCategory: 'Croissant' },
  { id: 'p6', name: 'Matcha Croissant', description: 'Very Crispy Croissant and the Characteristic Slightly Bitter Taste of Matcha.', price: 35000, image: '/assets/Menu/Matcha Croissant.jpeg', category: 'Pastry & Dessert', subCategory: 'Croissant' },
  { id: 'p7', name: 'Lotus Biscoff Croissant', description: 'Light, Flaky, and Delicately Sweet with Lotus Biscoff Biscuit.', price: 32000, image: '/assets/Menu/Lotus Biscoff Croissant.jpeg', category: 'Pastry & Dessert', subCategory: 'Croissant' },
  { id: 'p8', name: 'Almond Croissant', description: 'Soft Buttery Dough, Flaky Crust, Nutty Sweetness From Homemade Almond Cream.', price: 30000, image: '/assets/Menu/Almond Croissant.jpeg', category: 'Pastry & Dessert', subCategory: 'Croissant' },
  { id: 'p9', name: 'Butter Croissant', description: 'Flaky, Buttery and Smells a Good Taste of Butter Inside.', price: 24000, image: '/assets/Menu/Butter Croissant.jpeg', category: 'Pastry & Dessert', subCategory: 'Croissant' },

  // Page 24: Donut
  { id: 'p10', name: 'White Chocolate Red Velvet', description: 'Combination of the Sweet from Homemade White Chocolate Sauce, and Red Velvet Scrambled.', price: 15000, image: '/assets/Menu/White Chocolate Red Velvet.jpeg', category: 'Pastry & Dessert', subCategory: 'Donut' },
  { id: 'p11', name: 'Tiramisu Lotus Biscoff', description: 'Perfect Sweetness and Rich Treat that Combines the Bold Flavors of Cocoa and Espresso.', price: 15000, image: '/assets/Menu/Tiramisu Lotus Biscoff.jpeg', category: 'Pastry & Dessert', subCategory: 'Donut' },
  { id: 'p12', name: 'Caramel Gola', description: 'A Handmade Donut Drizzled with Rich Caramel Sauce.', price: 20000, image: '/assets/Menu/Caramel Gola.jpeg', category: 'Pastry & Dessert', subCategory: 'Donut' },
  { id: 'p13', name: 'Matcha Forest', description: 'A Fluffy Donut Topped with Rich Matcha Sauce and Crunchy Biscuit Bits.', price: 16000, image: '/assets/Menu/Matcha Forest.jpeg', category: 'Pastry & Dessert', subCategory: 'Donut' },
  { id: 'p14', name: 'Nutella Lotus', description: 'This Fluffy Donut has a Delicious Nutella Spread, and is Topped with Lotus Biscoff Crumbs.', price: 23000, image: '/assets/Menu/Nutella Lotus.jpeg', category: 'Pastry & Dessert', subCategory: 'Donut' },
  { id: 'p15', name: 'Strawberry Candy', description: 'Soft Donut Topped with Sweet Strawberry Sauce, Homemade Crumble.', price: 20000, image: '/assets/Menu/Strawberry Candy.jpeg', category: 'Pastry & Dessert', subCategory: 'Donut' },
  { id: 'p16', name: 'Milky Bombo', description: 'A Soft Bomboloni Donut Filled with Smooth Vanilla Milk Cream.', price: 18000, image: '/assets/Menu/Milky Bombo.jpeg', category: 'Pastry & Dessert', subCategory: 'Donut' },

  // Page 25: Cinnamon Roll
  { id: 'p17', name: 'Cinnamon Roll', description: 'Slightly Sweetened but Full of Flavor. Yeast, Butter, Maybe even a Little Tangy.', price: 24000, image: '/assets/Menu/Cinnamon Roll.jpeg', category: 'Pastry & Dessert', subCategory: 'Cinnamon Roll' },
  { id: 'p18', name: 'Cinnamon Roll Choco Oreo', description: 'Slightly Sweetened of Chocolate. Yeast, Butter, Maybe even a Little Tangy.', price: 25000, image: '/assets/Menu/Cinnamon Roll Choco Oreo.jpeg', category: 'Pastry & Dessert', subCategory: 'Cinnamon Roll' },
  { id: 'p19', name: 'Cinnamon Roll Redvelvet', description: 'Slightly Sweetened of Redvelvet. Yeast, Butter, Maybe even a Little Tangy.', price: 25000, image: '/assets/Menu/Cinnamon Roll Redvelvet.jpeg', category: 'Pastry & Dessert', subCategory: 'Cinnamon Roll' },

  // Page 26: Pastry
  { id: 'p20', name: 'Almond Cookies', description: 'Little bit Crumbly, with Hint of Salt and Vanilla Flavor.', price: 22000, image: '/assets/Menu/Almond Cookies.jpeg', category: 'Pastry & Dessert', subCategory: 'Pastry' },
  { id: 'p21', name: 'Smoky D`manzo', description: 'Fiery Yeasty Bread with Savory Smoked Beef, Rich of Mozzarella Cheese.', price: 28000, image: '/assets/Menu/Smoky D`manzo.jpeg', category: 'Pastry & Dessert', subCategory: 'Pastry' },
  { id: 'p22', name: 'Brownie Ice Cream', description: 'Full of Dark Chocolate Taste, Very Moist and Slightly Sticky Texture.', price: 28000, image: '/assets/Menu/Brownie Ice Cream.jpeg', category: 'Pastry & Dessert', subCategory: 'Pastry' },
  { id: 'p23', name: 'Carrot Cake with Granola Walnut', description: 'Deliciously Healthy Moist Two-Layer Carrot Cake, a Symphony of Flavors and Textures.', price: 42000, image: '/assets/Menu/Carrot Cake with Granola Walnut.jpeg', category: 'Pastry & Dessert', subCategory: 'Pastry' },
  { id: 'p24', name: 'Chococheese Cake', description: 'Rich Chocolate Brownie Baked with a Luscious Melted Basque Cream Cheese.', price: 42000, image: '/assets/Menu/Chococheese Cake.jpeg', category: 'Pastry & Dessert', subCategory: 'Pastry' },
  { id: 'p25', name: 'Kaya Steam Bread', description: 'Sweet and Unique Soft Bread filled with Coconut Jam.', price: 27000, image: '/assets/Menu/Kaya Steam Bread.jpeg', category: 'Pastry & Dessert', subCategory: 'Pastry' },
  { id: 'p26', name: 'Blueberry French Toast', description: 'Artisan Bread with Vanilla Ice Cream, Blueberry Sauce and Healthy Chruncy Granola.', price: 30000, image: '/assets/Menu/Blueberry French Toast.jpeg', category: 'Pastry & Dessert', subCategory: 'Pastry' }
];

