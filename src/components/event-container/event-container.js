import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate as _, quantityTranslate as qT } from '../../services/translations'
import { getEventDateName } from '../date-time-picker/utils'
import { Event } from '../event'
import {
  filterEventsByKeyword,
  getNextOpenedEventsState,
  getSwitchState,
  isEventOpened
} from './utils'
import { Switch, FormControlLabel } from '@mui/material'

import './event-container.scss'
import { TInput } from '../input'

export const EventContainer = ({ events, day, from, to, loading }) => {
  console.log(from, to)
  const [openedEvents, setOpenedEvents] = useState([])
  const [allEventsChecked, setAllEventsChecked] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    setOpenedEvents([])
    setAllEventsChecked(false)
    setSearchValue('')
  }, [events])
  const handleOnEventClick = (eventId, newState) => {
    const newOpenedItems = newState
      ? [...openedEvents, eventId]
      : openedEvents.filter((itemId) => itemId !== eventId)

    setOpenedEvents(newOpenedItems)
    setAllEventsChecked(getSwitchState(events, newOpenedItems))
  }

  const handleOnOpenAllClick = () => {
    const nextOpenedItems = getNextOpenedEventsState(events, openedEvents)
    setOpenedEvents(nextOpenedItems)
    setAllEventsChecked(getSwitchState(events, nextOpenedItems))
  }

  const handleOnSearchChange = (newValue) => {
    setSearchValue(newValue)
  }
  const renderHeadline = () => {
    const eventsCount = events?.length ?? 0
    return (
      <div className="event-container-headline">
        {`${_(['events', 'eventsFromDay'])} `}
        <span className="headline-date">{getEventDateName(day)}</span>

        <span className="headline-events-number">
          {` (${eventsCount} ${qT(['events', 'xEvents'], null, eventsCount)})`}
        </span>
      </div>
    )
  }
  const renderLoading = () => {
    return <div className="loader">LOADING</div>
  }

  const renderControls = () => {
    console.log(filterEventsByKeyword(events, searchValue))
    return (
      <div className="events-controls">
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
        <TInput
          className="events-search-bar"
          value={searchValue}
          onChange={handleOnSearchChange}
          label={_(['events', 'searchEvents'])}
        />
      </div>
    )
  }
  const renderEvents = () => {
    return (
      <div className="events">
        {events.map((item) => {
          return (
            <Event
              data={item}
              onClick={handleOnEventClick}
              key={`event-row-${item.id}`}
              isOpened={isEventOpened(openedEvents, item.id)}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="event-container">
      {renderHeadline()}
      {renderControls()}
      {loading ? renderLoading() : renderEvents()}
    </div>
  )
}

EventContainer.propTypes = {
  events: PropTypes.array,
  day: PropTypes.instanceOf(Date).isRequired,
  from: PropTypes.instanceOf(Date),
  to: PropTypes.instanceOf(Date),
  loading: PropTypes.bool
}

EventContainer.defaultProps = {
  events: [],
  from: null,
  to: null,
  loading: true
}
