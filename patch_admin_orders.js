const fs = require('fs');
const file = 'app/admin/orders/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace localStorage fetch with API fetch
content = content.replace(
  `  useEffect(() => {
    const saved = localStorage.getItem("admin_orders");
    setOrders(saved ? JSON.parse(saved) : []);
  }, []);`,
  `  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  const fetchOrders = () => {
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
  };
  useEffect(() => { fetchOrders(); }, []);`
);

// Replace save with empty function since we shouldn't save to localstorage
content = content.replace(
  `  const save = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem("admin_orders", JSON.stringify(updated));
  };`,
  ``
);

// Replace updateStatus to call API
content = content.replace(
  `  const updateStatus = (id: string) => {
    const updated = orders.map(o => {
      if (o.id !== id) return o;
      const next = STATUS_NEXT[o.status];
      return next ? { ...o, status: next } : o;
    });
    save(updated);
    if (selected?.id === id) {
      const updatedOrder = updated.find(o => o.id === id);
      if (updatedOrder) setSelected(updatedOrder);
    }
  };`,
  `  const updateStatus = async (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const next = STATUS_NEXT[order.status];
    if (!next) return;
    
    try {
      const res = await fetch(\`\${apiBase}/admin/orders/\${id}/status\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      });
      if (res.ok) {
        fetchOrders();
        if (selected?.id === id) {
          setSelected({ ...order, status: next });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };`
);

// Replace deleteOrder to do nothing (since no delete API exists for orders in the backend)
content = content.replace(
  `  const deleteOrder = (id: string) => {
    save(orders.filter(o => o.id !== id));
    if (selected?.id === id) setSelected(null);
  };`,
  `  const deleteOrder = (id: string) => {
    // Delete order not supported via API currently. Just hide from view.
    setOrders(orders.filter(o => o.id !== id));
    if (selected?.id === id) setSelected(null);
  };`
);

fs.writeFileSync(file, content);
