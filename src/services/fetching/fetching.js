const translateDateIntoFetchingDate = (value) => {
  return Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(value)
    .replace(/\s/g, '')
}

// const tempTranslateDateIntoTempBackendIndex = (value) => {
//   const baseDate = new Date(Date.UTC(2022, 11, 5, 0, 0, 0, 0))
//   const daysDiff = (new Date(value) - baseDate) / (1000 * 60 * 60 * 24)
//
//   return Math.floor(daysDiff)
// }

export const fetchEventsFromDay = (value, from, to) => {
  const val1 = translateDateIntoFetchingDate(from ?? value)
  const nextDay = new Date(to ?? value)
  nextDay.setDate(nextDay.getDate() + 1)
  const val2 = translateDateIntoFetchingDate(nextDay)
  return fetch(
    `https://kalendarium.tasr.sk/public/kal-test.php/api/events/all?from=${val1}&to=${val2}`,
    // `https://kalendarium.tasr.sk/public/index.php/api/events/all?from=${val1}&to=${val2}`,
    // `https://kalendarium.tasr.sk/public/index.php/login`,
    // `http://martinusmaco.sk/calendarium/kalendarium-new-test/index.php?from=${tempTranslateDateIntoTempBackendIndex(
    //   value
    // )}&to=${tempTranslateDateIntoTempBackendIndex(nextDay)}`
    {
      // method: 'GET',
      // body: JSON.stringify({
      //   username: 'maco',
      //   password_md5: '202cb962ac59075b964b07152d234b70',
      //   password: '539801954'
      // })
      // credentials: 'include'
      // headers: { 'Content-Type': 'application/json' }
    }
  )
    .then((res) => res.json())
    .then((result) => result)
}
