const fs = require('fs');
const file = 'app/coffeshop-order/_components/OrderMenu.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the mock MENU_ITEMS usage with a state variable
content = content.replace(
  "const [activeCategory, setActiveCategory] = useState('Coffee');",
  "const [activeCategory, setActiveCategory] = useState('Coffee');\n  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);\n  useEffect(() => {\n    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/customer/products`)\n      .then(res => res.json())\n      .then(result => {\n        if(result.success && result.data) {\n          const backendItems = result.data.map((p: any) => ({\n            id: String(p.id),\n            name: p.nama_menu,\n            description: p.deskripsi,\n            price: p.harga,\n            category: p.category?.nama_kategori || 'Coffee',\n            subCategory: p.category?.nama_kategori || 'Coffee',\n            image: p.image || null\n          }));\n          if (backendItems.length > 0) setMenuItems(backendItems);\n          else setMenuItems(MENU_ITEMS);\n        }\n      })\n      .catch(() => setMenuItems(MENU_ITEMS));\n  }, []);"
);

// Replace filteredMenu to use menuItems instead of MENU_ITEMS
content = content.replace(
  "const filteredMenu = activeCategory === 'All'\n    ? MENU_ITEMS\n    : MENU_ITEMS.filter(item => item.category === activeCategory);",
  "const filteredMenu = activeCategory === 'All'\n    ? (menuItems.length > 0 ? menuItems : MENU_ITEMS)\n    : (menuItems.length > 0 ? menuItems : MENU_ITEMS).filter(item => item.category === activeCategory);"
);

fs.writeFileSync(file, content);
