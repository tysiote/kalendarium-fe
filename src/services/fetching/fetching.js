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

const getFormattedDate = (date) => {
  const today = date ?? new Date()
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
}

export const getDailyPlan = async (date = new Date()) => {
  return fetch(`https://kalendarium.tasr.sk/public/index.php/api/dailyPlan`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ date: getFormattedDate(date) })
  })
    .then((res) => res.json())
    .then((result) => result)
}

export const saveDailyPlan = async (content, date = new Date()) => {
  return fetch(`https://kalendarium.tasr.sk/public/index.php/api/dailyPlanSave`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ date: getFormattedDate(date), content })
  })
    .then((res) => res.json())
    .then((result) => result)
}
