import { useStore } from 'react-redux'

export const getEventTime = (eventStartTime, noTime) => {
  const store = useStore()
  const locale = store.getState().locale.locale
  const format = {}
  if (!noTime) {
    format.hour = 'numeric'
    format.minute = 'numeric'
  }
  const formatter = Intl.DateTimeFormat(locale, format)
  return noTime ? '' : `[${formatter.format(new Date(eventStartTime))}]`
}
