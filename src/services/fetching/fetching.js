const translateDateIntoFetchingDate = (value) => {
  return Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(value)
    .replace(/\s/g, '')
}

export const fetchEventsFromDay = (value, from, to) => {
  const val1 = translateDateIntoFetchingDate(new Date(from ?? value))
  const nextDay = new Date(to ?? value)
  nextDay.setDate(nextDay.getDate() + 1)
  const val2 = translateDateIntoFetchingDate(nextDay)
  return fetch(
    `https://kalendarium.tasr.sk/public/kal-test.php/api/events/all?from=${val1}&to=${val2}`
  )
    .then((res) => res.json())
    .then((result) => result)
}
