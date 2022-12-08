import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { DateTimePicker } from '../date-time-picker'
import { calendarModes } from '../date-time-picker/constants'
import { DoubleInput } from '../double-input'
import { formatTime, formatDate } from '../date-time-picker/utils'
import { translate as _ } from '../../services/translations'
import { useStore } from 'react-redux'

export const PickerWithInput = ({
  value: initialValue,
  onChange,
  disabled,
  className,
  autocomplete
}) => {
  const [pickerOpened, setPickerOpened] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [mode, setMode] = useState(calendarModes.date)
  const [inputValue1, setInputValue1] = useState('')
  const [inputValue2, setInputValue2] = useState('')
  const [noTime, setNoTime] = useState(false)
  const store = useStore()
  const locale = store.getState().locale.locale
  const handleOnChange = (newValue, isNoTime) => {
    const timeShown = !isNoTime
    setValue(newValue)
    setInputValue1(formatDate(newValue, locale))
    setInputValue2(timeShown ? formatTime(newValue, locale) : '')
    setNoTime(!timeShown)
    onChange(newValue)
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
        autocomplete={autocomplete}
        input1={{
          label: _(['pickerWithInput', 'date']),
          value: inputValue1,
          onFocus: () => {
            setMode(calendarModes.date)
          }
        }}
        input2={{
          label: noTime ? ' ' : _(['pickerWithInput', 'time']),
          value: noTime ? '' : inputValue2,
          onFocus: () => {
            setMode(calendarModes.time)
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
  autocomplete: PropTypes.bool
}

PickerWithInput.defaultProps = {
  value: new Date(),
  onChange: () => {},
  disabled: false,
  className: null,
  autocomplete: false
}
