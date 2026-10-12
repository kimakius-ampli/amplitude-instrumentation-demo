import { toCartContents } from "@lib/analytics"
import { TrackEvent } from "@lib/analytics/components"
import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return notFound()
  }

  const payment = order.payment_collections?.[0]?.payments?.[0]

  return (
    <>
      {/* insert_id dedupes reloads of the confirmation page */}
      <TrackEvent
        key={order.id}
        event="Order Completed"
        options={{
          insert_id: `order_completed_${order.id}`,
          revenue: order.total,
          currency: order.currency_code,
          revenueType: "purchase",
        }}
        properties={{
          order_id: order.id,
          order_display_id: String(order.display_id),
          order_total: order.total,
          tax_total: order.tax_total,
          discount_total: order.discount_total,
          shipping_total: order.shipping_total,
          currency_code: order.currency_code,
          item_count: order.items?.reduce((n, i) => n + i.quantity, 0) ?? 0,
          payment_provider: payment?.provider_id,
          cart_contents: toCartContents(order.items),
        }}
      />
      <OrderCompletedTemplate order={order} />
    </>
  )
}
