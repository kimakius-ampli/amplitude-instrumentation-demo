import * as amplitude from "@amplitude/unified"
import { HttpTypes } from "@medusajs/types"

// Event names from the storefront tracking plan in Amplitude.
export type AnalyticsEvent =
  | "Product List Viewed"
  | "Product Viewed"
  | "Product Added"
  | "Checkout Started"
  | "Checkout Step Completed"
  | "Order Completed"

type AnalyticsContext = {
  country_code?: string
  currency_code?: string
  locale?: string
}

let context: AnalyticsContext = {}
let initialized = false

/**
 * Initializes Amplitude with Autocapture on first use. A no-op on the server
 * or when NEXT_PUBLIC_AMPLITUDE_API_KEY is not set.
 */
function ensureInit() {
  if (initialized || typeof window === "undefined") {
    return initialized
  }

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY

  if (!apiKey) {
    return false
  }

  amplitude.initAll(apiKey, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  })
  initialized = true

  return true
}

/** Properties added to every custom event. */
export function setAnalyticsContext(next: AnalyticsContext) {
  context = { ...context, ...next }
}

export function identifyCustomer(customerId: string | null | undefined) {
  if (!ensureInit()) {
    return
  }

  if (customerId && amplitude.getUserId() !== customerId) {
    amplitude.setUserId(customerId)
  }
}

export function resetIdentity() {
  if (ensureInit()) {
    amplitude.reset()
  }
}

export type TrackOptions = {
  insert_id?: string
  revenue?: number
  currency?: string
  revenueType?: string
}

export function track(
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {},
  options: TrackOptions = {}
) {
  if (!ensureInit()) {
    return
  }

  amplitude.track(event, { ...context, ...properties }, options)
}

export type CartContentsItem = {
  product_id?: string
  variant_id?: string
  sku?: string | null
  product_name?: string
  variant_title?: string
  price?: number
  quantity: number
}

export function toCartContents(
  items: (HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem)[] | null | undefined
): CartContentsItem[] {
  return (items ?? []).map((item) => ({
    product_id: item.product_id ?? undefined,
    variant_id: item.variant_id ?? undefined,
    sku: item.variant_sku ?? null,
    product_name: item.product_title ?? undefined,
    variant_title: item.variant_title ?? undefined,
    price: item.unit_price,
    quantity: item.quantity,
  }))
}
