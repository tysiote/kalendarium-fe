import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { viewTypes } from './constants'
import { translate as _ } from '../../services/translations'
import {
  Grid,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select
} from '@mui/material'
import { TButton } from '../../components/button'

import './views.scss'
import classNames from 'classnames'
import {
  formatDate,
  formatMonth,
  getDynamicViewLabels,
  getFromTo,
  getMonths,
  getWeeks
} from './utils'
import { DatePicker } from '../../components/date-time-picker'

const { CUSTOM, DAY, MONTH, WEEK } = viewTypes

export const ViewsPage = ({ initialView, initialFrom, initialTo, onViewApply, onViewClose }) => {
  const [viewType, setViewType] = useState(initialView)
  const [from, setFrom] = useState(initialFrom ?? new Date())
  const [to, setTo] = useState(initialTo ?? new Date())
  const [week, setWeek] = useState(0)
  const [month, setMonth] = useState(0)

  const weekViewLabel = _(['views', 'weekSelectLabel'])
  const monthViewLabel = _(['views', 'monthSelectLabel'])
  const customViewFromLabel = _(['views', 'fromLabel'])
  const customViewToLabel = _(['views', 'toLabel'])
  const customViewDateRangeLabel = _(['views', 'dateRange'])
  const dynamicViewLabels = getDynamicViewLabels(_)

  const handleOnWeekSelect = (event) => {
    setWeek(event.target.value)
  }

  const handleOnMonthSelect = (event) => {
    setMonth(event.target.value)
  }

  const handleOnDateFromChange = (newDate) => {
    setFrom(newDate)
  }

  const handleOnDateToChange = (newDate) => {
    setTo(newDate)
  }

  const handleOnViewSelected = (newView) => {
    setViewType(newView)
  }

  const handleOnViewApply = () => {
    const { from: dayFrom, to: dayTo } = getFromTo({
      viewType,
      from,
      to,
      weekIndex: week,
      monthIndex: month
    })
    onViewApply(viewType, { from: dayFrom, to: dayTo })
  }
  const handleOnViewClose = () => {
    onViewClose()
  }

  const renderWeekView = () => {
    const weeks = getWeeks()

    return (
      <div className="view week-view">
        <InputLabel id="week-select-label">{weekViewLabel}</InputLabel>
        <Select
          labelId="week-select-label"
          id="week-select"
          value={week}
          label="Age"
          onChange={handleOnWeekSelect}>
          {weeks.map((w, idx) => (
            <MenuItem key={`select-week-${idx}`} value={idx}>
              {`${_(['views', 'weekLabel'])} ${formatDate(w.from)} - ${formatDate(w.to)}`}
            </MenuItem>
          ))}
        </Select>
      </div>
    )
  }

  const renderMonthView = () => {
    const months = getMonths()

    return (
      <div className="view month-view">
        <InputLabel id="month-select-label">{monthViewLabel}</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          value={month}
          label="Age"
          onChange={handleOnMonthSelect}>
          {months.map((m, idx) => (
            <MenuItem key={`select-month-${idx}`} value={idx}>
              {`${formatMonth(m)}`}
            </MenuItem>
          ))}
        </Select>
      </div>
    )
  }

  const renderCustomView = () => {
    const dateFormat = { day: 'numeric', month: 'numeric', year: 'numeric' }
    return (
      <div className="view custom-view">
        <div className="datepicker-wrapper">
          <h4>{customViewFromLabel}</h4>
          <DatePicker onChange={handleOnDateFromChange} value={from} />
        </div>
        <div className="datepicker-wrapper">
          <h4>{customViewToLabel}</h4>
          <DatePicker onChange={handleOnDateToChange} value={to} dateFrom={from} />
        </div>
        <div className="custom-date-values">
          <h4>{`${customViewDateRangeLabel}: ${formatDate(from, dateFormat)} - ${formatDate(
            to,
            dateFormat
          )}`}</h4>
        </div>
      </div>
    )
  }

  const renderViewOptions = () => {
    return (
      <Grid item xs={12} sm={12} md={8} lg={10}>
        <div className="view-options">
          {viewType === WEEK && renderWeekView()}
          {viewType === MONTH && renderMonthView()}
          {viewType === CUSTOM && renderCustomView()}
        </div>
      </Grid>
    )
  }

  const renderViewSelector = () => {
    const viewsToRender = [DAY, WEEK, MONTH, CUSTOM]

    return (
      <Grid item xs={12} sm={12} md={4} lg={2}>
        <div className="views-selector">
          <List component="nav" aria-label="view selector">
            {viewsToRender.map((view) => (
              <ListItemButton
                className={classNames('view-selector-button', { selected: viewType === view })}
                key={`view-type-key-${view}`}
                selected={viewType === view}
                onClick={() => handleOnViewSelected(view)}>
                <ListItemText primary={dynamicViewLabels[view]} />
              </ListItemButton>
            ))}
          </List>
        </div>
      </Grid>
    )
  }

  return (
    <div className="views-page">
      <h2>{_(['views', 'viewsLabel'])}</h2>
      <div className="views-page-container">
        <Grid container spacing={2}>
          {renderViewSelector()}
          {renderViewOptions()}
        </Grid>
        <div className="view-page-buttons">
          <div className="view-button-wrapper">
            <TButton
              onClick={handleOnViewClose}
              id="dismiss-view-button"
              className="view-button dismiss-view-button">
              {_(['views', 'dismissViewsLabel'])}
            </TButton>
          </div>

          <div className="view-button-wrapper">
            <TButton
              onClick={handleOnViewApply}
              id="apply-view-button"
              className="view-button apply-view-button">
              {_(['views', 'applyViewsLabel'])}
            </TButton>
          </div>
        </div>
      </div>
    </div>
  )
}

ViewsPage.propTypes = {
  onViewApply: PropTypes.func.isRequired,
  onViewClose: PropTypes.func.isRequired,
  initialView: PropTypes.oneOf([CUSTOM, DAY, MONTH, WEEK]),
  initialFrom: PropTypes.instanceOf(Date),
  initialTo: PropTypes.instanceOf(Date)
}

ViewsPage.defaultProps = {
  initialView: DAY,
  initialFrom: null,
  initialTo: null
}
