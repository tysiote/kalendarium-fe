import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { TextField } from '@mui/material'

import './input.scss'

export const TInput = ({ className, onChange, variant, onFocus, onBlur, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false)
  const handleOnFocus = () => {
    setIsFocused(true)
    onFocus()
  }

  const handleOnBlur = () => {
    setIsFocused(false)
    onBlur()
  }
  const handleOnChange = (evt) => {
    onChange(evt.target.value)
  }
  return (
    <TextField
      {...rest}
      className={classNames('t-input', { 'is-focused': isFocused }, className)}
      onChange={handleOnChange}
      variant={variant}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      autoComplete="off"
    />
  )
}

TInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

TInput.defaultProps = {
  className: null,
  onChange: () => {},
  variant: 'standard',
  onFocus: () => {},
  onBlur: () => {}
}
