export const LOCATION_FILTERS = [
  { name: 'ba', translation: ['filters', 'filterLocationBA'] },
  { name: 'tt', translation: ['filters', 'filterLocationTT'] },
  { name: 'tn', translation: ['filters', 'filterLocationTN'] },
  { name: 'nr', translation: ['filters', 'filterLocationNR'] },
  { name: 'bb', translation: ['filters', 'filterLocationBB'] },
  { name: 'za', translation: ['filters', 'filterLocationZA'] },
  { name: 'po', translation: ['filters', 'filterLocationPO'] },
  { name: 'ke', translation: ['filters', 'filterLocationKE'] }
]

export const METHOD_FILTERS = [
  { name: 'home', translation: ['filters', 'filterMethodDomestic'] },
  { name: 'economic', translation: ['filters', 'filterMethodEconomy'] },
  { name: 'abroad', translation: ['filters', 'filterMethodForeign'] },
  { name: 'sport', translation: ['filters', 'filterMethodSport'] },
  { name: 'culture', translation: ['filters', 'filterMethodCulture'] },
  { name: 'hungary', translation: ['filters', 'filterMethodHungary'] }
]

export const OUTPUT_METHOD_FILTERS = [
  { name: 'text', translation: ['filters', 'filterOutputMethodText'] },
  { name: 'video', translation: ['filters', 'filterOutputMethodVideo'] },
  { name: 'audio', translation: ['filters', 'filterOutputMethodAudio'] },
  { name: 'photo', translation: ['filters', 'filterOutputMethodPhoto'] },
  { name: 'live', translation: ['filters', 'filterOutputMethodLive'] }
]

export const SPORT_TYPES_FILTERS = [
  { name: 'default_sport', translation: ['filters', 'filterSportGeneric'] },
  { name: 'football', translation: ['filters', 'filterSportFootball'] },
  { name: 'hockey', translation: ['filters', 'filterSportHockey'] },
  { name: 'tennis', translation: ['filters', 'filterSportTennis'] },
  { name: 'athletics', translation: ['filters', 'filterSportAthletics'] },
  { name: 'ski', translation: ['filters', 'filterSportSkiing'] },
  { name: 'motor', translation: ['filters', 'filterSportCars'] }
]

export const filterGroups = {
  tags1: METHOD_FILTERS,
  tags2: OUTPUT_METHOD_FILTERS,
  tags3: LOCATION_FILTERS,
  sport_type: SPORT_TYPES_FILTERS
}

export const filterGroupsTranslations = {
  tags1: ['filters', 'filterMethodLabel'],
  tags2: ['filters', 'filterOutputMethodLabel'],
  tags3: ['filters', 'filterLocationLabel'],
  sport_type: ['filters', 'filterSportLabel']
}
