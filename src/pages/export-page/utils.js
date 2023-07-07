import { getTagsFromEvent } from '../../components/event/utils'
import { translate as _ } from '../../services/translations'

export const formatExportDate = (value, technical = false, day = false, locale = 'sk-SK') => {
  const format = day ? { day: 'numeric', month: 'long' } : { hour: 'numeric', minute: '2-digit' }
  const formatter = Intl.DateTimeFormat(locale, format)
  const result = formatter.format(new Date(value))
  const finalResult = technical && !day ? timeToDoubleDigit(result).replace(':', '.') : result
  console.log(result, finalResult)
  return result === '0:00' ? '' : finalResult
}

const timeToDoubleDigit = (value) => {
  let hours = value.split(':')[0]
  const minutes = value.split(':')[1]

  if (hours.length === 1) {
    hours = `0${hours}`
  }

  return `${hours}:${minutes}`
}

const getWeekDay = (value, locale = 'sk-SK') =>
  Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(value))

export const formatExportTags = (tags) =>
  getTagsFromEvent(tags)
    .map((t) =>
      _(['filters', `filterOutputMethod${t.variant[0].toUpperCase()}${t.variant.slice(1)}`])
    )
    .join(', ')

const convertDateToJsonDate = (date) => {
  let formatter = null

  formatter = new Intl.DateTimeFormat('sk-SK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  return formatter.format(date)
}
const copyEvent = (event) => {
  const localTime = new Date(event.start_time)
  const localTimeFormatted = convertDateToJsonDate(localTime)

  return {
    content: event.content,
    id: event.id,
    no_time: event.no_time,
    start_time_utc: new Date(event.start_time),
    start_time: localTimeFormatted,
    title: event.title
  }
}

const jsonExport = (events) => {
  const result = events.map((evt) => copyEvent(evt))
  return JSON.stringify(result)
}

export const getJsonExportData = (events) => {
  navigator.clipboard.writeText(jsonExport(events))
}

export const technicalExport = (exporting_events, withContent, withDate) => {
  let res = ''
  exporting_events.forEach((evt) => {
    res += technicalExportOne(evt, 79, withContent, withDate)
  })
  const winPrint = window.open(
    '',
    '',
    'left=0,top=0,width=1024,height=768,toolbar=0,scrollbars=1,status=0'
  )
  winPrint.document.write(
    '<title>Print  Report</title><div style="font-size: 10px; font-family: \'Courier New\'">' +
      res +
      '</div>'
  )
  winPrint.document.close()
}

const technicalExportOne = (e, limit, content, withDate) => {
  let res = ''

  if (withDate) {
    res += `${formatExportDate(e.start_time, true, true)} - ${getWeekDay(e.start_time)}<br><br>`
  }

  if (e.title.length < limit - 10) {
    if (e.no_time) {
      res += '&nbsp;'.repeat(10) + e.title
    } else {
      res += formatExportDate(e.start_time, true) + '&nbsp;'.repeat(5) + e.title
    }
  } else {
    if (e.no_time) {
      res += insertTechnicalBreakes(e.title, limit - 10)
    } else {
      res +=
        formatExportDate(e.start_time, true) +
        '&nbsp;'.repeat(5) +
        insertTechnicalBreakes(e.title, limit - 10, false, true)
    }
  }

  res += '<br>'

  if (content && e.content && e.content.length) {
    res += insertTechnicalBreakes(e.content, limit - 10)
  }

  if (e.tags2?.length) {
    res +=
      '<br>' +
      insertTechnicalBreakes(
        getTagsFromEvent(e.tags2, undefined, true)
          .map((t) => t.variant)
          .join(', '),
        limit - 10,
        true
      )
  } else {
    res += '<br>'
  }

  res += '<br><br><br>'
  return res
}

const insertTechnicalBreakes = (s, limit, reversed, no_line_break) => {
  let res = ''
  let words = []
  s.split(' ').forEach(function (w) {
    let w2 = ''

    for (let i = 0; i < w.length; i++) {
      if (w.charCodeAt(i) === 10) {
        words.push(w2)
        words.push('<br>')
        w2 = ''
      } else {
        w2 += w[i]
      }
    }

    if (w2.length) words.push(w2)
  })
  let counter = 0
  let line_break = !no_line_break
  let line = ''

  while (words.length) {
    let word = words.shift()

    if (line_break) {
      line += '&nbsp;'.repeat(10)
      line_break = false
    }

    if (word === '<br>') {
      if (line && line.length) {
        res += line + '<br>'
      }

      counter = 0
      line = '&nbsp;'.repeat(10)
    } else {
      line += word + ' '
      counter += word.length + 1
    }
  }

  if (reversed) {
    res += '&nbsp;'.repeat(limit - counter) + line
  } else {
    res += line
  }

  return res
}
