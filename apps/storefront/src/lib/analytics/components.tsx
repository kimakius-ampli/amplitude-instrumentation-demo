"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"

import {
  AnalyticsEvent,
  identifyCustomer,
  setAnalyticsContext,
  track,
  TrackOptions,
} from "@lib/analytics"

/**
 * Sets identity and the properties shared by every event. Rendered from
 * server layouts, which can read the httpOnly cart and auth cookies.
 */
export function AnalyticsProvider({
  customerId,
  currencyCode,
  locale,
}: {
  customerId?: string | null
  currencyCode?: string | null
  locale?: string | null
}) {
  const { countryCode } = useParams<{ countryCode?: string }>()

  // Set during render so child effects that track on mount already see it.
  setAnalyticsContext({
    country_code: countryCode,
    currency_code: currencyCode ?? undefined,
    locale: locale ?? undefined,
  })

  useEffect(() => {
    identifyCustomer(customerId)
  }, [customerId])

  return null
}

/** Tracks an event once when mounted. Lets server components fire events. */
export function TrackEvent({
  event,
  properties,
  options,
}: {
  event: AnalyticsEvent
  properties?: Record<string, unknown>
  options?: TrackOptions
}) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) {
      return
    }

    tracked.current = true
    track(event, properties, options)
  }, [event, properties, options])

  return null
}
