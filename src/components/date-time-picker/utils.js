import { useStore } from 'react-redux'

export const isSameMonth = (date1, date2) => {
  if (!date1 || !date2) {
    return false
  }
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

export const checkHourInput = (input) => {
  const numericValue = parseInt(input, 10)
  return numericValue >= 0 && numericValue < 24
}

export const checkMinuteInput = (input) => {
  const numericValue = parseInt(input, 10)
  return numericValue >= 0 && numericValue < 60
}

export const incrementHours = (oldDate, increment) => {
  return incrementTime(oldDate, increment, 24, 'getHours')
}

export const incrementMinutes = (oldDate, increment) => {
  return incrementTime(oldDate, increment, 60, 'getMinutes', 5)
}

const findNextModule = (number, roundTo, positive) => {
  let n = number
  while (n % roundTo !== 0) {
    n = positive ? n - 1 : n + 1
  }

  return n
}
const incrementTime = (oldDate, increment, limit, method, round) => {
  const oldTime = oldDate[method]()
  const newTimeSum = oldTime + increment
  let newTimeModulo = newTimeSum >= 0 ? newTimeSum % limit : limit + newTimeSum

  if (round) {
    newTimeModulo = findNextModule(newTimeModulo, round, increment > 0)
  }

  return newTimeModulo
}

export const compareDates = (date1, date2) => {
  return isSameMonth(date1, date2) && date1.getDate() === date2.getDate()
}

export const isDateToday = (date) => compareDates(date, new Date())

export const getWeekdayNames = () => {
  const result = []
  let day = new Date(Date.UTC(2022, 11, 5, 12, 0, 0, 0)) // monday
  for (let i = 0; i < 7; i += 1) {
    result.push(getCurrentWeekdayName(day))
    day = new Date(day)
    day.setDate(day.getDate() + 1)
  }

  return result
}
export const getWeekFromDate = (monday, monthIndex) => {
  const result = []
  let dayInWeek = new Date(monday)

  for (let i = 0; i < 7; i += 1) {
    result.push({
      date: dayInWeek,
      sameMonth: dayInWeek.getMonth() === monthIndex,
      label: dayInWeek.getDate(),
      isToday: isDateToday(dayInWeek)
    })
    dayInWeek = new Date(dayInWeek)
    dayInWeek.setDate(dayInWeek.getDate() + 1)
  }

  return result
}

export const getFirstDayOfMonth = (date) => {
  const result = new Date(date)
  result.setDate(1)
  return result
}

export const findMondayInWeek = (dayInWeek) => {
  const givenDay = dayInWeek.getDay()
  if (givenDay === 1) {
    return new Date(dayInWeek)
  }

  const resultDay = new Date(dayInWeek)
  if (givenDay === 0) {
    resultDay.setDate(resultDay.getDate() - 6)
  } else {
    resultDay.setDate(resultDay.getDate() - givenDay + 1)
  }

  return resultDay
}

export const getMonthData = (startingDate) => {
  const result = []
  const monday = findMondayInWeek(startingDate)

  for (let i = 0; i < 6; i += 1) {
    result.push(getWeekFromDate(monday, startingDate.getMonth()))
    monday.setDate(monday.getDate() + 7)
  }

  return result
}

export const isElementWithinFocused = (element) => {
  if (document?.activeElement === element) {
    return true
  }

  return document?.activeElement?.parentElement
    ? isElementWithinFocused(document.activeElement.parentElement)
    : false
}

export const setToToday = (value) => {
  const result = new Date(value)
  const today = new Date()
  result.setDate(today.getDate())
  result.setMonth(today.getMonth())
  result.setFullYear(today.getFullYear())

  return result
}

export const translateDateWithLocale = (value, format, locale) => {
  let finalLocale = locale
  if (!finalLocale) {
    const store = useStore()
    finalLocale = store.getState().locale.locale
  }
  return Intl.DateTimeFormat(finalLocale, format).format(value)
}
export const getCurrentMonthName = (value) => {
  return translateDateWithLocale(value, { month: 'long', year: 'numeric' })
}

export const getCurrentDateName = (value) => {
  return translateDateWithLocale(value, { weekday: 'long', day: 'numeric', month: 'long' })
}

export const getEventDateName = (value) => {
  return translateDateWithLocale(value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export const getCurrentWeekdayName = (value) => {
  return translateDateWithLocale(value, { weekday: 'short' })
}

export const formatTime = (value, locale) => {
  return translateDateWithLocale(value, { hour: 'numeric', minute: '2-digit' }, locale)
}

export const formatDate = (value, locale) => {
  return translateDateWithLocale(value, { day: 'numeric', month: 'long' }, locale)
}
