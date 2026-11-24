import { track as trackVercel } from '@vercel/analytics'

type AnalyticsEvent = 'view_product' | 'view_review' | 'view_project' | 'view_video' | 'play_video' | 'affiliate_click' | 'creator_click' | 'compare_product' | 'quiz_complete' | 'share_product'
type Properties = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
const validMeasurementId = typeof measurementId === 'string' && /^G-[A-Z0-9]+$/.test(measurementId)
export const vercelEnabled = import.meta.env.VITE_VERCEL_ANALYTICS === 'true'
const customVercelEvents = vercelEnabled && import.meta.env.VITE_VERCEL_CUSTOM_EVENTS === 'true'
const analyticsKey = 'tadora:analytics-disabled'
let lastDisabled = false
let didInitialize = false

export function analyticsDisabled() {
  try {
    return window.localStorage.getItem(analyticsKey) === 'true'
  } catch {
    return lastDisabled
  }
}

export function setAnalyticsDisabled(disabled: boolean) {
  lastDisabled = disabled
  try {
    window.localStorage.setItem(analyticsKey, String(disabled))
  } catch {
    // The preference still applies for the current document.
  }
  window.location.reload()
}

export function initAnalytics() {
  if (didInitialize || analyticsDisabled() || !validMeasurementId) return
  didInitialize = true
  window.dataLayer ??= []
  window.gtag = function () {
    // Google tag expects the command to be passed as an Arguments object.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { allow_google_signals: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.append(script)
}

export function trafficSource() {
  const source = new URLSearchParams(window.location.search).get('utm_source')
  const referrer = document.referrer ? new URL(document.referrer) : undefined
  const external = referrer && referrer.origin !== window.location.origin ? referrer.hostname : undefined
  const current = source?.trim().slice(0, 100) || external
  if (analyticsDisabled()) return current || 'direct'
  try {
    if (current) window.sessionStorage.setItem('tadora:traffic-source', current)
    return current || window.sessionStorage.getItem('tadora:traffic-source') || 'direct'
  } catch {
    return current || 'direct'
  }
}

export function track(event: AnalyticsEvent, properties: Properties = {}) {
  if (analyticsDisabled()) return
  initAnalytics()
  const payload = { source_page: window.location.pathname, ...properties }
  window.gtag?.('event', event, payload)
  if (customVercelEvents) trackVercel(event, payload)
}
