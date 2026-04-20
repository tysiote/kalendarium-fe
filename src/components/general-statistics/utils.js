export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getThisMonthAndYearName = (locale = 'sk-SK') => {
  const date = new Date()

  return date.toLocaleString(locale, { month: 'long', year: 'numeric' })
}
