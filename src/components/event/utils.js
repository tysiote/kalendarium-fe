import { useStore } from 'react-redux'

export const getEventTime = (eventStartTime, noTime, withDate) => {
  const store = useStore()
  const locale = store.getState().locale.locale
  let format = {}
  if (!noTime) {
    format.hour = 'numeric'
    format.minute = 'numeric'
  }
  let formatter = Intl.DateTimeFormat(locale, format)
  const timePart = noTime ? '' : `[${formatter.format(new Date(eventStartTime))}]`
  if (!withDate) {
    return timePart
  }

  format = {
    day: 'numeric',
    month: 'long'
  }
  formatter = Intl.DateTimeFormat(locale, format)
  const datePart = formatter.format(new Date(eventStartTime))

  return `${datePart} ${timePart} - `
}

export const getEditorsFromEvent = (editors) =>
  editors.includes('|') ? editors.split('|') : [editors]

export const getTagsFromEvent = (tags, editors, withTranslations) =>
  createObjectsFromTags(
    (editors?.length ? getEditorsFromEvent(editors) : []).concat(
      removeDuplicates(tags?.length ? (tags.includes('|') ? tags.split('|') : [tags]) : [])
    ),
    withTranslations
  )
const VALID_TAGS = ['text', 'video', 'audio', 'photo', 'live']
const tagsTranslations = {
  text: 'text',
  video: 'video',
  audio: 'zvuk',
  photo: 'foto',
  live: 'live'
}
const createObjectsFromTags = (tags, withTranslations) =>
  tags.map((tag) =>
    VALID_TAGS.includes(tag)
      ? { variant: withTranslations ? tagsTranslations[tag] : tag }
      : { variant: 'editor', title: tag }
  )

const removeDuplicates = (collection) => {
  const result = []
  collection.forEach((item) => {
    if (!result.includes(item)) {
      result.push(item)
    }
  })

  return result
}

export const isSameDay = (day1, day2) =>
  day1.getDate() === day2.getDate() &&
  day1.getMonth() === day2.getMonth() &&
  day1.getFullYear() === day2.getFullYear()

export const isAddedToday = (startTime, added) =>
  isSameDay(new Date(startTime), new Date(added)) && isSameDay(new Date(added), new Date())
