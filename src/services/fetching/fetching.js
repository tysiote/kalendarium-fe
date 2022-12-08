const translateDateIntoFetchingDate = (value) => {
  return Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(value)
    .replace(/\s/g, '')
}

const tempTranslateDateIntoTempBackendIndex = (value) => {
  const baseDate = new Date(Date.UTC(2022, 11, 5, 0, 0, 0, 0))
  const daysDiff = (new Date(value) - baseDate) / (1000 * 60 * 60 * 24)

  return Math.floor(daysDiff)
}

export const fetchEventsFromDay = (value) => {
  const val1 = translateDateIntoFetchingDate(value)
  const nextDay = new Date(value)
  nextDay.setDate(value.getDate() + 1)
  const val2 = translateDateIntoFetchingDate(nextDay)
  console.log({ val1, val2, value, nextDay })
  return fetch(
    // `https://kalendarium.tasr.sk/public/index.php/api/events/all?from=${val1}&to=${val2}`
    `http://martinusmaco.sk/calendarium/kalendarium-new-test/index.php?from=${tempTranslateDateIntoTempBackendIndex(
      value
    )}&to=${tempTranslateDateIntoTempBackendIndex(nextDay)}`
  )
    .then((res) => res.json())
    .then((result) => result)
}
