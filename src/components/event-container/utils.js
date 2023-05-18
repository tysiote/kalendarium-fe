import { isAddedToday, isSameDay } from '../event/utils'

export const toggleEventOpen = (openedEvents, eventId) => {
  const result = []
  openedEvents.forEach((id) => {
    if (!id === eventId) {
      result.push(id)
    }
  })

  if (result.length === openedEvents.length) {
    result.push(eventId)
  }

  return result
}

export const getEventById = (events, id) => events.filter((e) => e.id === id)[0]

export const isEventOpened = (openedEvents, eventId) =>
  openedEvents.filter((id) => id === eventId)?.length > 0

const sameDayNoTimeComparison = (a, b) => {
  if (
    ((a['no_time'] && !b['no_time']) || (!a['no_time'] && b['no_time'])) &&
    isSameDay(new Date(a['start_time']), new Date(b['start_time']))
  ) {
    return a['no_time'] ? -1 : 1
  }

  return null
}

const eventTimeSortFunction = (a, b) => {
  const sameDayNoTimeDiff = sameDayNoTimeComparison(a, b)
  if (sameDayNoTimeDiff != null) {
    return sameDayNoTimeDiff
  }

  return a['start_time'] > b['start_time'] ? 1 : -1
}

const removeDeletedEvents = (events) =>
  events.filter(
    (e) =>
      !e.deleted || (isAddedToday(e.start_time, e.deleted) && isAddedToday(new Date(), e.deleted))
  )

export const sortEventsByTime = (events) => {
  const result = removeDeletedEvents(events)
  result.sort(eventTimeSortFunction)
  return result
}

export const getSwitchState = (events, openedEvents) =>
  events?.length && events.length === openedEvents?.length

export const getNextOpenedEventsState = (events, openedEvents) =>
  getSwitchState(events, openedEvents) ? [] : events.map((item) => item.id)

const normalize = (str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '')
export const filterEventsByKeyword = (events, keyword) => {
  const checkTitle = (event) => {
    return event.title
      ? normalize(event.title).toLowerCase().includes(normalize(keyword).toLowerCase())
      : false
  }

  const checkContent = (event) => {
    return event.content
      ? normalize(event.content).toLowerCase().includes(normalize(keyword).toLowerCase())
      : false
  }
  return events?.filter((event) => checkContent(event) || checkTitle(event))
}

const hasEventTags = (event, key, value) => {
  if (!event[key]?.length) {
    return false
  }

  const eventTags = event[key].includes('|') ? event[key].split('|') : [event[key]]

  for (let i = 0; i < eventTags.length; i += 1) {
    if (value.includes(eventTags[i])) {
      return true
    }
  }

  return false
}

export const filterEvents = (filters, events, searchValue = '') => {
  let result = [...events]
  for (const [key, value] of Object.entries(filters)) {
    if (value.length) {
      result = result.filter((evt) =>
        hasEventTags(
          evt,
          key,
          value.map((tag) => tag.name)
        )
      )
    }
  }

  result = filterEventsByKeyword(result, searchValue)

  return result
}

export const getActiveFiltersArray = (filters) => {
  const result = []
  for (const [key, value] of Object.entries(filters)) {
    if (value.length) {
      result.push([key, ...value])
    }
  }

  return result
}

export const removeActiveFilter = (filters, filterName) => {
  const result = {}
  for (const [key, value] of Object.entries(filters)) {
    result[key] = value.filter((f) => f.name !== filterName)
  }

  return result
}

export const createFlatFilters = (filters) => {
  const result = []
  for (const [key] of Object.entries(filters)) {
    result.push(...filters[key].map((f) => f.name))
  }

  return result
}

export const getExportingEvents = (oldEvents, newEvent, value) => {
  const eventList = oldEvents.filter((evt) => evt !== newEvent)

  return value ? eventList.concat(newEvent) : eventList
}

export const areAllEventsExporting = (events, exportingEvents) =>
  events?.length > 0 && events.length === exportingEvents.length

export const getEventsToExportById = (events, eventsWithId) =>
  events.filter((evt) => eventsWithId.includes(evt.id))
