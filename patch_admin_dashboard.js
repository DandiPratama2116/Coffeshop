const fs = require('fs');
const file = 'app/admin/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `  useEffect(() => {
    const saved = localStorage.getItem("admin_orders");
    setOrders(saved ? JSON.parse(saved) : []);
  }, []);`,
  `  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    fetch(\`\${apiBase}/admin/orders\`)
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const mapped = result.data.map((o: any) => ({
            id: String(o.id),
            tableId: String(o.table_id),
            items: o.order_items ? o.order_items.map((i: any) => ({ name: "Menu ID " + i.menu_id, qty: i.quantity, price: i.price })) : [],
            total: o.total_amount,
            status: o.status,
            time: new Date(o.created_at).toLocaleTimeString()
          }));
          setOrders(mapped);
        }
      })
      .catch(console.error);
  }, []);`
);

fs.writeFileSync(file, content);
