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
  getEventById,
  getExportingEvents,
  getNextOpenedEventsState,
  getSwitchState,
  isEventOpened,
  removeActiveFilter
} from './utils'
import { Switch, FormControlLabel, Modal, Box } from '@mui/material'

import './event-container.scss'
import { TInput } from '../input'
import { getFilterTranslationByKeyword } from '../../pages/filter-page/utils'
import { TButton } from '../button'
import { viewTypes } from '../../pages/views-page/constants'
import { ThreeDots } from 'react-loader-spinner'
import { useStore, useDispatch, useSelector } from 'react-redux'
import {
  updateEditingMode,
  updateEventModalId,
  updateExportedEvents,
  updateExportingMode,
  updateOpenedEvents,
  updateShowEditors
} from '../../services/redux-reducers/application/application-reducer'

export const EventContainer = ({
  day,
  viewDates,
  viewType,
  loading,
  filters,
  onFilterRemove,
  onAddEvent,
  onEditEvent,
  fetchTimestamp,
  onEventRemoved,
  onEventRestored
}) => {
  const store = useStore()
  const dispatch = useDispatch()

  const userLevel = store.getState().userSettings.level
  const events = useSelector((state) => state.application.events)
  const editingMode = useSelector((state) => state.application.editingMode)
  const exportingMode = useSelector((state) => state.application.exportingMode)
  const showEditors = useSelector((state) => state.application.showEditors)
  const exportedEvents = useSelector((state) => state.application.exportedEvents)
  const openedEvents = useSelector((state) => state.application.openedEvents)
  const eventModalId = useSelector((state) => state.application.eventModalId)

  const [allEventsChecked, setAllEventsChecked] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(
    loading ? [] : filterEvents(filters, events, searchValue)
  )

  const exportAllEventsLabel = _(['events', 'exportAllEvents'])
  const showEditorsLabel = _(['events', 'showEditors'])
  const editModeLabel = _(['events', 'editMode'])
  const addEventLabel = _(['events', 'addEventLabel'])
  const modalLabel = _(['events', 'modalLabel'])
  const modalDeleteLabel = _(['events', 'modalDeleteLabel'])
  const modalCancelLabel = _(['events', 'modalCancelLabel'])

  useEffect(() => {
    setSearchValue('')
    setFilteredEvents(loading ? [] : filterEvents(filters, events, searchValue))
  }, [
    events,
    filters,
    fetchTimestamp,
    editingMode,
    exportingMode,
    showEditors,
    exportedEvents,
    openedEvents
  ])

  const handleEditModeClick = () => {
    dispatch(updateEditingMode(!editingMode))
  }

  const handleOnAddClick = () => {
    onAddEvent()
  }

  const handleOnEditClick = (id) => {
    onEditEvent(id)
  }

  const handleOnEventClick = (eventId, newState) => {
    const newOpenedItems = newState
      ? [...openedEvents, eventId]
      : openedEvents.filter((itemId) => itemId !== eventId)

    dispatch(updateOpenedEvents(newOpenedItems))
    setAllEventsChecked(getSwitchState(events, newOpenedItems))
  }

  const handleOnEventExportClick = (eventId, checked) => {
    const newValue = getExportingEvents(exportedEvents, eventId, checked)
    dispatch(updateExportedEvents(newValue))
  }

  const handleOnAllEventExportClick = () => {
    const newValue = areAllEventsExporting(filteredEvents, exportedEvents)
      ? []
      : filteredEvents.map((evt) => evt.id)
    dispatch(updateExportedEvents(newValue))
  }

  const handleOnExportSwitchClick = () => {
    const newValue = !exportingMode
    dispatch(updateExportingMode(newValue))
  }

  const handleShowEditorsClick = () => {
    dispatch(updateShowEditors(!showEditors))
  }

  const handleOnOpenAllClick = () => {
    const nextOpenedItems = getNextOpenedEventsState(events, openedEvents)
    dispatch(updateOpenedEvents(nextOpenedItems))
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

  const handleOnModalClose = () => {
    dispatch(updateEventModalId(null))
  }

  const handleOnModalDelete = () => {
    const URL = 'https://kalendarium.tasr.sk/public/index.php/api/events/delete'

    fetch(URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ id: eventModalId, delete_method: 'hard' }),
      mode: 'cors',
      headers: { 'content-type': 'application/json; charset=UTF-8' }
    })
      .then((result) => result.json())
      .then(() => {
        onEventRemoved(eventModalId, 2)
        dispatch(updateEventModalId(null))
      })
  }

  const renderHeadline = () => {
    const eventsCount = filteredEvents?.length ?? 0

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
        <ThreeDots height={150} width={150} color="#202c8a" />
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
          {userLevel >= 2 && (
            <FormControlLabel
              control={
                <Switch
                  onChange={() => handleShowEditorsClick()}
                  checked={showEditors}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={`${showEditorsLabel}`}
            />
          )}
          {userLevel >= 3 && (
            <FormControlLabel
              control={
                <Switch
                  onChange={() => handleEditModeClick()}
                  checked={editingMode}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={`${editModeLabel}`}
            />
          )}
          {exportingMode && (
            <div className="event-controls-secondary">
              <FormControlLabel
                control={
                  <Switch
                    onChange={() => handleOnAllEventExportClick()}
                    checked={areAllEventsExporting(filteredEvents, exportedEvents)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={`${exportAllEventsLabel}`}
              />
            </div>
          )}
          {editingMode && (
            <div className="event-controls-secondary">
              <div className="add-button-wrapper">
                <TButton onClick={handleOnAddClick} id="event-container-add-event-button">
                  {addEventLabel}
                </TButton>
              </div>
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
              isExported={exportedEvents.includes(item.id)}
              editMode={editingMode}
              onEditClick={handleOnEditClick}
              onRemove={onEventRemoved}
              onRestore={onEventRestored}
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

  const renderEventModal = () => {
    return (
      <Modal
        open={eventModalId !== null}
        onClose={handleOnModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box>
          <h2 id="modal-title">{`${modalLabel}?`}</h2>
          <p>{getEventById(events, eventModalId)?.title}</p>
          <div className="modal-buttons">
            <TButton
              onClick={handleOnModalClose}
              id="modal-cancel-button"
              className="modal-cancel-button">
              {modalCancelLabel}
            </TButton>
            <TButton
              onClick={handleOnModalDelete}
              id="modal-delete-button"
              className="modal-delete-button">
              {modalDeleteLabel}
            </TButton>
          </div>
        </Box>
      </Modal>
    )
  }

  return (
    <div className="event-container">
      {renderHeadline()}
      {renderControls()}
      {/*{renderLoading()}*/}
      {renderEventModal()}
      {loading ? renderLoading() : renderEvents()}
    </div>
  )
}

EventContainer.propTypes = {
  events: PropTypes.array,
  day: PropTypes.instanceOf(Date).isRequired,
  onFilterRemove: PropTypes.func.isRequired,
  viewType: PropTypes.oneOf([viewTypes.WEEK, viewTypes.CUSTOM, viewTypes.DAY, viewTypes.MONTH])
    .isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onEditEvent: PropTypes.func.isRequired,
  fetchTimestamp: PropTypes.number.isRequired,
  onEventRemoved: PropTypes.func.isRequired,
  onEventRestored: PropTypes.func.isRequired,
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
