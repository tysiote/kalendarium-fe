import React, { useState, useEffect } from 'react'
// import { DateTimePicker } from './components/date-time-picker'
// import { DoubleInput } from './components/double-input'
// import { PickerWithInput } from './components/picker-with-input'
import { MainDrawer } from './components/main-drawer/main-drawer'
import classNames from 'classnames'

import './main.scss'
import { MainDrawerSlim } from './components/main-drawer/main-drawer-slim'
import { DatePicker } from './components/date-time-picker'
import CloseIcon from '@mui/icons-material/Close'
import { translate as _ } from './services/translations'
import { TButton } from './components/button'
import { EventContainer } from './components/event-container/event-container'
import { fetchEventsFromDay } from './services/fetching/fetching'
import { sortEventsByTime } from './components/event-container/utils'
export const Main = () => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fetching, setFetching] = useState(true)
  const [events, setEvents] = useState(null)
  const handleOnDrawerClose = () => {
    setDrawerOpened(false)
  }

  const handleOnDrawerOpen = () => {
    setDrawerOpened(true)
  }

  const handleOnSelectedDateChange = (newValue) => {
    setSelectedDate(newValue)
    setFetching(true)
    fetchEventsFromDay(newValue).then((result) => {
      setFetching(false)
      setEvents(sortEventsByTime(result.data))
      console.log(result)
    })
  }

  useEffect(() => {
    handleOnSelectedDateChange(selectedDate)
  }, [])

  return (
    <div className="main">
      <MainDrawer onClose={handleOnDrawerClose} isOpened={drawerOpened}>
        <div>
          <TButton
            onClick={handleOnDrawerClose}
            className="close-panel-button"
            id="close-panel-button">
            <CloseIcon />
            <div className="close-panel-text">
              {_(['mainDrawer', 'closePanel'])
                .split()
                .map((letter, idx) => (
                  <span key={`close-panel-text-${idx}`}>{letter}</span>
                ))}
            </div>
          </TButton>
          {/*<PickerWithInput />*/}
          <DatePicker onChange={handleOnSelectedDateChange} value={selectedDate} />
        </div>
      </MainDrawer>
      {!drawerOpened && <MainDrawerSlim onClick={handleOnDrawerOpen} />}
      <div className={classNames('main-content', { 'drawer-opened': drawerOpened })}>
        <EventContainer day={selectedDate} loading={fetching} events={events} />
      </div>
    </div>
  )
}
