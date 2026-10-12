import { AnalyticsProvider, TrackEvent } from "@lib/analytics/components"
import { toCartContents } from "@lib/analytics"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getLocale } from "@lib/data/locale-actions"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()
  const locale = await getLocale()

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <AnalyticsProvider
        customerId={customer?.id}
        currencyCode={cart.currency_code}
        locale={locale}
      />
      {/* insert_id dedupes reloads: one Checkout Started per cart per 7 days */}
      <TrackEvent
        event="Checkout Started"
        options={{ insert_id: `checkout_started_${cart.id}` }}
        properties={{
          cart_id: cart.id,
          cart_value: cart.total,
          cart_item_count: cart.items?.reduce((n, i) => n + i.quantity, 0) ?? 0,
          cart_contents: toCartContents(cart.items),
        }}
      />
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
