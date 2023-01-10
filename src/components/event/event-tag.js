import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { translate as _ } from '../../services/translations'

export const EventTag = ({ variant, title }) => {
  return (
    <>
      <div className={classNames('event-tag', variant, 'big')}>
        {title ??
          _(['filters', `filterOutputMethod${variant[0].toUpperCase()}${variant.slice(1)}`])}
      </div>
      <div className={classNames('event-tag', variant, 'small')}>
        {title ??
          _(['filters', `filterOutputMethod${variant[0].toUpperCase()}${variant.slice(1)}`])[0]}
      </div>
    </>
  )
}

EventTag.propTypes = {
  variant: PropTypes.oneOf(['text', 'video', 'audio', 'photo', 'live', 'editor']).isRequired,
  title: PropTypes.string
}

EventTag.defaultProps = {
  title: null
}
