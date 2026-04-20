const futureDate = new Date(4103911746081) // year 2100

const sortLog = (log) => ({
  ...log,
  sort_action: log.action ?? '',
  sort_value: log.value ?? '',
  sort_name: log.name ?? '',
  sort_timestamp: new Date(log.timestamp ?? futureDate)
})

export const sortLogs = (logs, sortBy, asc) => {
  const data = logs.map((log) => sortLog(log))
  const key = `sort_${sortBy}`

  data.sort((a, b) => {
    const val = asc ? 1 : -1
    return a[key] > b[key] ? val : -val
  })

  return data
}

export const formatDate = (date, locale = 'sk-SK') => {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return ''
  }

  return Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(d)
}
