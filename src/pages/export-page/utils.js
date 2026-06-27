import { getTagsFromEvent } from '../../components/event/utils'
import { translate as _ } from '../../services/translations'
import { getCookieValue, setCookieValue } from '../login-page/utils'

export const formatExportDate = (value, technical = false, day = false, locale = 'sk-SK') => {
  const format = day ? { day: 'numeric', month: 'long' } : { hour: 'numeric', minute: '2-digit' }
  const formatter = Intl.DateTimeFormat(locale, format)
  const result = formatter.format(new Date(value))
  const finalResult = technical && !day ? timeToDoubleDigit(result).replace(':', '.') : result
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
  getTagsFromEvent({ tags })
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

const jsonExport = (events, headers) => {
  const result = {}
  result.events = events.map((evt) => copyEvent(evt))

  if (Object.keys(headers ?? {}).length) {
    result.headers = { top: headers?.top, bottom: headers?.bottom }
  }

  return JSON.stringify(result)
}

export const getJsonExportData = (events, headers) => {
  navigator.clipboard.writeText(jsonExport(events, headers))
}

export const technicalExport = (exporting_events, withContent, withDate, withEditors, headers) => {
  let res = ''
  if (headers) {
    const topHeaders = headers.top.replaceAll('\n', '<br>')
    res += `<div style="font-size: 12px; font-family: 'Courier New'">
    <div style="text-align: center; font-size: 12px; font-weight: bold; margin-bottom: 10px;">${topHeaders}</div>
    `
  }
  exporting_events.forEach((evt) => {
    res += technicalExportOne(evt, 79, withContent, withDate, withEditors)
  })
  if (headers) {
    const bottomHeaders = headers.bottom.replaceAll('\n', '<br>')
    res += `<div style="font-size: 10px; font-family: 'Courier New'">
    <div style="text-align: center; font-size: 12px; font-style: italic; margin-bottom: 10px;">${bottomHeaders}</div>
    `
  }
  const winPrint = window.open(
    '',
    '',
    'left=0,top=0,width=1024,height=768,toolbar=0,scrollbars=1,status=0'
  )
  winPrint.document.write(
    '<title>Print  Report</title><div style="font-size: 12px; font-family: \'Courier New\'">' +
      res +
      '</div>'
  )
  winPrint.document.close()
}

const technicalExportOne = (e, limit, content, withDate, withEditors) => {
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

  if (withEditors && e.editors && e.editors.length) {
    res += '<br>' + insertTechnicalBreakes(e.editors, limit - 10)
  }

  if (e.tags2?.length) {
    res +=
      '<br><br>' +
      insertTechnicalBreakes(
        getTagsFromEvent({ tags: e.tags2, withTranslations: true })
          .map((t) => t.variant)
          .join(', '),
        limit - 10
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

export const copyEventsToClipboard = ({
  events,
  withDescription,
  withDate,
  withEditors,
  tagsTranslations
}) => {
  const getEventStartTime = (startTime) =>
    withDate
      ? `${formatExportDate(new Date(startTime), false, true)} - ${formatExportDate(
          new Date(startTime)
        )}`
      : `${formatExportDate(new Date(startTime))}`

  const result = events.reduce(
    (acc, evt) =>
      acc +
      `\n${getEventStartTime(evt.start_time)}\t${evt.title}${
        withDescription ? `\t${evt.content.replaceAll('\n', ' ')}` : ''
      }\t${tagsTranslations[evt.tags2] ?? ''}${withEditors ? `\t${evt.editors}` : ''}`,
    ''
  )

  navigator.clipboard.writeText(result)
}

export const getDefaultEventsTagsTranslations = () => ({
  text: formatExportTags('text'),
  audio: formatExportTags('audio'),
  photo: formatExportTags('photo'),
  video: formatExportTags('video'),
  live: formatExportTags('live')
})

export const createDefaultHeaders = () => {
  const header1 = {
    id: 'home',
    label: 'Domáca redakcia',
    top: 'mail: domred@tasr.sk, tel.: +421 2 59 21 04 58\ndispecing@tasr.sk\n------------------------------------------------------\ntechnická podpora: 0905/505 721\n------------------------------------------------------',
    bottom:
      'Prehľad kultúrnych udalostí vychádza v domácom a easy servise o 17.00 h\n\nInformácie o očakávaných udalostiach nájdete aj v aplikácii TASR Kalendárium na adrese kalendarium.tasr.sk.'
  }

  const header2 = {
    id: 'sport',
    label: 'Športová redakcia',
    top: 'tel.: 02/59210545, 59210323\nmail: sport@tasr.sk\ntechnická podpora: 0905/505 721',
    bottom:
      'Informácie o očakávaných udalostiach nájdete aj v aplikácii TASR Kalendárium na adrese kalendarium.tasr.sk.'
  }

  const header3 = {
    id: 'foreign',
    label: 'Zahraničná redakcia',
    top: 'Telefón 02/592 10 363\nE-mail: foreign@tasr.sk\nTechnická podpora: 0905/505 721',
    bottom:
      'Informácie o očakávaných udalostiach nájdete aj v aplikácii TASR Kalendárium na adrese kalendarium.tasr.sk.'
  }

  const header4 = {
    id: 'economic',
    label: 'Ekonomická redakcia',
    top: 'mail: ekon@tasr.sk\ndispecing@tasr.sk\n------------------------------------------------------\ntechnická podpora: 0905/505 721\n------------------------------------------------------',
    bottom:
      'Informácie o očakávaných udalostiach nájdete aj v aplikácii TASR Kalendárium na adrese kalendarium.tasr.sk.'
  }

  const headers = JSON.stringify([header1, header2, header3, header4])
  setCookieValue('headers', headers)

  return headers
}

export const getCookieHeaders = () => {
  const cookieHeaders = getCookieValue('headers')
  const cookieHeadersVersion = getCookieValue('headersVersion')
  const CURRENT_HEADERS_VERSION = '1'
  let headers = JSON.parse(cookieHeaders || '[]')

  if (!cookieHeaders || cookieHeadersVersion !== CURRENT_HEADERS_VERSION) {
    setCookieValue('headersVersion', CURRENT_HEADERS_VERSION)
    headers = JSON.parse(createDefaultHeaders())
  }

  return headers
}
