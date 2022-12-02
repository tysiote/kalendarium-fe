import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../../services/redux-reducers/event-tracker/event-tracker-reducer'
import { TIcon } from '../icon'

export const TButton = ({ className, style, onClick, disabled, children, icon, id }) => {
  const dispatch = useDispatch()

  const handleOnClick = () => {
    dispatch(pushMessage(`User clicked on ${id}`))
    onClick()
  }

  const childrenToRender = icon ? (
    <div>
      <TIcon name={icon} />
      {children}
    </div>
  ) : (
    children
  )

  return (
    <button
      className={classNames('t-button', className, { disabled })}
      style={style}
      onClick={() => handleOnClick()}
      id={id}>
      {childrenToRender}
    </button>
  )
}

TButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  icon: PropTypes.string
}

TButton.defaultProps = {
  className: null,
  style: null,
  disabled: false,
  icon: null
}
