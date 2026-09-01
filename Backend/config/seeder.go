package config

import (
	"backend/internal"

	"gorm.io/gorm"
)

func SeedDummyData(db *gorm.DB) error {
	// ── Categories (always upsert) ──────────────────────────────────
	categories := []internal.Category{
		{ID: 1, NamaKategori: "Coffee"},
		{ID: 2, NamaKategori: "Non-Coffee"},
		{ID: 3, NamaKategori: "Mocktails & Juice"},
		{ID: 4, NamaKategori: "Food"},
		{ID: 5, NamaKategori: "Snacks"},
		{ID: 6, NamaKategori: "Pastry & Dessert"},
		{ID: 7, NamaKategori: "Promo"},
		{ID: 8, NamaKategori: "Rekomendasi"},
	}
	for _, cat := range categories {
		db.Save(&cat)
	}

	// ── Products (always upsert) ─────────────────────────────────────
	products := []internal.Product{
			// ── Coffee: Basic Coffee ──
			{ID: 1, CategoryID: 1, NamaMenu: "Black", Deskripsi: "Americano/Long black. Using Our Special Blend Espresso.", Harga: 25000, Image: "BlackCoffe.jpeg", Status: "available"},
			{ID: 2, CategoryID: 1, NamaMenu: "White", Deskripsi: "Latte/Cappucino/Magic. Using Our Special Blend Espresso", Harga: 32000, Image: "whitecoffe.jpeg", Status: "available"},
			{ID: 3, CategoryID: 1, NamaMenu: "Traditional/Vietnam Drip", Deskripsi: "Traditional coffee its unique flavor that combines the boldness of black coffee with the creamy sweetness of condensed milk.", Harga: 25000, Image: "Vietnamese Coffee.jpeg", Status: "available"},
			// ── Coffee: Sweet Edition ──
			{ID: 4, CategoryID: 1, NamaMenu: "Sweet & Cream", Deskripsi: "Sweet and rich flavor profile, combining the boldness of espresso with the creamy smoothness of fresh milk. Finished with vanilla ice cream and granola.", Harga: 37000, Image: "Sweet&Cream.jpeg", Status: "available"},
			{ID: 5, CategoryID: 1, NamaMenu: "Affogato", Deskripsi: "A perfect blend of hot and cold—smooth espresso poured over a scoop of creamy vanilla ice cream.", Harga: 30000, Image: "Tiramisu latte.jpeg", Status: "available"},
			{ID: 6, CategoryID: 1, NamaMenu: "Biscoffgato", Deskripsi: "A rich fusion of pure chocolate and creamy vanilla ice cream, topped with crunchy granola for added texture.", Harga: 37000, Image: "Lotus Biscoff Croissant.jpeg", Status: "available"},
			{ID: 7, CategoryID: 1, NamaMenu: "Matchagato", Deskripsi: "Earthy, smooth matcha meets creamy vanilla ice cream in this refreshing dessert.", Harga: 35000, Image: "matchagato.jpeg", Status: "available"},
			// ── Coffee: Taste of Coffee Shop ──
			{ID: 8, CategoryID: 1, NamaMenu: "Black & White", Deskripsi: "Combination Between our special Marry Blend Espresso with Indonesian Palm Sugar and Creamy Fresh Milk.", Harga: 30000, Image: "coffeblack&white.jpeg", Status: "available"},
			{ID: 9, CategoryID: 1, NamaMenu: "Spanish Ice Coffee", Deskripsi: "Combination of Condensed Milk and Regular Milk with Our Special Marry Blend Espresso.", Harga: 30000, Image: "SpanishIceCoffee.jpeg", Status: "available"},
			{ID: 10, CategoryID: 1, NamaMenu: "Cafe Mocha", Deskripsi: "Sweet and Bitter Our Special Marry Blend Espresso with Holland Chocolate and Fresh Milk.", Harga: 38000, Image: "Cafe Mocha.jpeg", Status: "available"},
			{ID: 11, CategoryID: 1, NamaMenu: "Sweet Cinnamon Latte", Deskripsi: "A Sweet and Woody Flavour of Cinnamon Combine with Our Special Marry Blend Espresso and Fresh Milk.", Harga: 37000, Image: "Sweet Cinnamon Latte.jpeg", Status: "available"},
			{ID: 12, CategoryID: 1, NamaMenu: "ButterScotch", Deskripsi: "Soft, Rich and Sweet Butterscotch Extract Combine with Our Special Marry Blend Espresso and Fresh Milk.", Harga: 35000, Image: "Butterscotch coffee.jpeg", Status: "available"},
			{ID: 13, CategoryID: 1, NamaMenu: "Salted Caramel Cheese Latte", Deskripsi: "A silky blend of espresso and steamed milk infused, salted caramel, cheese cream.", Harga: 38000, Image: "Iced Caramel Macchiato.jpeg", Status: "available"},
			{ID: 14, CategoryID: 1, NamaMenu: "Black & Berry", Deskripsi: "Made with a Shot of Espresso, Combine with Lemon and Strawberry, Soda on It and All Perfect.", Harga: 35000, Image: "Black&Berry.jpeg", Status: "available"},
			{ID: 15, CategoryID: 1, NamaMenu: "Blucoffee", Deskripsi: "Mix of blueberry puree and black coffee—bright, fruity, and refreshingly unique.", Harga: 35000, Image: "Blucoffee.jpeg", Status: "available"},
			{ID: 16, CategoryID: 1, NamaMenu: "Cheese Tiramisu Coffee", Deskripsi: "Combines chocolate, coffee, milk, and tiramisu sauce in one delicious cup. Topped with a smooth layer of cream cheese.", Harga: 38000, Image: "Tiramisu latte.jpeg", Status: "available"},
			// ── Coffee: Barista Choice ──
			{ID: 17, CategoryID: 1, NamaMenu: "Magic", Deskripsi: "A harmonious blend of espresso and silky milk. Gentle coffee notes meet a creamy texture.", Harga: 32000, Image: "CoffeMagic.jpeg", Status: "available"},
			{ID: 18, CategoryID: 1, NamaMenu: "Dirty Latte", Deskripsi: "A balanced blend of rich espresso and chilled milk featuring bold coffee notes, a velvety mouthfeel.", Harga: 36000, Image: "Iced Dirty Chai Latte.jpeg", Status: "available"},
			{ID: 19, CategoryID: 1, NamaMenu: "Mont Blanc", Deskripsi: "A refreshing blend of cold brew, fresh orange, and silky milk. Bright citrus notes complement the coffee's richness.", Harga: 38000, Image: "Mont Blanc.jpeg", Status: "available"},
			{ID: 20, CategoryID: 1, NamaMenu: "Manual Brew", Deskripsi: "A more personal and precise way to enjoy coffee. Brewed using methods like the Origami Dripper.", Harga: 35000, Image: "Manual Brew.jpeg", Status: "available"},

			// ── Non-Coffee ──
			{ID: 21, CategoryID: 2, NamaMenu: "Jasmine Tea", Deskripsi: "Hot/Cold Tea", Harga: 20000, Image: "JasmineTea.jpeg", Status: "available"},
			{ID: 22, CategoryID: 2, NamaMenu: "Peach Tea", Deskripsi: "Hot/Cold Tea", Harga: 20000, Image: "Peach Tea.jpeg", Status: "available"},
			{ID: 23, CategoryID: 2, NamaMenu: "Earl Grey", Deskripsi: "Hot/Cold Tea", Harga: 20000, Image: "Earl Grey.jpeg", Status: "available"},
			{ID: 24, CategoryID: 2, NamaMenu: "Lemon Tea", Deskripsi: "Hot/Cold Tea", Harga: 28000, Image: "Lemon Tea.jpeg", Status: "available"},
			{ID: 25, CategoryID: 2, NamaMenu: "Lychee Tea", Deskripsi: "Hot/Cold Tea", Harga: 28000, Image: "Summer Lychee.jpeg", Status: "available"},
			{ID: 26, CategoryID: 2, NamaMenu: "Lemongrass Tea", Deskripsi: "Hot/Cold Tea", Harga: 29000, Image: "Lemongrass Iced tea.jpeg", Status: "available"},
			{ID: 27, CategoryID: 2, NamaMenu: "Japanese Matcha", Deskripsi: "Hot/Cold Milk Base", Harga: 34000, Image: "Iced matcha.jpeg", Status: "available"},
			{ID: 28, CategoryID: 2, NamaMenu: "Red Velvet", Deskripsi: "Hot/Cold Milk Base", Harga: 34000, Image: "Red velvet.jpeg", Status: "available"},
			{ID: 29, CategoryID: 2, NamaMenu: "Chocolate", Deskripsi: "Hot/Cold Milk Base", Harga: 34000, Image: "Chocolate.jpeg", Status: "available"},
			{ID: 30, CategoryID: 2, NamaMenu: "Charcoal", Deskripsi: "Hot/Cold Milk Base", Harga: 34000, Image: "Charcoal.jpeg", Status: "available"},
			{ID: 31, CategoryID: 2, NamaMenu: "Matcha Special", Deskripsi: "Cold Milk Base", Harga: 39000, Image: "Matcha Special.jpeg", Status: "available"},
			// ── Non-Coffee: Matcha Series ──
			{ID: 32, CategoryID: 2, NamaMenu: "Usucha", Deskripsi: "A traditional Japanese matcha prepared in its purest form.", Harga: 33000, Image: "Usucha.jpeg", Status: "available"},
			{ID: 33, CategoryID: 2, NamaMenu: "Matcha Latte", Deskripsi: "Nice Smooth Texture and Creamy from Our Premium Japanese Matcha.", Harga: 38000, Image: "Matcha Latte.jpeg", Status: "available"},
			{ID: 34, CategoryID: 2, NamaMenu: "Coco Breeze Matcha", Deskripsi: "Earthy matcha layered with chilled coconut water for a light, refreshing sip.", Harga: 42000, Image: "Coco Breeze Matcha.jpeg", Status: "available"},
			{ID: 35, CategoryID: 2, NamaMenu: "Pistachio Matcha", Deskripsi: "The nutty richness of the pistachio perfectly balances the vibrant bitterness of the matcha.", Harga: 55000, Image: "MatchaPistachio.jpeg", Status: "available"},
			{ID: 36, CategoryID: 2, NamaMenu: "Rosecha", Deskripsi: "Premium Japanese matcha, gently whisked with fresh milk, and finished with soft cream mixed with rose liquid.", Harga: 45000, Image: "Rosecha.jpeg", Status: "available"},
			{ID: 37, CategoryID: 2, NamaMenu: "Pink Cloud Matcha", Deskripsi: "Sweet and tangy strawberry layered with milk and premium matcha, topped with silky strawberry cream foam.", Harga: 55000, Image: "Pink Cloud Matcha.jpeg", Status: "available"},
			{ID: 38, CategoryID: 2, NamaMenu: "Matcha Gato", Deskripsi: "Earthy, smooth matcha meets creamy vanilla ice cream in this refreshing dessert.", Harga: 35000, Image: "matchagato.jpeg", Status: "available"},

			// ── Mocktails & Juice ──
			{ID: 39, CategoryID: 3, NamaMenu: "Summer Lychee", Deskripsi: "Lychee Extract Combined with Fermented Milk, & Lychee Fruit.", Harga: 35000, Image: "Summer Lychee.jpeg", Status: "available"},
			{ID: 40, CategoryID: 3, NamaMenu: "Fruity De Bosco", Deskripsi: "Lemon Tea, Mix Berry Extract, & Simple Syrup.", Harga: 35000, Image: "Fruity De Bosco.jpeg", Status: "available"},
			{ID: 41, CategoryID: 3, NamaMenu: "Hay Cherry", Deskripsi: "Lemon Slice, Cherry Extract with Mint Leaves, & Soda Water.", Harga: 38000, Image: "Hay Cherry.jpeg", Status: "available"},
			{ID: 42, CategoryID: 3, NamaMenu: "Mix Berry Mango", Deskripsi: "Mix Berry Extract, Mango Puree, Mint, & a Little Bit of Soda Water.", Harga: 36000, Image: "Mix Berry Mango.jpeg", Status: "available"},
			{ID: 43, CategoryID: 3, NamaMenu: "Classic Mojito", Deskripsi: "Lemon Slices, with Mint Leaves & Soda Water.", Harga: 35000, Image: "Classic Mojito.jpeg", Status: "available"},
			{ID: 44, CategoryID: 3, NamaMenu: "Bloody Mary", Deskripsi: "Enjoy the Sexy Red of Fruity de Bosco, Butterfly Pea, Completed with Special Sweet Cream", Harga: 38000, Image: "Bloody Mary.jpeg", Status: "available"},
			{ID: 45, CategoryID: 3, NamaMenu: "Strawberry Smoothies", Deskripsi: "Strawberries are Rich in Fibre, Vitamins and Antioxidants.", Harga: 47000, Image: "Strawberry Smoothies.jpeg", Status: "available"},
			{ID: 46, CategoryID: 3, NamaMenu: "Blueberry Smoothies", Deskripsi: "Contains Antioxidants, Molecules that Help Destroy Free Radicals.", Harga: 47000, Image: "Blueberry Smoothies.jpeg", Status: "available"},
			{ID: 47, CategoryID: 3, NamaMenu: "Mango", Deskripsi: "Tropical Floral Taste, Juicy, Somewhat Stingy, and Sweet with Underlying Hints of Sourness.", Harga: 38000, Image: "Mango.jpeg", Status: "available"},
			{ID: 48, CategoryID: 3, NamaMenu: "Watermelon Refresher", Deskripsi: "Freshly Watermelon Juice with Orange and Lemon.", Harga: 38000, Image: "Watermelon Refresher.jpeg", Status: "available"},

			// ── Food: Salad & Burger ──
			{ID: 49, CategoryID: 4, NamaMenu: "Coffee Shop Burger", Deskripsi: "Bun, Beef Patty, Cheese, Onion, BBQ Sauce, Mustard, Fries.", Harga: 55000, Image: "Norma`s Burger.jpeg", Status: "available"},
			{ID: 50, CategoryID: 4, NamaMenu: "Crazy Cheese Burger", Deskripsi: "Bun, onion, Double Cheese, Double Beef Patty, Fries and Dried Oregano.", Harga: 65000, Image: "Crazy Cheese Burger.jpeg", Status: "available"},
			{ID: 51, CategoryID: 4, NamaMenu: "Coffee Shop Salad", Deskripsi: "Red & Green Lettuce, Grilled Chicken Breast, Carrot, Cherry Tomato, Cucumber, Edamame Corn, Citrus Dressing.", Harga: 40000, Image: "Norma Salad.jpeg", Status: "available"},
			{ID: 52, CategoryID: 4, NamaMenu: "Enoki Salad", Deskripsi: "Green Lettuce, Red & Green Paprika, Fried Enoki, with Thai Sweet Chili Sauce.", Harga: 38000, Image: "Enoki Salad.jpeg", Status: "available"},
			{ID: 53, CategoryID: 4, NamaMenu: "Fish & Chips", Deskripsi: "Dory fish, Tempura Flour, Fries, Honey Mustard Coleslaw, Lemon Wedges, Mesclun Salad.", Harga: 40000, Image: "Fish & Chips.jpeg", Status: "available"},
			// ── Food: Main Course ──
			{ID: 54, CategoryID: 4, NamaMenu: "Indonesian Fried Rice", Deskripsi: "Spices, Herbs, Rice, Sunny Side Up, Diced Local Pickles, Chicken Satai & Emping.", Harga: 48000, Image: "Indonesian Fried Rice.jpeg", Status: "available"},
			{ID: 55, CategoryID: 4, NamaMenu: "Spicy Fried Rice with Katsu", Deskripsi: "Coffee Shop Signature Fried Rice with Sambal Matah, Topped with Chicken Katsu.", Harga: 48000, Image: "Spicy Fried Rice with Katsu.jpeg", Status: "available"},
			{ID: 56, CategoryID: 4, NamaMenu: "Nasi Jeruk Ayam Serundeng", Deskripsi: "Nasi Daun Jeruk, Chicken Serundeng, Sambal Terasi, Anchovies, Green Lettuce.", Harga: 45000, Image: "Nasi Jeruk Ayam Serundeng.jpeg", Status: "available"},
			{ID: 57, CategoryID: 4, NamaMenu: "Nasi Ayam Bawang", Deskripsi: "Chicken Fried with Fragrant Garlic, Rice, Cracker, Fried Tofu and Tempe.", Harga: 46000, Image: "Nasi Ayam Bawang.jpeg", Status: "available"},
			{ID: 58, CategoryID: 4, NamaMenu: "Iga Bakar Honey Glazed", Deskripsi: "Rice, Imported Ribs, Shallot Pickles, Emping Cracker, Fried Onion, Mix Sesame Seed.", Harga: 85000, Image: "Iga Bakar Honey Glazed.jpeg", Status: "available"},
			{ID: 59, CategoryID: 4, NamaMenu: "Mee Goreng", Deskripsi: "Stir-Fried with Our House-Made Noodles, This Savory Dish Features Diced Chicken.", Harga: 38000, Image: "Mee Goreng.jpeg", Status: "available"},
			{ID: 60, CategoryID: 4, NamaMenu: "Tongseng Daging Khas Solo", Deskripsi: "Beef Tenderloin with Vegetables such as Cabbage, Garlic, Tomato and Soy Sauce.", Harga: 70000, Image: "Tongseng Daging Khas Solo.jpeg", Status: "available"},
			{ID: 61, CategoryID: 4, NamaMenu: "Dori Asam Manis", Deskripsi: "Crispy Fried Dory Fillet Served in a Tangy Sweet and Sour Sauce with Bell peppers.", Harga: 40000, Image: "Dori Asam Manis.jpeg", Status: "available"},
			{ID: 62, CategoryID: 4, NamaMenu: "Tomyam Goong with Udang Galah", Deskripsi: "Authentic and Distinct Hot and Sour Flavours, Shrimp = Udang Galah.", Harga: 75000, Image: "Tomyam Goong with Udang Galah.jpeg", Status: "available"},
			{ID: 63, CategoryID: 4, NamaMenu: "Beef Bulgogi Rice", Deskripsi: "Joy in a Bowl Filled with White Rice, Beef Short Plate, Mushroom Champign, Boiled Egg.", Harga: 50000, Image: "Beef Bulgogi Rice.jpeg", Status: "available"},
			{ID: 64, CategoryID: 4, NamaMenu: "Chicken Teriyaki", Deskripsi: "A Beautiful Tasty White Rice, Chicken Breast, Boiled Egg Completed with Teriyaki Sauce.", Harga: 45000, Image: "Chicken Teriyaki.jpeg", Status: "available"},
			{ID: 65, CategoryID: 4, NamaMenu: "Chicken Curry Rice", Deskripsi: "Premium Chicken Breast, Homemade Curry Roux, Curry Leaves, Potato, Mushroom, Carrot.", Harga: 60000, Image: "Chicken Curry Rice.jpeg", Status: "available"},
			{ID: 66, CategoryID: 4, NamaMenu: "Aglio E Olio Piccante", Deskripsi: "Spaghetti, Garlic Chili Oil, Chili Flakes, Chicken Katsu, Parmesan Cheese, Parsley.", Harga: 55000, Image: "Aglio E Olio Piccante.jpeg", Status: "available"},
			{ID: 67, CategoryID: 4, NamaMenu: "Spaghetti Bolognese", Deskripsi: "Spaghetti, Signature Sauce, Tomato Cherry, Parmesan Cheese, Baked Baugette, Oregano.", Harga: 50000, Image: "Spaghetti Bolognese.jpeg", Status: "available"},
			{ID: 68, CategoryID: 4, NamaMenu: "Spaghetti Carbonara", Deskripsi: "Spaghetti, Smoked Beef, Creamy Sauce, Baked Baugette, Parmesan Cheese, Parsley.", Harga: 52000, Image: "Spaghetti Carbonara.jpeg", Status: "available"},
			// ── Food: Noodle Edition ──
			{ID: 69, CategoryID: 4, NamaMenu: "Chili Oil Noodle", Deskripsi: "Artisan Noodles in Authentic Chili Oil with Crispy Wontons, Minced Chicken.", Harga: 43000, Image: "Chili Oil Noodle.jpeg", Status: "available"},
			{ID: 70, CategoryID: 4, NamaMenu: "Spicy Noodle", Deskripsi: "Artisan Noodles in a Creamy Chili Sauce with Crispy Wontons, Minced Chicken.", Harga: 45000, Image: "Spicy Noodle.jpeg", Status: "available"},
			{ID: 71, CategoryID: 4, NamaMenu: "Garlic Chicken Noodle", Deskripsi: "Slow-Cooked Homemade Broth Seasoned with a Variety of Indonesian Spices.", Harga: 50000, Image: "Garlic Chicken Noodle.jpeg", Status: "available"},
			// ── Food: Neapolitan Pizza ──
			{ID: 72, CategoryID: 4, NamaMenu: "Margheritta", Deskripsi: "Tomato Sauce, Basil, Parmesan & Mozarella.", Harga: 83000, Image: "Margheritta.jpeg", Status: "available"},
			{ID: 73, CategoryID: 4, NamaMenu: "Garlic Shrimp Cheese", Deskripsi: "Shrimp, Cheese Sauce, Mozarella, Garlic, Parmesan Lemon.", Harga: 95000, Image: "Garlic Shrimp Cheese.jpeg", Status: "available"},
			{ID: 74, CategoryID: 4, NamaMenu: "Pepperoni", Deskripsi: "Beef Pepperoni, Mozarella. Tomato Sauce & Parmesan.", Harga: 95000, Image: "Pepperoni.jpeg", Status: "available"},
			{ID: 75, CategoryID: 4, NamaMenu: "Meat Champ", Deskripsi: "Brown Seat Ground Beef, Mozarella, Tomato Sauce & Parmesan.", Harga: 95000, Image: "Meat Champ.jpeg", Status: "available"},
			{ID: 76, CategoryID: 4, NamaMenu: "Mushroom Alfreddo", Deskripsi: "Mushroom, Ground Beef, Parmesan Cheese and Alfreddo Sauce.", Harga: 105000, Image: "Mushroom Alfreddo.jpeg", Status: "available"},
			{ID: 77, CategoryID: 4, NamaMenu: "Say Cheese", Deskripsi: "Cheese Sauce, Cheese Slice, Parmesan, Pistachio, Raisin, Mozarella, Topped with Rosemary.", Harga: 110000, Image: "Say Cheese.jpeg", Status: "available"},
			{ID: 78, CategoryID: 4, NamaMenu: "Calzone", Deskripsi: "A Circular Piece of Pizza Folded in Half, Fill with Alfreddo Sauce, Smoke Beef, Spinach.", Harga: 95000, Image: "Calzone.jpeg", Status: "available"},
			// ── Food: Sushi Club ──
			{ID: 79, CategoryID: 4, NamaMenu: "Kyoto Roll", Deskripsi: "Rice Roll with Shrimp, Tamago, Avocado and Kyuri, Topped with Salmon Slice And Spicy Mayo.", Harga: 40000, Image: "Kyoto Roll.jpeg", Status: "available"},
			{ID: 80, CategoryID: 4, NamaMenu: "Geisha Fire Roll", Deskripsi: "Rice Roll with Crispy Crab Stick, Kyuri, Tamago, Topped with Salmon Slice, Cheese Sauce.", Harga: 48000, Image: "Salmon Mentai Aburi.jpeg", Status: "available"},
			{ID: 81, CategoryID: 4, NamaMenu: "Kimono Roll", Deskripsi: "Rice Roll with Crab Stick, Tamago, Avocado and Kyuri, Topped with Salmon Slice And Spicy Mayo.", Harga: 46000, Image: "Kimono Roll.jpeg", Status: "available"},
			{ID: 82, CategoryID: 4, NamaMenu: "Dragon Roll", Deskripsi: "Rice Roll with Crispy Shrimp, Crab Stick, Short Plate, Kyuri, Topped with Avocado Slice.", Harga: 50000, Image: "Dragon Roll.jpeg", Status: "available"},
			{ID: 83, CategoryID: 4, NamaMenu: "N+ Sushi", Deskripsi: "Tamago, Kyuri and Kani Aburi Sushi Roll. Topped with Salmon, Mayo and Tobiko.", Harga: 50000, Image: "N+ Sushi.jpeg", Status: "available"},
			{ID: 84, CategoryID: 4, NamaMenu: "Tobiko Kani Mayo", Deskripsi: "Chopped Kani with Mayo Served with Tobiko.", Harga: 32000, Image: "Tobiko Kani Mayo.jpeg", Status: "available"},
			{ID: 85, CategoryID: 4, NamaMenu: "Salmon Mentai Aburi", Deskripsi: "Crabstick, Avocado, Kyuri sushi roll Topped with Salmon and Mentai Sauce.", Harga: 44000, Image: "Salmon Mentai Aburi.jpeg", Status: "available"},
			{ID: 86, CategoryID: 4, NamaMenu: "Avocado Cheese Roll", Deskripsi: "Avocado, Kyuri Sushi Roll Topped with Cheese Sauce and Tobiko.", Harga: 35000, Image: "Avocado Cheese Roll.jpeg", Status: "available"},
			{ID: 87, CategoryID: 4, NamaMenu: "Abon Katsu Roll", Deskripsi: "Chicken Katsu, Kyuri, and Soun with Beef Abon.", Harga: 48000, Image: "Abon Katsu Roll.jpeg", Status: "available"},
			{ID: 88, CategoryID: 4, NamaMenu: "Spicy Salmon Tanuki", Deskripsi: "Fried Sushi Fill with Spicy Salmon, Kani, Tanuki, Kyuri and Spicy Mayo sauce.", Harga: 48000, Image: "Spicy Salmon Tanuki.jpeg", Status: "available"},
			{ID: 89, CategoryID: 4, NamaMenu: "Spicy Salmon Crispy", Deskripsi: "Fried Sushi Fill with Spicy Salmon, Tanuki, Tobiko and Spicy Mentai.", Harga: 47000, Image: "Spicy Salmon Crispy.jpeg", Status: "available"},
			{ID: 90, CategoryID: 4, NamaMenu: "Osaka Roll", Deskripsi: "Crabstick Sushi Roll, Served with Salmon and Mentai Sauce.", Harga: 45000, Image: "Osaka Roll.jpeg", Status: "available"},
			{ID: 91, CategoryID: 4, NamaMenu: "Tamago Nigiri & Kani Mayo Nigiri", Deskripsi: "Nigiri set.", Harga: 39000, Image: "Tamago Nigiri & Kani Mayo Nigiri.jpeg", Status: "available"},
			{ID: 92, CategoryID: 4, NamaMenu: "Salmon Mentai Nigiri & Salmon Belly Nigiri", Deskripsi: "Nigiri set.", Harga: 45000, Image: "Salmon Mentai Nigiri & Salmon Belly Nigiri.jpeg", Status: "available"},

			// ── Snacks: Easy Bites ──
			{ID: 93, CategoryID: 5, NamaMenu: "French Fries", Deskripsi: "Classic shoestring fries.", Harga: 28000, Image: "French Fries.jpeg", Status: "available"},
			{ID: 94, CategoryID: 5, NamaMenu: "Street Cheesy Fries", Deskripsi: "Fries with cheese sauce.", Harga: 32000, Image: "Street Cheesy Fries.jpeg", Status: "available"},
			{ID: 95, CategoryID: 5, NamaMenu: "Fried Banana", Deskripsi: "Sweet fried banana.", Harga: 30000, Image: "Fried Banana.jpeg", Status: "available"},
			{ID: 96, CategoryID: 5, NamaMenu: "Chicken Spring Roll", Deskripsi: "Crispy spring rolls filled with chicken.", Harga: 35000, Image: "Chicken Spring Roll.jpeg", Status: "available"},
			{ID: 97, CategoryID: 5, NamaMenu: "Coffee Shop Nachos", Deskripsi: "Crispy nachos with toppings.", Harga: 43000, Image: "Norma Nachos.jpeg", Status: "available"},
			{ID: 98, CategoryID: 5, NamaMenu: "Spicy Tofu", Deskripsi: "Fried tofu with spicy seasoning.", Harga: 27000, Image: "Spicy Tofu.jpeg", Status: "available"},
			{ID: 99, CategoryID: 5, NamaMenu: "Tempe Mendoan", Deskripsi: "Traditional battered fried tempeh.", Harga: 30000, Image: "Tempe Mendoan.jpeg", Status: "available"},
			{ID: 100, CategoryID: 5, NamaMenu: "Ubi Goreng", Deskripsi: "Sweet potato fries.", Harga: 28000, Image: "Ubi Goreng.jpeg", Status: "available"},
			{ID: 101, CategoryID: 5, NamaMenu: "Crunchy Enoki", Deskripsi: "Deep fried crispy enoki mushrooms.", Harga: 28000, Image: "Crunchy Enoki.jpeg", Status: "available"},
			{ID: 102, CategoryID: 5, NamaMenu: "Lousiana Chicken Wings", Deskripsi: "Spicy Lousiana style chicken wings.", Harga: 35000, Image: "Lousiana Chicken Wings.jpeg", Status: "available"},
			{ID: 103, CategoryID: 5, NamaMenu: "Smoke BBQ Wings", Deskripsi: "BBQ glazed chicken wings.", Harga: 40000, Image: "Smoke BBQ Wings.jpeg", Status: "available"},
			{ID: 104, CategoryID: 5, NamaMenu: "Half Boiled Egg", Deskripsi: "Perfectly soft boiled eggs.", Harga: 15000, Image: "Half Boiled Egg.jpeg", Status: "available"},
			// ── Snacks: Dimsum Series ──
			{ID: 105, CategoryID: 5, NamaMenu: "Original Dimsum", Deskripsi: "Classic dimsum with quality ingredients.", Harga: 30000, Image: "Original Dimsum.jpeg", Status: "available"},
			{ID: 106, CategoryID: 5, NamaMenu: "Nori Dimsum", Deskripsi: "Savory Nori wrapped dimsum.", Harga: 30000, Image: "Nori Dimsum.jpeg", Status: "available"},
			{ID: 107, CategoryID: 5, NamaMenu: "Mozarella Dimsum", Deskripsi: "Dimsum filled with rich Mozarella.", Harga: 32000, Image: "Mozarella Dimsum.jpeg", Status: "available"},
			{ID: 108, CategoryID: 5, NamaMenu: "Chilli Oil Dimsum", Deskripsi: "Dimsum served with bold Chili Oil.", Harga: 35000, Image: "Chilli Oil Dimsum.jpeg", Status: "available"},

			// ── Pastry & Dessert: Cookies Series ──
			{ID: 109, CategoryID: 6, NamaMenu: "Choco Tiramisu Cookies", Deskripsi: "A Perfect harmony of Rich Milk Chocolate Cookies, Silky Tiramisu Sauce.", Harga: 25000, Image: "Choco Tiramisu Cookies.jpeg", Status: "available"},
			{ID: 110, CategoryID: 6, NamaMenu: "Redvelvet Nutella Cookies", Deskripsi: "Soft and Classic Red Velvet Cookies with luscious Nutella filled center.", Harga: 27000, Image: "Redvelvet Nutella Cookies.jpeg", Status: "available"},
			{ID: 111, CategoryID: 6, NamaMenu: "Choco Almond Cookies", Deskripsi: "Buttery cookies loaded with Crunchy Almonds and Dark chocolate.", Harga: 25000, Image: "Choco Almond Cookies.jpeg", Status: "available"},
			{ID: 112, CategoryID: 6, NamaMenu: "Double Matcha Cookies", Deskripsi: "Infused, and layered with matcha, this buttery cookie blends premium Japanese matcha.", Harga: 30000, Image: "Double Matcha Cookies.jpeg", Status: "available"},
			// ── Pastry & Dessert: Croissant ──
			{ID: 113, CategoryID: 6, NamaMenu: "Omelette Croissant", Deskripsi: "French Butter Croissant, Omelette, Signature Sauce and Dip Sweet Mayo.", Harga: 49000, Image: "Omelette Croissant.jpeg", Status: "available"},
			{ID: 114, CategoryID: 6, NamaMenu: "Matcha Croissant", Deskripsi: "Very Crispy Croissant and the Characteristic Slightly Bitter Taste of Matcha.", Harga: 35000, Image: "Matcha Croissant.jpeg", Status: "available"},
			{ID: 115, CategoryID: 6, NamaMenu: "Lotus Biscoff Croissant", Deskripsi: "Light, Flaky, and Delicately Sweet with Lotus Biscoff Biscuit.", Harga: 32000, Image: "Lotus Biscoff Croissant.jpeg", Status: "available"},
			{ID: 116, CategoryID: 6, NamaMenu: "Almond Croissant", Deskripsi: "Soft Buttery Dough, Flaky Crust, Nutty Sweetness From Homemade Almond Cream.", Harga: 30000, Image: "Almond Croissant.jpeg", Status: "available"},
			{ID: 117, CategoryID: 6, NamaMenu: "Butter Croissant", Deskripsi: "Flaky, Buttery and Smells a Good Taste of Butter Inside.", Harga: 24000, Image: "Butter Croissant.jpeg", Status: "available"},
			// ── Pastry & Dessert: Donut ──
			{ID: 118, CategoryID: 6, NamaMenu: "White Chocolate Red Velvet", Deskripsi: "Combination of the Sweet from Homemade White Chocolate Sauce, and Red Velvet Scrambled.", Harga: 15000, Image: "White Chocolate Red Velvet.jpeg", Status: "available"},
			{ID: 119, CategoryID: 6, NamaMenu: "Tiramisu Lotus Biscoff", Deskripsi: "Perfect Sweetness and Rich Treat that Combines the Bold Flavors of Cocoa and Espresso.", Harga: 15000, Image: "Tiramisu Lotus Biscoff.jpeg", Status: "available"},
			{ID: 120, CategoryID: 6, NamaMenu: "Caramel Gola", Deskripsi: "A Handmade Donut Drizzled with Rich Caramel Sauce.", Harga: 20000, Image: "Caramel Gola.jpeg", Status: "available"},
			{ID: 121, CategoryID: 6, NamaMenu: "Matcha Forest", Deskripsi: "A Fluffy Donut Topped with Rich Matcha Sauce and Crunchy Biscuit Bits.", Harga: 16000, Image: "Matcha Forest.jpeg", Status: "available"},
			{ID: 122, CategoryID: 6, NamaMenu: "Nutella Lotus", Deskripsi: "This Fluffy Donut has a Delicious Nutella Spread, and is Topped with Lotus Biscoff Crumbs.", Harga: 23000, Image: "Nutella Lotus.jpeg", Status: "available"},
			{ID: 123, CategoryID: 6, NamaMenu: "Strawberry Candy", Deskripsi: "Soft Donut Topped with Sweet Strawberry Sauce, Homemade Crumble.", Harga: 20000, Image: "Strawberry Candy.jpeg", Status: "available"},
			{ID: 124, CategoryID: 6, NamaMenu: "Milky Bombo", Deskripsi: "A Soft Bomboloni Donut Filled with Smooth Vanilla Milk Cream.", Harga: 18000, Image: "Milky Bombo.jpeg", Status: "available"},
			// ── Pastry & Dessert: Cinnamon Roll ──
			{ID: 125, CategoryID: 6, NamaMenu: "Cinnamon Roll", Deskripsi: "Slightly Sweetened but Full of Flavor. Yeast, Butter, Maybe even a Little Tangy.", Harga: 24000, Image: "Cinnamon Roll.jpeg", Status: "available"},
			{ID: 126, CategoryID: 6, NamaMenu: "Cinnamon Roll Choco Oreo", Deskripsi: "Slightly Sweetened of Chocolate. Yeast, Butter, Maybe even a Little Tangy.", Harga: 25000, Image: "Cinnamon Roll Choco Oreo.jpeg", Status: "available"},
			{ID: 127, CategoryID: 6, NamaMenu: "Cinnamon Roll Redvelvet", Deskripsi: "Slightly Sweetened of Redvelvet. Yeast, Butter, Maybe even a Little Tangy.", Harga: 25000, Image: "Cinnamon Roll Redvelvet.jpeg", Status: "available"},
			// ── Pastry & Dessert: Pastry ──
			{ID: 128, CategoryID: 6, NamaMenu: "Almond Cookies", Deskripsi: "Little bit Crumbly, with Hint of Salt and Vanilla Flavor.", Harga: 22000, Image: "Almond Cookies.jpeg", Status: "available"},
			{ID: 129, CategoryID: 6, NamaMenu: "Smoky D`manzo", Deskripsi: "Fiery Yeasty Bread with Savory Smoked Beef, Rich of Mozzarella Cheese.", Harga: 28000, Image: "Smoky D`manzo.jpeg", Status: "available"},
			{ID: 130, CategoryID: 6, NamaMenu: "Brownie Ice Cream", Deskripsi: "Full of Dark Chocolate Taste, Very Moist and Slightly Sticky Texture.", Harga: 28000, Image: "Brownie Ice Cream.jpeg", Status: "available"},
			{ID: 131, CategoryID: 6, NamaMenu: "Carrot Cake with Granola Walnut", Deskripsi: "Deliciously Healthy Moist Two-Layer Carrot Cake, a Symphony of Flavors and Textures.", Harga: 42000, Image: "Carrot Cake with Granola Walnut.jpeg", Status: "available"},
			{ID: 132, CategoryID: 6, NamaMenu: "Chococheese Cake", Deskripsi: "Rich Chocolate Brownie Baked with a Luscious Melted Basque Cream Cheese.", Harga: 42000, Image: "Chococheese Cake.jpeg", Status: "available"},
			{ID: 133, CategoryID: 6, NamaMenu: "Kaya Steam Bread", Deskripsi: "Sweet and Unique Soft Bread filled with Coconut Jam.", Harga: 27000, Image: "Kaya Steam Bread.jpeg", Status: "available"},
			{ID: 134, CategoryID: 6, NamaMenu: "Blueberry French Toast", Deskripsi: "Artisan Bread with Vanilla Ice Cream, Blueberry Sauce and Healthy Chruncy Granola.", Harga: 30000, Image: "Blueberry French Toast.jpeg", Status: "available"},
	}
	for _, p := range products {
		db.Save(&p)
	}

	// ── Location & Tables (Denah 4 Area: VIP, Indoor, Smoking, Outdoor) ──
	var loc internal.Location
	if err := db.First(&loc).Error; err == nil && loc.ID > 0 {
		desiredTables := []struct {
			num      uint
			area     string
			capacity uint
		}{
			// 1. VIP (4 meja: 6, 10, 10, 8 kursi)
			{101, "VIP", 6},
			{102, "VIP", 10},
			{103, "VIP", 10},
			{104, "VIP", 8},

			// 2. Indoor (8 meja: 2, 4, 4, 6, 4, 2, 6, 4 kursi)
			{1, "Indoor", 2},
			{2, "Indoor", 4},
			{3, "Indoor", 4},
			{4, "Indoor", 6},
			{5, "Indoor", 4},
			{6, "Indoor", 2},
			{7, "Indoor", 6},
			{8, "Indoor", 4},

			// 3. Room Smoking (8 meja: 2, 4, 4, 6, 2, 4, 6, 4 kursi)
			{201, "Room Smoking", 2},
			{202, "Room Smoking", 4},
			{203, "Room Smoking", 4},
			{204, "Room Smoking", 6},
			{205, "Room Smoking", 2},
			{206, "Room Smoking", 4},
			{207, "Room Smoking", 6},
			{208, "Room Smoking", 4},

			// 4. Outdoor (Sesuai denah denahlokasicoffeshop.jpeg)
			{301, "Outdoor", 2},
			{302, "Outdoor", 3},
			{303, "Outdoor", 4},
			{304, "Outdoor", 6},
			{305, "Outdoor", 2},
			{306, "Outdoor", 6},
			{307, "Outdoor", 7},
			{308, "Outdoor", 12},
			{309, "Outdoor", 8},
			{310, "Outdoor", 10},
			{311, "Outdoor", 4},
			{312, "Outdoor", 12},
		}

		for _, dt := range desiredTables {
			var existing internal.Table
			if err := db.Where("table_number = ?", dt.num).First(&existing).Error; err != nil {
				db.Create(&internal.Table{
					TableNumber: dt.num,
					LocationID:  loc.ID,
					SeatingArea: dt.area,
					Capacity:    dt.capacity,
					Status:      "available",
				})
			} else {
				db.Model(&existing).Updates(map[string]interface{}{
					"seating_area": dt.area,
					"capacity":     dt.capacity,
				})
			}
		}
	}

	return nil
}
