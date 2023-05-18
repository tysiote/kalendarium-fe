import { useStore } from 'react-redux'
import { viewTypes } from '../../pages/views-page/constants'

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

export const getEventDateName = (value, viewDates, viewType) => {
  if (viewType === viewTypes.DAY) {
    return translateDateWithLocale(value, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const format = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const from = translateDateWithLocale(viewDates.from, format)
  const to = translateDateWithLocale(viewDates.to, format)
  if (viewType === viewTypes.MONTH) {
    const month = translateDateWithLocale(viewDates.from, { month: 'long' })
    return `${month} (${from} - ${to})`
  }

  return `${from} - ${to}`
}

export const getCurrentWeekdayName = (value) => {
  return translateDateWithLocale(value, { weekday: 'short' })
}

export const formatTime = (value, locale) => {
  return translateDateWithLocale(value, { hour: 'numeric', minute: '2-digit' }, locale)
}

export const formatDate = (value, locale) => {
  return translateDateWithLocale(
    value,
    { day: '2-digit', month: '2-digit', year: 'numeric' },
    locale
  )
}

export const getHeadlineTranslation = (viewType) => {
  switch (viewType) {
    case viewTypes.DAY:
      return ['events', 'eventsFromDay']
    case viewTypes.WEEK:
      return ['events', 'eventsFromWeek']
    case viewTypes.MONTH:
      return ['events', 'eventsFromMonth']
    case viewTypes.CUSTOM:
      return ['events', 'eventsFromCustom']
    default:
      return null
  }
}

export const checkInputDate = (isDate, value, locale) => {
  const components = value
    .replaceAll(' ', '')
    .split(isDate ? '.' : ':')
    .filter((component) => component?.length)
  const newDate = new Date()

  if (isDate) {
    const year = components[2] ?? newDate.getFullYear()
    newDate.setDate(parseInt(components[0]))
    newDate.setMonth(parseInt(components[1]) - 1)
    newDate.setFullYear(parseInt(year))
  } else {
    newDate.setHours(parseInt(components[0]))
    newDate.setMinutes(parseInt(components[1]))
  }

  if (isNaN(newDate.getTime())) {
    return null
  }

  if (isDate) {
    return { inputValue: formatDate(newDate, locale), value: newDate }
  }

  return { inputValue: formatTime(newDate, locale), value: newDate }
}

export const mergeDateAndTime = (date, time) => {
  if (!date || !time) {
    return null
  }
  const result = new Date()
  result.setDate(date.getDate())
  result.setMonth(date.getMonth())
  result.setFullYear(date.getFullYear())
  result.setHours(time.getHours())
  result.setMinutes(time.getMinutes())

  return result
}
