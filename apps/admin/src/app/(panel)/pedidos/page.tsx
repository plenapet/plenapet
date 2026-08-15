import { getOrderRepository } from "@plenapet/database";
import { Badge, formatCOP } from "@plenapet/ui";
import { Topbar } from "@/components/Topbar";

const STATUS_TONE: Record<string, "neutral" | "aqua" | "coral" | "warning"> = {
  pending: "warning",
  paid: "aqua",
  processing: "aqua",
  shipped: "neutral",
  delivered: "neutral",
  cancelled: "coral",
  refunded: "coral",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente de pago",
  paid: "Pagado",
  processing: "En preparación",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export default async function PedidosPage() {
  const orders = await getOrderRepository().listAll();

  return (
    <div>
      <Topbar title="Pedidos" />
      <div className="p-8">
        <div className="rounded-card border border-dashed border-azul-confianza/25 bg-white p-4 text-sm text-gris-pizarra">
          Pedidos de demostración. Los pedidos reales llegarán aquí cuando el
          checkout esté conectado a Supabase y al webhook de Wompi.
        </div>

        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-azul-confianza">
                    {order.id} · {order.customerName}
                  </p>
                  <p className="text-xs text-gris-pizarra/70">
                    {new Date(order.placedAt).toLocaleString("es-CO")}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[order.status]}>
                  {STATUS_LABEL[order.status]}
                </Badge>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-gris-pizarra">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex justify-between">
                    <span>
                      {item.quantity} × {item.nameSnapshot}
                    </span>
                    <span>{formatCOP(item.unitPriceCents * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-end border-t border-azul-confianza/10 pt-3 text-sm font-bold text-azul-confianza">
                Total {formatCOP(order.totalCents)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
