import { translations as pickerWithInputTranslations } from '../components/picker-with-input/translations'
import { translations as dateTimePickerTranslations } from '../components/date-time-picker/translations'
import { translations as mainDrawerTranslations } from '../components/main-drawer/translations'
import { translations as eventsTranslations } from '../components/event-container/translations'
import { useStore } from 'react-redux'

const mergeTranslations = (prevTranslations, nextTranslations) => ({
  ...prevTranslations,
  ...nextTranslations
})
const setTranslations = () => {
  const translationObjects = [
    pickerWithInputTranslations,
    dateTimePickerTranslations,
    mainDrawerTranslations,
    eventsTranslations
  ]
  let result = {}
  translationObjects.forEach((trans) => (result = mergeTranslations(result, trans)))

  return result
}
export const translations = setTranslations()

export const translate = (path, locale, quantity) => {
  let keys = [...path]
  let translationObject = translations
  let translationKey = keys.shift()
  const store = useStore()
  const finalLocale = locale || store.getState().locale.locale

  while (keys.length) {
    translationObject = translationObject[translationKey]
    translationKey = keys.shift()
  }

  if (translationObject?.[translationKey]?.[finalLocale]) {
    return quantity
      ? translationObject[translationKey].quantity[finalLocale]
      : translationObject[translationKey][finalLocale]
  }

  return path[path.length - 1]
}

export const quantityTranslate = (path, locale, value) => {
  const translationObject = translate(path, locale, true)
  let correctIndex = 0
  Object.keys(translationObject).forEach((key) => {
    const intKey = parseInt(key, 10)
    if (intKey <= value) {
      correctIndex = intKey
    }
  })
  return translationObject[correctIndex]
}