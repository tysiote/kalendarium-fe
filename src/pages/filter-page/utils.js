import { filterGroups, filterGroupsTranslations } from './constants'

export const isFilterChecked = (filters, filterName) => filters.includes(filterName)

export const updateFilters = (filters, filterName) =>
  isFilterChecked(filters, filterName)
    ? [...filters].filter((fN) => fN !== filterName)
    : [...filters, filterName]

export const translateFilters = (selectedFilters) => {
  const result = {}
  for (const [key, value] of Object.entries(filterGroups)) {
    result[key] = value.filter((f) => selectedFilters.includes(f.name))
  }

  return result
}

export const getFilterTranslationByKeyword = (keyword) => filterGroupsTranslations[keyword]
