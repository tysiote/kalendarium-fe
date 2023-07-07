import React, { useState, useEffect } from 'react'
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
import {
  getEventById,
  getEventsToExportById,
  sortEventsByTime
} from './components/event-container/utils'
import { ExportPage, FilterPage, SettingsPage, ViewsPage } from './pages'
import { viewTypes } from './pages/views-page/constants'
import PropTypes from 'prop-types'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { EventEditorPage } from './pages/event-editor-page'
import { updateEvents } from './services/redux-reducers/application/application-reducer'

export const Main = ({ onLogout }) => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fetching, setFetching] = useState(true)
  const [filters, setFilters] = useState([])
  const [tagsFilters, setTagsFilters] = useState({})
  const [view, setView] = useState(viewTypes.DAY)
  const [viewDates, setViewDates] = useState(null)
  const [currentPage, setCurrentPage] = useState('events')
  const [pingCounter, setPingCounter] = useState(0)

  const [editedEvent, setEditedEvent] = useState(null)
  const [fetchTimestamp, setFetchTimestamp] = useState(new Date().getTime())

  const store = useStore()
  const dispatch = useDispatch()
  const level = store.getState().userSettings.level
  const exportedEvents = useSelector((state) => state.application.exportedEvents)
  const events = useSelector((state) => state.application.events)

  const adminZoneLabel = _(['mainDrawer', 'adminZone'])

  const handleOnLogout = () => {
    onLogout()
  }

  const handleOnDrawerClose = (automatic) => {
    setDrawerOpened(automatic && window.innerWidth > 800)
  }

  const handleOnDrawerOpen = () => {
    setDrawerOpened(true)
  }

  const handleOnSelectedDateChange = (newValue) => {
    setSelectedDate(newValue)
    setView(viewTypes.DAY)
    setFetching(true)
    setDrawerOpened(window.innerWidth > 800)
    fetchEventsFromDay(newValue).then((result) => {
      setFetching(false)
      // setEvents(sortEventsByTime(result.data))
      dispatch(updateEvents(sortEventsByTime(result.data)))
      setTimeout(() => {
        setFetchTimestamp(new Date().getTime())
      }, 500)
    })
  }

  const handleOnManualClick = () => {
    const link = document.createElement('a')
    link.download = 'manual.pdf'
    link.href = 'https://kalendarium.tasr.sk/manual.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOnPageChange = (newPage) => {
    setCurrentPage(newPage)
    handleOnDrawerClose(true)
  }

  const handleOnFiltersApply = (newFilters, newTagsFilters) => {
    setFilters(newFilters)
    setTagsFilters(newTagsFilters)
    setCurrentPage('events')
  }

  const handleOnFilterRemove = (newFilters, newTagsFilters) => {
    setFilters(newFilters)
    setTagsFilters(newTagsFilters)
  }

  const handleOnViewApply = (newView, newViewDates) => {
    setView(newView)
    setViewDates(newViewDates)
    setFetching(true)
    fetchEventsFromDay(selectedDate, newViewDates.from, newViewDates.to).then((result) => {
      setFetching(false)
      dispatch(updateEvents(sortEventsByTime(result.data)))
      setFetchTimestamp(new Date().getTime())
    })
    setCurrentPage('events')
  }

  const handleOnSyncClick = () => {
    handleOnSelectedDateChange(selectedDate)
  }

  const handleOnServicesClick = () => {
    window.open('https://etasr.sk/login', '_blank')
  }

  const handleOnAdminClick = () => {
    window.open('https://kalendarium.tasr.sk/admin-zona/', '_blank')
  }

  const handleOnAddEventClick = () => {
    setEditedEvent(null)
    setCurrentPage('event-editor')
  }

  const handleOnEditEventClick = (id) => {
    setEditedEvent(getEventById(events, id))
    setCurrentPage('event-editor')
  }

  const handleOnEventAdded = () => {
    setCurrentPage('events')
    handleOnSyncClick()
  }

  const handleOnEventUpdated = () => {
    setCurrentPage('events')
    handleOnSyncClick()
  }

  const handleOnEventRemoved = () => {
    setCurrentPage('events')
    handleOnSyncClick()
  }

  const handleOnEventRestored = () => {
    setCurrentPage('events')
    handleOnSyncClick()
  }

  const handleOnEventEditorDismissed = () => {
    setCurrentPage('events')
    handleOnSyncClick()
  }

  useEffect(() => {
    handleOnSelectedDateChange(selectedDate)
    const pingConnection = setInterval(() => {
      const URL = 'https://kalendarium.tasr.sk/public/index.php/ping'
      fetch(URL, {
        mode: 'cors',
        method: 'POST',
        credentials: 'include',
        body: '',
        headers: { 'content-type': 'application/json' }
      })
        .then((result) => result.json())
        .then((data) => {
          setFetching(false)
          if (data.status.code === 1) {
            onLogout()
            console.log('logging out after', `${pingCounter * 240} seconds ...`)
          } else {
            setPingCounter(pingCounter + 1)
          }
        })
    }, 240000)
    if (window.innerWidth > 800) {
      setDrawerOpened(true)
    }

    return () => {
      clearInterval(pingConnection)
    }
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
          <DatePicker onChange={handleOnSelectedDateChange} value={selectedDate} />
          <TButton
            onClick={() => handleOnPageChange('filters')}
            id={'menu-button-filters'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'filter'])}
          </TButton>
          <TButton
            onClick={() => handleOnPageChange('views')}
            id={'menu-button-views'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'views'])}
          </TButton>
          <TButton
            onClick={() => handleOnPageChange('export')}
            id={'menu-button-export'}
            disabled={!exportedEvents?.length}
            className="drawer-menu-button">
            {_(['mainDrawer', 'exportEvents'])}
          </TButton>
          <TButton
            onClick={handleOnSyncClick}
            id={'menu-button-sync'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'sync'])}
          </TButton>
          <TButton
            onClick={handleOnServicesClick}
            id={'menu-button-back-to-services'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'backToTasr'])}
          </TButton>
          {level === 4 && (
            <TButton
              onClick={handleOnAdminClick}
              id={'menu-button-admin-zone'}
              className="drawer-menu-button">
              {adminZoneLabel}
            </TButton>
          )}

          <TButton
            onClick={() => handleOnPageChange('settings')}
            id={'menu-button-settings'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'settings'])}
          </TButton>

          <TButton
            onClick={() => handleOnManualClick()}
            id={'menu-button-manual'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'manual'])}
          </TButton>
        </div>
      </MainDrawer>
      {!drawerOpened && <MainDrawerSlim onClick={handleOnDrawerOpen} />}
      <div className={classNames('main-content', { 'drawer-opened': drawerOpened })}>
        {currentPage === 'events' && (
          <EventContainer
            day={selectedDate}
            loading={fetching}
            filters={tagsFilters}
            onFilterRemove={handleOnFilterRemove}
            viewType={view}
            viewDates={viewDates}
            onAddEvent={handleOnAddEventClick}
            onEditEvent={handleOnEditEventClick}
            fetchTimestamp={fetchTimestamp}
            onEventRemoved={handleOnEventRemoved}
            onEventRestored={handleOnEventRestored}
          />
        )}
        {currentPage === 'filters' && (
          <FilterPage
            onFilterApply={handleOnFiltersApply}
            onFilterClose={() => handleOnPageChange('events')}
            initialFilters={filters}
          />
        )}
        {currentPage === 'views' && (
          <ViewsPage
            onViewApply={handleOnViewApply}
            onViewClose={() => handleOnPageChange('events')}
            initialView={view}
            initialFrom={viewDates?.from}
            initialTo={viewDates?.to}
          />
        )}
        {currentPage === 'export' && (
          <ExportPage
            onBack={() => handleOnPageChange('events')}
            events={getEventsToExportById(events, exportedEvents)}
            withDate={view !== viewTypes.DAY}
            filters={tagsFilters}
          />
        )}
        {currentPage === 'settings' && (
          <SettingsPage onBack={() => handleOnPageChange('events')} onLogout={handleOnLogout} />
        )}
        {currentPage === 'event-editor' && (
          <EventEditorPage
            onRemove={handleOnEventRemoved}
            onAdd={handleOnEventAdded}
            onCancel={handleOnEventEditorDismissed}
            event={editedEvent}
            onEdit={handleOnEventUpdated}
            onRestore={handleOnEventRestored}
          />
        )}
      </div>
    </div>
  )
}

Main.propTypes = {
  onLogout: PropTypes.func.isRequired
}
