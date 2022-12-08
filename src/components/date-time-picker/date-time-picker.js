import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { calendarModes } from './constants'
import { DatePicker } from './date-picker'
import { TimePicker } from './time-picker'

export const DateTimePicker = ({
  value,
  className,
  id,
  mode,
  onModeChange,
  onChange,
  onClickOutside
}) => {
  const [noTime, setNoTime] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleOnClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside()
      }
    }

    document.addEventListener('mousedown', handleOnClick)
    return () => {
      document.addEventListener('mousedown', handleOnClick)
    }
  }, [ref])
  const handleOnValueChange = (newValue, fromTimePicker, withNoTime) => {
    onChange(newValue, !fromTimePicker && (noTime || withNoTime))
    if (fromTimePicker) {
      setNoTime(false)
    }
  }
  const handleOnModeChange = (newMode) => {
    onModeChange(newMode)
  }

  const handleOnNoTime = () => {
    setNoTime(true)
    const newValue = new Date(value)
    newValue.setHours(0)
    newValue.setMinutes(0)
    newValue.setSeconds(1)
    handleOnValueChange(newValue, undefined, true)
    handleOnModeChange(calendarModes.date)
  }
  const renderDatePicker = () => {
    return (
      <DatePicker
        value={value}
        onChange={handleOnValueChange}
        onModeChange={() => handleOnModeChange(calendarModes.time)}
      />
    )
  }
  const renderTimePicker = () => {
    return (
      <TimePicker
        value={value}
        onChange={handleOnValueChange}
        onModeChange={() => handleOnModeChange(calendarModes.date)}
        onNoTime={handleOnNoTime}
      />
    )
  }
  return (
    <div className={classNames('date-time-picker', className)} id={id} ref={ref}>
      {mode === calendarModes.date && renderDatePicker()}
      {mode === calendarModes.time && renderTimePicker()}
    </div>
  )
}

DateTimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onModeChange: PropTypes.func,
  value: PropTypes.instanceOf(Date),
  id: PropTypes.string,
  closeOnSelect: PropTypes.bool,
  className: PropTypes.string,
  mode: PropTypes.oneOf([calendarModes.date, calendarModes.time]),
  onClickOutside: PropTypes.func
}

DateTimePicker.defaultProps = {
  value: new Date(),
  id: null,
  closeOnSelect: false,
  className: null,
  mode: calendarModes.date,
  onModeChange: () => {},
  onClickOutside: () => {}
}
