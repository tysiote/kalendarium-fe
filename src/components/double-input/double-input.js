import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { inputShape } from './shapes'
import { TextField } from '@mui/material'

import './double-input.scss'

export const DoubleInput = ({
  className,
  id,
  input1,
  input2,
  overrideValues,
  onBlur,
  onFocus,
  autocomplete
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleOnFocus = (newFocus, onInputFocus, inputId) => {
    setIsFocused(newFocus)
    if (onInputFocus) {
      onInputFocus(inputId)
    }

    if (!newFocus) {
      onBlur()
    } else {
      onFocus()
    }
  }
  const renderInput = ({
    className: inputClassName,
    id: inputId,
    value,
    onChange,
    label,
    overrideValue,
    onFocus: onInputFocus
  }) => {
    return (
      <TextField
        onFocus={() => handleOnFocus(true, onInputFocus, inputId)}
        onBlur={() => handleOnFocus(false)}
        id={inputId}
        onChange={(evt) => (!overrideValues && !overrideValue ? onChange(evt.target.value) : null)}
        value={value}
        label={label}
        variant="standard"
        className={classNames('double-input-part', inputClassName)}
        InputProps={{ disableUnderline: true }}
        autoComplete={autocomplete ? true : 'off'}
      />
    )
  }

  return (
    <div className={classNames('double-input', className, { isFocused })} id={id}>
      {renderInput(input1)}
      {renderInput(input2)}
    </div>
  )
}

DoubleInput.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  input1: inputShape,
  input2: inputShape,
  overrideValues: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  autocomplete: PropTypes.bool
}

DoubleInput.defaultProps = {
  className: null,
  id: null,
  input1: {},
  input2: {},
  overrideValues: true,
  onBlur: () => {},
  onFocus: () => {},
  autocomplete: PropTypes.bool
}
