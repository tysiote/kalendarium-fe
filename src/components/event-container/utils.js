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

export const getEventById = (events, id) => events.filter((e) => e.id === id)

export const isEventOpened = (openedEvents, eventId) =>
  openedEvents.filter((id) => id === eventId)?.length > 0

const eventTimeSortFunction = (a, b) => {
  if (a['start_time'] < b['start_time']) {
    return -1
  }

  if (a['start_time'] > b['start_time']) {
    return 1
  }

  return a['id'] > b['id']
}
export const sortEventsByTime = (events) => {
  const result = [...events]
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
