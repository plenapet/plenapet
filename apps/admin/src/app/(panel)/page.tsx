import { getOrderRepository, getProductRepository } from "@plenapet/database";
import { formatCOP } from "@plenapet/ui";
import { Topbar } from "@/components/Topbar";

export default async function DashboardPage() {
  const [products, orders] = await Promise.all([
    getProductRepository("admin").listActive(),
    getOrderRepository().listAll(),
  ]);

  const lowStock = products.filter((p) => p.stockStatus === "low_stock");
  const outOfStock = products.filter((p) => p.stockStatus === "out_of_stock");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const revenue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "refunded")
    .reduce((sum, o) => sum + o.totalCents, 0);

  const stats = [
    { label: "Productos activos", value: products.length },
    { label: "Pedidos pendientes", value: pendingOrders.length },
    { label: "Bajo stock", value: lowStock.length },
    { label: "Agotados", value: outOfStock.length },
  ];

  return (
    <div>
      <Topbar title="Dashboard" />
      <div className="p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra/70">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-azul-confianza">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra/70">
            Ventas registradas (datos de demostración)
          </p>
          <p className="mt-2 text-3xl font-bold text-azul-confianza">
            {formatCOP(revenue)}
          </p>
        </div>

        <div className="mt-8 rounded-card border border-azul-confianza/10 bg-white shadow-card">
          <div className="border-b border-azul-confianza/10 p-5">
            <h2 className="text-sm font-semibold text-azul-confianza">
              Pedidos recientes
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gris-pizarra/70">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-azul-confianza/5">
                  <td className="px-5 py-3 font-medium text-azul-confianza">
                    {order.id}
                  </td>
                  <td className="px-5 py-3 text-gris-pizarra">
                    {order.customerName}
                  </td>
                  <td className="px-5 py-3 text-gris-pizarra">{order.status}</td>
                  <td className="px-5 py-3 text-right font-semibold text-azul-confianza">
                    {formatCOP(order.totalCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
