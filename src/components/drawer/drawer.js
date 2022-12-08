import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './drawer.scss'

export const Drawer = ({
  className,
  isOpened,
  slimVersion,
  children,
  slimWidth,
  fullWidth,
  absoluteDisplay
}) => {
  const renderSlim = () => {
    return (
      <div className="drawer-slim" style={{ width: !isOpened ? slimWidth : '0px' }}>
        {!isOpened && slimVersion}
      </div>
    )
  }

  const renderFull = () => {
    return (
      <div
        className={classNames('drawer-full', { 'is-absolute': absoluteDisplay })}
        style={{ width: isOpened ? fullWidth : '0px' }}>
        {isOpened && children}
      </div>
    )
  }

  return (
    <div className={classNames('drawer', className)}>
      {renderSlim()}
      {renderFull()}
    </div>
  )
}

Drawer.propTypes = {
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
  isOpened: PropTypes.bool,
  slimVersion: PropTypes.node,
  children: PropTypes.node,
  slimWidth: PropTypes.string,
  fullWidth: PropTypes.string,
  absoluteDisplay: PropTypes.bool
}

Drawer.defaultProps = {
  onOpen: null,
  onClose: null,
  className: null,
  isOpened: null,
  slimVersion: null,
  children: null,
  slimWidth: '0px',
  fullWidth: '400px',
  absoluteDisplay: false
}
