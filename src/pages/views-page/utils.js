import { viewTypes } from './constants'

export const getWeeks = (dateFrom = new Date(), count = 5) => {
  const result = []
  const startingMonday = findPreviousMonday(dateFrom)
  startingMonday.setHours(0)
  startingMonday.setMinutes(0)
  startingMonday.setSeconds(0)
  startingMonday.setMilliseconds(0)
  let tempDate = new Date(startingMonday)

  for (let i = 0; i < count; i += 1) {
    const week = { from: new Date(tempDate) }
    tempDate = new Date(tempDate)
    tempDate.setDate(tempDate.getDate() + 7)
    tempDate.setSeconds(tempDate.getSeconds() - 1)
    week.to = new Date(tempDate)
    tempDate.setSeconds(tempDate.getSeconds() + 1)
    result.push(week)
  }

  return result
}

const findPreviousMonday = (date) => {
  const weekDay = date.getDay()
  const tempDate = new Date(date)
  if (weekDay === 1) {
    return new Date(date)
  }

  if (weekDay === 0) {
    tempDate.setDate(tempDate.getDate() - 6)
  } else {
    tempDate.setDate(tempDate.getDate() - weekDay + 1)
  }

  return tempDate
}

export const formatDate = (
  date,
  format = { day: '2-digit', month: '2-digit' },
  locale = 'sk-SK'
) => {
  const formatter = Intl.DateTimeFormat(locale, format)
  return formatter.format(date)
}

export const formatMonth = (date, format = { month: 'long', year: 'numeric' }, locale = 'sk-SK') =>
  formatDate(date, format, locale)

export const getMonths = (dateFrom = new Date(), count = 5) => {
  const result = []
  const startingMonth = new Date(dateFrom)
  startingMonth.setHours(0)
  startingMonth.setMinutes(0)
  startingMonth.setSeconds(0)
  startingMonth.setMilliseconds(0)
  startingMonth.setDate(1)
  let tempDate = new Date(startingMonth)

  for (let i = 0; i < count; i += 1) {
    result.push(new Date(tempDate))
    tempDate = new Date(tempDate)
    tempDate.setMonth(tempDate.getMonth() + 1)
  }

  return result
}

export const getFromTo = (options) => {
  const { from, to, viewType, weekIndex, monthIndex } = options

  if (viewType === viewTypes.CUSTOM) {
    return { from, to }
  }

  if (viewType === viewTypes.DAY) {
    return { from: null, to: null }
  }

  if (viewType === viewTypes.WEEK) {
    const weeks = getWeeks()
    return { from: weeks[weekIndex].from, to: weeks[weekIndex].to }
  }

  if (viewType === viewTypes.MONTH) {
    const months = getMonths()
    const lastDayInMonth = new Date(months[monthIndex])
    lastDayInMonth.setMonth(lastDayInMonth.getMonth() + 1)
    lastDayInMonth.setSeconds(lastDayInMonth.getSeconds() - 1)
    return { from: months[monthIndex], to: lastDayInMonth }
  }
}

export const getDynamicViewLabels = (_) => {
  const { CUSTOM, DAY, MONTH, WEEK } = viewTypes
  const viewsToRender = [DAY, WEEK, MONTH, CUSTOM]

  return viewsToRender.reduce(
    (result, view) => ({
      ...result,
      [view]: _(['views', `view${view[0].toUpperCase()}${view.slice(1)}`])
    }),
    {}
  )
  // _(['views', `view${view[0].toUpperCase()}${view.slice(1)}`])
}
