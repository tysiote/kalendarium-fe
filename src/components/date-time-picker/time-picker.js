import React, { useLayoutEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { NumberInput } from '../number-input'
import {
  checkHourInput,
  checkMinuteInput,
  getCurrentDateName,
  incrementHours,
  incrementMinutes
} from './utils'
import { translate as _ } from '../../services/translations'

import Tooltip from '@mui/material/Tooltip'

import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import NotInterestedIcon from '@mui/icons-material/NotInterested'

export const TimePicker = ({ className, id, onModeChange, onChange, value, onNoTime }) => {
  const ref = useRef(null)
  const [rowHeight, setRowHeight] = useState(0)
  const [hours, setHours] = useState(value ? value.getHours() : 0)
  const [minutes, setMinutes] = useState(value ? value.getMinutes() : 0)
  const [fontSize, setFontSize] = useState(0)
  const [fontSize2, setFontSize2] = useState(0)

  useLayoutEffect(() => {
    const newWidth = ref.current.offsetWidth
    setRowHeight(newWidth / 7)
    setFontSize(newWidth / 21)
    setFontSize2(newWidth / 19)
  })
  const handleOnModeChange = () => {
    onModeChange()
  }

  const handleOnChange = (newValue) => {
    const val = new Date(newValue)

    onChange(val, true)
  }

  const handleNoTime = () => {
    onNoTime()
  }

  const handleOnIncrementChange = (increment, isHour) => {
    const newTimeValue = new Date(value)
    if (isHour) {
      const newHoursValue = incrementHours(newTimeValue, increment)
      newTimeValue.setHours(newHoursValue)
      setHours(newHoursValue)
      handleOnChange(newTimeValue)
    } else {
      const newMinutesValue = incrementMinutes(newTimeValue, increment)
      newTimeValue.setMinutes(newMinutesValue)
      setMinutes(newMinutesValue)
      handleOnChange(newTimeValue)
    }
  }

  const handleOnInputChange = (newValue, isHour) => {
    const newTimeValue = new Date(value)
    if (isHour) {
      if (checkHourInput(newValue)) {
        setHours(newValue)
        newTimeValue.setHours(newValue)
        handleOnChange(newTimeValue)
      }
    } else {
      if (checkMinuteInput(newValue)) {
        setMinutes(newValue)
        newTimeValue.setMinutes(newValue)
        handleOnChange(newTimeValue)
      }
    }
  }

  return (
    <div className={classNames('time-picker', className)} id={id}>
      <div
        className="date-label"
        ref={ref}
        style={{ height: `${rowHeight}px`, fontSize: `${fontSize2}px` }}>
        {getCurrentDateName(value)}
      </div>
      <div className="time-selection-container">
        <div className="time-selection-window hour-selection">
          <div className="time-increment-wrapper">
            <Tooltip title="+6" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(6, true)}>
                <KeyboardDoubleArrowUpIcon />
              </button>
            </Tooltip>
          </div>
          <div className="time-increment-wrapper">
            <Tooltip title="+1" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(1, true)}>
                <KeyboardArrowUpIcon />
              </button>
            </Tooltip>
          </div>
          <div className="time-increment-wrapper">
            <NumberInput
              onChange={(newValue) => {
                handleOnInputChange(newValue, true)
              }}
              value={hours}
              style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
              className="time-increment-input"
            />
          </div>
          <div className="time-increment-wrapper">
            <Tooltip title="-1" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(-1, true)}>
                <KeyboardArrowDownIcon />
              </button>
            </Tooltip>
          </div>
          <div className="time-increment-wrapper">
            <Tooltip title="-6" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(-6, true)}>
                <KeyboardDoubleArrowDownIcon />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="time-selection-window minute-selection">
          <div className="time-increment-wrapper">
            <Tooltip title="+15" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(15, false)}>
                <KeyboardDoubleArrowUpIcon />
              </button>
            </Tooltip>
          </div>
          <div className="time-increment-wrapper">
            <Tooltip title="+5" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(5, false)}>
                <KeyboardArrowUpIcon />
              </button>
            </Tooltip>
          </div>
          <div className="time-increment-wrapper">
            <NumberInput
              onChange={(newValue) => {
                handleOnInputChange(newValue, false)
              }}
              value={minutes}
              style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
              className="time-increment-input"
            />
          </div>
          <div className="time-increment-wrapper">
            <Tooltip title="-5" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(-5, false)}>
                <KeyboardArrowDownIcon />
              </button>
            </Tooltip>
          </div>
          <div className="time-increment-wrapper">
            <Tooltip title="-15" placement="right">
              <button
                className="time-increment"
                style={{ height: `${rowHeight}px`, width: `${rowHeight}px` }}
                onClick={() => handleOnIncrementChange(-15, false)}>
                <KeyboardDoubleArrowDownIcon />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      <button
        className={'no-time'}
        onClick={handleNoTime}
        style={{ height: `${rowHeight}px`, fontSize: `${fontSize}px` }}>
        <NotInterestedIcon />
        <span>{_(['dateTimePicker', 'noTime'])}</span>
      </button>
      <button
        onClick={handleOnModeChange}
        className="picker-switcher"
        style={{ height: `${rowHeight}px` }}>
        <CalendarMonthIcon />
        <span style={{ fontSize: `${fontSize}px` }}>{_(['dateTimePicker', 'chooseDate'])}</span>
      </button>
    </div>
  )
}

TimePicker.propTypes = {
  onModeChange: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(Date),
  id: PropTypes.string,
  className: PropTypes.string,
  onNoTime: PropTypes.func
}

TimePicker.defaultProps = {
  onModeChange: () => {},
  onChange: () => {},
  value: null,
  id: null,
  className: null,
  onNoTime: () => {}
}
