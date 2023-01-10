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
import { getEventsToExportById, sortEventsByTime } from './components/event-container/utils'
import { ExportPage, FilterPage, SettingsPage, ViewsPage } from './pages'
import { viewTypes } from './pages/views-page/constants'

export const Main = () => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [fetching, setFetching] = useState(true)
  const [events, setEvents] = useState(null)
  const [filters, setFilters] = useState([])
  const [tagsFilters, setTagsFilters] = useState({})
  const [view, setView] = useState(viewTypes.DAY)
  const [viewDates, setViewDates] = useState(null)
  const [currentPage, setCurrentPage] = useState('events')
  const [exportingMode, setExportingMode] = useState(false)
  const [exportingEvents, setExportingEvents] = useState([])
  const handleOnDrawerClose = () => {
    setDrawerOpened(false)
  }

  const handleOnDrawerOpen = () => {
    setDrawerOpened(true)
  }

  const handleOnExportingModeChange = (newValue) => {
    setExportingMode(newValue)
  }

  const handleOnExportingEventsChange = (newValue) => {
    setExportingEvents(newValue)
  }

  const handleOnSelectedDateChange = (newValue) => {
    setSelectedDate(newValue)
    setView(viewTypes.DAY)
    setFetching(true)
    fetchEventsFromDay(newValue).then((result) => {
      setFetching(false)
      setEvents(sortEventsByTime(result.data))
    })
  }

  const handleOnPageChange = (newPage) => {
    setCurrentPage(newPage)
    handleOnDrawerClose()
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
      setEvents(sortEventsByTime(result.data))
    })
    setCurrentPage('events')
  }

  const handleOnSyncClick = () => {
    handleOnSelectedDateChange(selectedDate)
  }

  const handleOnServicesClick = () => {
    window.open('https://etasr.sk/login', '_blank')
  }

  const handleOnHungarianClick = () => {
    window.open('https://kalendarium.tasr.sk/madarske/', '_blank')
  }

  // const handleOnAdminClick = () => {
  //   window.open('https://kalendarium.tasr.sk/admin-zona/', '_blank')
  // }

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
            disabled={!exportingMode || !exportingEvents?.length}
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
          <TButton
            onClick={handleOnHungarianClick}
            id={'menu-button-hungarian-events'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'hungarianEvents'])}
          </TButton>
          {/*<TButton*/}
          {/*  onClick={handleOnAdminClick}*/}
          {/*  id={'menu-button-admin-zone'}*/}
          {/*  className="drawer-menu-button">*/}
          {/*  {_(['mainDrawer', 'adminZone'])}*/}
          {/*</TButton>*/}
          <TButton
            onClick={() => handleOnPageChange('settings')}
            id={'menu-button-settings'}
            className="drawer-menu-button">
            {_(['mainDrawer', 'settings'])}
          </TButton>
        </div>
      </MainDrawer>
      {!drawerOpened && <MainDrawerSlim onClick={handleOnDrawerOpen} />}
      <div className={classNames('main-content', { 'drawer-opened': drawerOpened })}>
        {currentPage === 'events' && (
          <EventContainer
            day={selectedDate}
            loading={fetching}
            events={events}
            filters={tagsFilters}
            onFilterRemove={handleOnFilterRemove}
            viewType={view}
            viewDates={viewDates}
            onExportingModeChange={handleOnExportingModeChange}
            onExportingEventsChange={handleOnExportingEventsChange}
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
            events={getEventsToExportById(events, exportingEvents)}
            withDate={view !== viewTypes.DAY}
          />
        )}
        {currentPage === 'settings' && <SettingsPage onBack={() => handleOnPageChange('events')} />}
      </div>
    </div>
  )
}
