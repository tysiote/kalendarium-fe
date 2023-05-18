import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TodayIcon from '@mui/icons-material/Today'

import {
  compareDates,
  getCurrentMonthName,
  getFirstDayOfMonth,
  getMonthData,
  getWeekdayNames,
  isSameMonth,
  setToToday
} from './utils'
import './date-time-picker.scss'
import { translate as _ } from '../../services/translations'

export const DatePicker = ({
  value: initialValue,
  className,
  onChange,
  onModeChange,
  dateFrom
}) => {
  const [value, setValue] = useState(initialValue)
  const initialViewingValue = getFirstDayOfMonth(value || new Date())
  const [viewingValue, setViewingValue] = useState(initialViewingValue)
  const [monthData, setMonthData] = useState(getMonthData(initialViewingValue))
  const [rowHeight, setRowHeight] = useState(0)
  const [fontSize, setFontSize] = useState(0)
  const [fontSize2, setFontSize2] = useState(0)
  const [fontSize3, setFontSize3] = useState(0)
  const [wrapperWidth, setWrapperWidth] = useState(0)

  const wrapperRef = useRef(null)

  const handleResize = () => {
    const newWidth = wrapperRef?.current?.offsetWidth
    if (newWidth !== wrapperWidth) {
      setWrapperWidth(newWidth)
      setRowHeight(newWidth / 7)
      setFontSize(newWidth / 21)
      setFontSize2(newWidth / 19)
      setFontSize3(newWidth / 17)
    }
  }

  useEffect(() => {
    handleResize()
    setValue(initialValue)
    setViewingValue(getFirstDayOfMonth(initialValue))
    setMonthData(getMonthData(getFirstDayOfMonth(initialValue)))
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [initialValue])

  const handleOnModeChange = () => {
    onModeChange()
  }

  const handleOnTodayButtonClick = () => {
    handleOnDateChange(setToToday(value))
  }
  const handleOnDateChange = (newValue) => {
    setValue(newValue)
    if (!isSameMonth(value, newValue)) {
      const newDate = new Date(getFirstDayOfMonth(newValue))
      newDate.setMonth(newDate.getMonth())
      setViewingValue(newDate)
      setMonthData(getMonthData(newDate))
    }
    onChange(newValue)
  }
  const handleOnMonthChange = (increment) => {
    const newDate = new Date(getFirstDayOfMonth(viewingValue))
    newDate.setMonth(newDate.getMonth() + increment)
    setViewingValue(newDate)
    setMonthData(getMonthData(newDate))
  }

  const handleOnYearChange = (increment) => {
    const newDate = new Date(viewingValue)
    newDate.setFullYear(newDate.getFullYear() + increment)
    setViewingValue(getFirstDayOfMonth(newDate))
    setMonthData(getMonthData(newDate))
  }

  return (
    <div className={classNames('date-picker', className)} ref={wrapperRef}>
      <div className="calendar-months-row">
        <button
          className="month-control-button"
          style={{ height: `${rowHeight}px` }}
          onClick={() => {
            handleOnYearChange(-1)
          }}>
          <KeyboardDoubleArrowLeftIcon style={{ fontSize: `${fontSize2}px` }} />
        </button>
        <button
          className="month-control-button"
          style={{ height: `${rowHeight}px` }}
          onClick={() => {
            handleOnMonthChange(-1)
          }}>
          <KeyboardArrowLeftIcon style={{ fontSize: `${fontSize2}px` }} />
        </button>
        <div
          className="month-label"
          style={{ height: `${rowHeight}px`, fontSize: `${fontSize3}px` }}>
          {getCurrentMonthName(viewingValue)}
        </div>
        <button
          className="month-control-button"
          style={{ height: `${rowHeight}px` }}
          onClick={() => {
            handleOnMonthChange(1)
          }}>
          <KeyboardArrowRightIcon style={{ fontSize: `${fontSize2}px` }} />
        </button>
        <button
          className="month-control-button"
          style={{ height: `${rowHeight}px` }}
          onClick={() => {
            handleOnYearChange(1)
          }}>
          <KeyboardDoubleArrowRightIcon style={{ fontSize: `${fontSize2}px` }} />
        </button>
      </div>

      <div className="calendar-days-container">
        <div className="calendar-weekday-names" style={{ height: `${rowHeight}px` }}>
          {getWeekdayNames().map((day) => (
            <div key={`weekday-name-${day}`} style={{ fontSize: `${fontSize2}px` }}>
              {day}
            </div>
          ))}
        </div>
        <div>
          {monthData.map((week, idxW) => {
            return (
              <div
                className="calendar-week-row"
                key={`week${idxW}`}
                style={{ height: `${rowHeight}px` }}>
                {week.map((day, idx) => {
                  const dayDisabled = day.date < dateFrom
                  return (
                    <div
                      className={classNames('calendar-cell', {
                        'different-month': !day.sameMonth,
                        today: day.isToday,
                        selected: compareDates(day.date, value),
                        'not-available': dayDisabled
                      })}
                      key={`weekday-${idxW}-${idx}`}
                      onClick={dayDisabled ? () => {} : () => handleOnDateChange(day.date)}>
                      <span style={{ fontSize: `${fontSize}px` }}>{day.label}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
          <button
            onClick={handleOnTodayButtonClick}
            className="picker-today"
            style={{ height: `${rowHeight}px` }}>
            <TodayIcon />
            <span style={{ fontSize: `${fontSize}px` }}>{_(['dateTimePicker', 'today'])}</span>
          </button>
          {onModeChange && (
            <button
              onClick={handleOnModeChange}
              className="picker-switcher"
              style={{ height: `${rowHeight}px` }}>
              <AccessTimeIcon />
              <span style={{ fontSize: `${fontSize}px` }}>
                {_(['dateTimePicker', 'chooseTime'])}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

DatePicker.propTypes = {
  value: PropTypes.instanceOf(Date),
  className: PropTypes.string,
  onChange: PropTypes.func,
  onModeChange: PropTypes.func,
  dateFrom: PropTypes.instanceOf(Date)
}

DatePicker.defaultProps = {
  className: null,
  onChange: () => {},
  onModeChange: null,
  dateFrom: null
}
