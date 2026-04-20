import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { translate as _ } from '../../services/translations'

export const EventTag = ({ variant, title, onClick, id }) => {
  const wrapperId = `${id}-${variant}`
  const tagRef = useRef()

  useEffect(() => {
    const handleOnWrapperClick = (e) => {
      if (onClick) {
        onClick(variant)
        e.stopPropagation()
      }
    }

    if (tagRef.current) {
      tagRef.current.addEventListener('click', handleOnWrapperClick)
    }

    return () => {
      if (tagRef.current) {
        tagRef.current.removeEventListener('click', handleOnWrapperClick)
      }
    }
  }, [])
  return (
    <div id={wrapperId} ref={tagRef}>
      <div
        className={classNames('event-tag', variant, 'big')}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.(variant, e)
        }}>
        {title ??
          _(['filters', `filterOutputMethod${variant[0].toUpperCase()}${variant.slice(1)}`])}
      </div>
      <div
        className={classNames('event-tag', variant, 'small')}
        onClick={(e) => {
          e.stopPropagation()
          onClick?.(variant, e)
        }}>
        {title ??
          _(['filters', `filterOutputMethod${variant[0].toUpperCase()}${variant.slice(1)}`])[0]}
      </div>
    </div>
  )
}

EventTag.propTypes = {
  variant: PropTypes.oneOf(['text', 'video', 'audio', 'photo', 'live', 'editor', 'link'])
    .isRequired,
  title: PropTypes.string,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

EventTag.defaultProps = {
  title: null
}
