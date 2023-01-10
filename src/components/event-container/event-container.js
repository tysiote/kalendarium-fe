import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate as _, quantityTranslate as qT } from '../../services/translations'
import { getEventDateName, getHeadlineTranslation } from '../date-time-picker/utils'
import { Event } from '../event'
import {
  areAllEventsExporting,
  createFlatFilters,
  filterEvents,
  getActiveFiltersArray,
  getExportingEvents,
  getNextOpenedEventsState,
  getSwitchState,
  isEventOpened,
  removeActiveFilter
} from './utils'
import { Switch, FormControlLabel, CircularProgress } from '@mui/material'

import './event-container.scss'
import { TInput } from '../input'
import { getFilterTranslationByKeyword } from '../../pages/filter-page/utils'
import { TButton } from '../button'
import { viewTypes } from '../../pages/views-page/constants'

export const EventContainer = ({
  events,
  day,
  viewDates,
  viewType,
  loading,
  filters,
  onFilterRemove,
  onExportingModeChange,
  onExportingEventsChange
}) => {
  const [openedEvents, setOpenedEvents] = useState([])
  const [showEditors, setShowEditors] = useState(false)
  const [exportingMode, setExportingMode] = useState(false)
  const [exportingEvents, setExportingEvents] = useState([])
  const [allEventsChecked, setAllEventsChecked] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(
    loading ? [] : filterEvents(filters, events, searchValue)
  )

  useEffect(() => {
    setOpenedEvents([])
    setAllEventsChecked(false)
    setSearchValue('')
    setFilteredEvents(loading ? [] : filterEvents(filters, events, searchValue))
    setExportingEvents([])
  }, [events, filters])

  const handleOnEventClick = (eventId, newState) => {
    const newOpenedItems = newState
      ? [...openedEvents, eventId]
      : openedEvents.filter((itemId) => itemId !== eventId)

    setOpenedEvents(newOpenedItems)
    setAllEventsChecked(getSwitchState(events, newOpenedItems))
  }

  const handleOnEventExportClick = (eventId, checked) => {
    const newValue = getExportingEvents(exportingEvents, eventId, checked)
    setExportingEvents(newValue)
    onExportingEventsChange(newValue)
  }

  const handleOnAllEventExportClick = () => {
    const newValue = areAllEventsExporting(events, exportingEvents)
      ? []
      : events.map((evt) => evt.id)
    setExportingEvents(newValue)
    onExportingEventsChange(newValue)
  }

  const handleOnExportSwitchClick = () => {
    const newValue = !exportingMode
    setExportingMode(newValue)
    onExportingModeChange(newValue)
  }

  const handleShowEditorsClick = () => {
    setShowEditors(!showEditors)
  }

  const handleOnOpenAllClick = () => {
    const nextOpenedItems = getNextOpenedEventsState(events, openedEvents)
    setOpenedEvents(nextOpenedItems)
    setAllEventsChecked(getSwitchState(events, nextOpenedItems))
  }

  const handleOnSearchChange = (newValue) => {
    setSearchValue(newValue)
    setFilteredEvents(loading ? [] : filterEvents(filters, events, newValue))
  }

  const handleOnFilterClick = (filterName) => {
    const newFilters = removeActiveFilter(filters, filterName)
    const newFlatFilters = createFlatFilters(newFilters)
    onFilterRemove(newFlatFilters, newFilters)
  }

  const renderHeadline = () => {
    const eventsCount = events?.length ?? 0

    return (
      <div className="event-container-headline">
        {`${_(getHeadlineTranslation(viewType))} `}
        <span className="headline-date">{getEventDateName(day, viewDates, viewType)}</span>

        <span className="headline-events-number">
          {` (${eventsCount} ${qT(['events', 'xEvents'], null, eventsCount)})`}
        </span>
      </div>
    )
  }

  const renderLoading = () => {
    return (
      <div className="loader">
        <CircularProgress />
        <span>{`${_(['events', 'loading'])} ...`}</span>
      </div>
    )
  }

  const renderControls = () => {
    return (
      <>
        <div className="events-controls">
          <FormControlLabel
            control={
              <Switch
                onChange={() => handleOnExportSwitchClick()}
                checked={exportingMode}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={`${_(['events', 'exportingMode'])}`}
          />
          <FormControlLabel
            control={
              <Switch
                onChange={() => handleOnOpenAllClick()}
                checked={allEventsChecked}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={`${_(['events', 'openAllEvents'])}`}
          />
          <FormControlLabel
            control={
              <Switch
                onChange={() => handleShowEditorsClick()}
                checked={showEditors}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={`${_(['events', 'showEditors'])}`}
          />
          {exportingMode && (
            <div className="event-controls-secondary">
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => handleOnAllEventExportClick()}
                    checked={areAllEventsExporting(events, exportingEvents)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={`${_(['events', 'exportAllEvents'])}`}
              />
            </div>
          )}
          {renderActiveFilters()}
          <TInput
            className="events-search-bar"
            value={searchValue}
            onChange={handleOnSearchChange}
            label={_(['events', 'searchEvents'])}
          />
        </div>
      </>
    )
  }
  const renderEvents = () => {
    return (
      <div className="events">
        {filteredEvents.map((item) => {
          return (
            <Event
              data={item}
              onClick={handleOnEventClick}
              key={`event-row-${item.id}`}
              isOpened={isEventOpened(openedEvents, item.id)}
              withDate={viewType !== viewTypes.DAY}
              showEditors={showEditors}
              exportingMode={exportingMode}
              onExport={handleOnEventExportClick}
              isExported={exportingEvents.includes(item.id)}
            />
          )
        })}
      </div>
    )
  }

  const renderActiveFilters = () => {
    const filtersCount = createFlatFilters(filters).length

    if (!filtersCount) {
      return null
    }

    return (
      <div className="active-filters">
        <span className="active-filters-message">{` ${_([
          'events',
          'activeFiltersMessage'
        ])} ${filtersCount} ${qT(['events', 'activeFilter'], null, filtersCount)}:`}</span>
        {getActiveFiltersArray(filters).map((tags) => {
          return (
            <div className="active-filters-group" key={`active-filter-group-${tags}`}>
              {tags.map((f, idx) => {
                if (idx === 0) {
                  return (
                    <div className="active-filter-item-group" key={`active-filter-item-group-${f}`}>
                      {`${_(getFilterTranslationByKeyword(f))}: `}
                    </div>
                  )
                }
                return (
                  <TButton
                    className="active-filter-item"
                    key={`active-filter-item-${f.name}`}
                    onClick={() => handleOnFilterClick(f.name)}
                    id={`active-filter-item-${f.name}`}
                    variant="text">
                    {_(f.translation)}
                  </TButton>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="event-container">
      {renderHeadline()}
      {renderControls()}
      {/*{renderLoading()}*/}
      {loading ? renderLoading() : renderEvents()}
    </div>
  )
}

EventContainer.propTypes = {
  events: PropTypes.array,
  day: PropTypes.instanceOf(Date).isRequired,
  onFilterRemove: PropTypes.func.isRequired,
  onExportingModeChange: PropTypes.func.isRequired,
  onExportingEventsChange: PropTypes.func.isRequired,
  viewType: PropTypes.oneOf([viewTypes.WEEK, viewTypes.CUSTOM, viewTypes.DAY, viewTypes.MONTH])
    .isRequired,
  viewDates: PropTypes.object,
  loading: PropTypes.bool,
  filters: PropTypes.object
}

EventContainer.defaultProps = {
  events: [],
  viewDates: { from: null, to: null },
  loading: true,
  filters: {}
}
