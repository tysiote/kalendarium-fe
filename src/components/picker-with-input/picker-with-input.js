import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { DateTimePicker } from '../date-time-picker'
import { calendarModes } from '../date-time-picker/constants'
import { DoubleInput } from '../double-input'
import { formatTime, formatDate, checkInputDate, mergeDateAndTime } from '../date-time-picker/utils'
import { translate as _ } from '../../services/translations'
import { useStore } from 'react-redux'

export const PickerWithInput = ({
  value: initialValue,
  onChange,
  disabled,
  className,
  autocomplete,
  noTime: initialNoTime
}) => {
  const store = useStore()
  const locale = store.getState().locale.locale
  const [pickerOpened, setPickerOpened] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [mode, setMode] = useState(calendarModes.date)
  const [inputValue1, setInputValue1] = useState(formatDate(initialValue, locale))
  const [inputValue2, setInputValue2] = useState(
    initialNoTime ? '' : formatTime(initialValue, locale)
  )
  const [lastValidValue1, setLastValidValue1] = useState(formatDate(initialValue, locale))
  const [lastValidValue2, setLastValidValue2] = useState(
    initialNoTime ? '' : formatTime(initialValue, locale)
  )
  const [noTime, setNoTime] = useState(initialNoTime)

  const handleOnChange = (newValue, isNoTime) => {
    const timeShown = !isNoTime
    setValue(newValue)
    setInputValue1(formatDate(newValue, locale))
    setLastValidValue1(formatDate(newValue, locale))
    setInputValue2(timeShown ? formatTime(newValue, locale) : '')
    setLastValidValue2(timeShown ? formatTime(newValue, locale) : '')
    setNoTime(!timeShown)
    onChange(newValue, !timeShown)
  }

  const handleOnUserInputChange = (isDate, newValue) => {
    if (isDate) {
      setInputValue1(newValue)
    } else {
      setInputValue2(newValue)
    }
  }

  const handleOnBlur = () => {
    const newValidDate = checkInputDate(true, inputValue1, locale)
    const newValidTime = checkInputDate(false, inputValue2, locale)
    const newValidValue = mergeDateAndTime(newValidDate?.value, newValidTime?.value)

    if (newValidValue) {
      setLastValidValue1(newValidDate.inputValue)
      setInputValue1(newValidDate.inputValue)
      setLastValidValue2(newValidTime.inputValue)
      setInputValue2(newValidTime.inputValue)
      setValue(newValidValue)
    } else {
      setInputValue1(lastValidValue1)
      setInputValue2(lastValidValue2)
    }
  }

  const handleOnModeChange = (newMode) => {
    setMode(newMode)
  }

  const handleOnClickOutside = () => {
    setPickerOpened(false)
  }

  const handleOnInputFocus = () => {
    setPickerOpened(true)
    handleOnChange(value, noTime)
  }

  return (
    <div className={classNames('picker-with-input', className)}>
      <DoubleInput
        onFocus={handleOnInputFocus}
        onBlur={handleOnBlur}
        autocomplete={autocomplete}
        overrideValues={false}
        input1={{
          label: _(['pickerWithInput', 'date']),
          value: inputValue1,
          onFocus: () => {
            setMode(calendarModes.date)
          },
          onChange: (val) => {
            handleOnUserInputChange(true, val)
          }
        }}
        input2={{
          label: noTime ? ' ' : _(['pickerWithInput', 'time']),
          value: noTime ? '' : inputValue2,
          onFocus: () => {
            setMode(calendarModes.time)
          },
          onChange: (val) => {
            handleOnUserInputChange(false, val)
          }
        }}
      />
      {pickerOpened && (
        <DateTimePicker
          onChange={handleOnChange}
          value={value}
          mode={mode}
          onModeChange={handleOnModeChange}
          onClickOutside={handleOnClickOutside}
          disabled={disabled}
        />
      )}
    </div>
  )
}

PickerWithInput.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  autocomplete: PropTypes.bool,
  noTime: PropTypes.bool
}

PickerWithInput.defaultProps = {
  value: new Date(),
  onChange: () => {},
  disabled: false,
  className: null,
  autocomplete: false,
  noTime: false
}
