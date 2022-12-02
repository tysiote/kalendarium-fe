import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const TIcon = ({ name, className }) => {
  return <div className={classNames('t-icon', className)}>ICON {name}</div>
}

TIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}

TIcon.defaultProps = {
  className: null
}
