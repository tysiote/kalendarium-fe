import React from 'react'
import PropTypes from 'prop-types'
import { getEventTime } from './utils'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import './event.scss'
import classNames from 'classnames'

export const Event = ({ data, isOpened, onClick }) => {
  const { start_time: startTime, content, title, id, no_time: noTime } = data
  const handleOnClick = (newState) => {
    onClick(id, newState)
  }

  return (
    <div className="event-wrapper">
      <Accordion onChange={(e, newState) => handleOnClick(newState)} expanded={isOpened}>
        <AccordionSummary>
          <div className="event-text-wrapper" key={`event-${id}`} onClick={handleOnClick}>
            <div className={classNames('event-time', { 'no-time': noTime })}>
              {getEventTime(startTime, noTime)}
            </div>
            <div className="event-title">{title}</div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="event-content">{content}</div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

Event.propTypes = {
  data: PropTypes.object,
  isOpened: PropTypes.bool,
  onClick: PropTypes.func
}

Event.defaultProps = {}
