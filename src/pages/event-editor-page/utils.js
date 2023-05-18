import {
  LOCATION_FILTERS,
  METHOD_FILTERS,
  OUTPUT_METHOD_FILTERS,
  SPORT_TYPES_FILTERS
} from '../filter-page/constants'

export const convertStringDateToStartTime = (date) => new Date(date)

export const convertRawTagsToEventTags = ({ tags1, tags2, tags3, sportTypes }) => {
  const tags = []
  const pairs = [
    [METHOD_FILTERS, tags1],
    [OUTPUT_METHOD_FILTERS, tags2],
    [LOCATION_FILTERS, tags3],
    [SPORT_TYPES_FILTERS, sportTypes]
  ]

  pairs.forEach((pair) => {
    pair[0].forEach((tag) => {
      if (pair[1].includes(tag.name)) {
        tags.push(tag.name)
      }
    })
  })

  return tags
}

const findSpecificTagsInTags = (generalTags, specificTags) =>
  specificTags.filter((t) => generalTags.includes(t.name)).map((t) => t.name)

export const convertEventTagsToRawTags = (tags) => {
  return {
    tags1: findSpecificTagsInTags(tags, METHOD_FILTERS).join('|'),
    tags2: findSpecificTagsInTags(tags, OUTPUT_METHOD_FILTERS).join('|'),
    tags3: findSpecificTagsInTags(tags, LOCATION_FILTERS).join('|'),
    sport_type: findSpecificTagsInTags(tags, SPORT_TYPES_FILTERS).join('|')
  }
}
