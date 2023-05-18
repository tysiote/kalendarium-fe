import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TButton } from '../../components/button'
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from '@mui/material'
import { isFilterChecked, translateFilters, updateFilters } from './utils'
import { translate as _ } from '../../services/translations'
import {
  LOCATION_FILTERS,
  METHOD_FILTERS,
  OUTPUT_METHOD_FILTERS,
  SPORT_TYPES_FILTERS
} from './constants'
import './filter-page.scss'

export const FilterPage = ({ initialFilters, onFilterApply, onFilterClose }) => {
  const [filters, setFilters] = useState(initialFilters ?? [])

  const handleOnFilterApply = () => {
    onFilterApply(filters, translateFilters(filters))
  }

  const handleOnFilterClose = () => {
    onFilterClose()
  }

  const handleOnFilterClick = (filterName) => {
    setFilters(updateFilters(filters, filterName))
  }

  const renderFilterGroup = (filterGroup, groupName, disabled) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} className="location-filter-container">
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">{_(['filters', groupName])}</FormLabel>
          <FormGroup>
            {filterGroup.map((f, idx) => (
              <FormControlLabel
                key={`filter-checkbox-${idx}-${f.name}`}
                control={
                  <Checkbox
                    checked={!disabled && isFilterChecked(filters, f.name)}
                    onChange={() => handleOnFilterClick(f.name)}
                    name={f.name}
                    disabled={disabled}
                  />
                }
                label={_(f.translation)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>
    )
  }

  return (
    <div className="filter-page">
      <h2>{_(['filters', 'filtersLabel'])}</h2>
      <div className="filter-container">
        <Grid container spacing={2}>
          {renderFilterGroup(METHOD_FILTERS, 'filterMethodLabel')}
          {renderFilterGroup(LOCATION_FILTERS, 'filterLocationLabel')}
          {renderFilterGroup(OUTPUT_METHOD_FILTERS, 'filterOutputMethodLabel')}
          {renderFilterGroup(
            SPORT_TYPES_FILTERS,
            'filterSportLabel',
            !isFilterChecked(filters, 'sport')
          )}
        </Grid>
      </div>
      <div className="filter-page-buttons">
        <TButton
          onClick={handleOnFilterClose}
          id="dismiss-filter-button"
          className="filter-button dismiss-filter-button">
          {_(['filters', 'dismissFiltersLabel'])}
        </TButton>
        <TButton
          onClick={handleOnFilterApply}
          id="apply-filter-button"
          className="filter-button apply-filter-button">
          {_(['filters', 'applyFiltersLabel'])}
        </TButton>
      </div>
    </div>
  )
}

FilterPage.propTypes = {
  onFilterApply: PropTypes.func.isRequired,
  onFilterClose: PropTypes.func.isRequired,
  initialFilters: PropTypes.array
}

FilterPage.defaultProps = {
  initialFilters: []
}
