import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const NumberInput = ({ id, onChange, value, className, placeholder, limit, style }) => {
  const handleOnChange = (event) => {
    const newValue = event.target.value
    const pattern = `^(?=.{0,${limit.toString()}}$)($|[0-9])`
    const regex = new RegExp(pattern, 'g')
    if (regex.test(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <input
      id={id}
      className={classNames('number-input', className)}
      type="text"
      value={value}
      onChange={handleOnChange}
      placeholder={placeholder}
      style={style}
    />
  )
}

NumberInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  limit: PropTypes.number,
  style: PropTypes.object
}

NumberInput.defaultProps = {
  value: '',
  className: null,
  id: null,
  placeholder: null,
  limit: 2,
  style: null
}
