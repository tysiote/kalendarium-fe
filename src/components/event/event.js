import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getEventTime, getTagsFromEvent, isAddedToday } from './utils'
import { translate as _ } from '../../services/translations'
import { Accordion, AccordionDetails, AccordionSummary, Checkbox } from '@mui/material'
import './event.scss'
import classNames from 'classnames'
import { EventTag } from './event-tag'

export const Event = ({
  data,
  isOpened,
  onClick,
  withDate,
  showEditors,
  exportingMode,
  onExport,
  isExported
}) => {
  const [checked, setChecked] = useState(isExported)
  const { start_time: startTime, content, title, id, no_time: noTime, tags2, added, editors } = data

  useEffect(() => {
    setChecked(isExported)
  })

  const handleOnClick = (newState) => {
    onClick(id, newState)
  }

  const handleOnExportClick = () => {
    const newValue = !checked
    setChecked(newValue)
    onExport(id, newValue)
  }

  const renderTags = () => {
    const tags = getTagsFromEvent(tags2, showEditors ? editors : null)

    return tags.map((tag, idx) => (
      <EventTag variant={tag.variant} title={tag.title} key={`event-tag-${id}-${tag}-${idx}`} />
    ))
  }

  return (
    <div className="event-wrapper">
      <div className="event-export-control">
        {exportingMode && (
          <Checkbox
            checked={checked}
            onChange={handleOnExportClick}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        )}
      </div>
      <div className="event-accordion">
        <Accordion onChange={(e, newState) => handleOnClick(newState)} expanded={isOpened}>
          <AccordionSummary>
            <div className="event-summary-wrapper">
              <div className="event-tags">{renderTags()}</div>
              <div className="event-text-wrapper" key={`event-${id}`} onClick={handleOnClick}>
                <div className={classNames('event-time', { 'no-time': noTime && !withDate })}>
                  {getEventTime(startTime, noTime, withDate)}
                </div>
                <div className="event-title">{title}</div>
                {isAddedToday(startTime, added) && (
                  <div className="added-today">{_(['events', 'addedToday'])}</div>
                )}
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="event-content">{content}</div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  )
}

Event.propTypes = {
  data: PropTypes.object.isRequired,
  isOpened: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  withDate: PropTypes.bool.isRequired,
  showEditors: PropTypes.bool.isRequired,
  exportingMode: PropTypes.bool.isRequired,
  onExport: PropTypes.func.isRequired,
  isExported: PropTypes.bool.isRequired
}
