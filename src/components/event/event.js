import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { getEventTime, getTagsFromEvent, isAddedToday } from './utils'
import { translate as _ } from '../../services/translations'
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Tooltip } from '@mui/material'
import './event.scss'
import classNames from 'classnames'
import { EventTag } from './event-tag'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { useDispatch } from 'react-redux'
import { updateEventModalId } from '../../services/redux-reducers/application/application-reducer'

export const Event = ({
  data,
  isOpened,
  onClick,
  withDate,
  showEditors,
  exportingMode,
  onExport,
  isExported,
  editMode,
  onEditClick,
  onRestore
}) => {
  const [checked, setChecked] = useState(isExported)
  const {
    start_time: startTime,
    content,
    title,
    id,
    no_time: noTime,
    tags2,
    added,
    editors,
    deleted
  } = data

  const dispatch = useDispatch()

  useEffect(() => {
    setChecked(isExported)
  })

  const softRemoveTooltip = _(['eventEditor', 'softRemoveTooltip'])
  const hardRemoveTooltip = _(['eventEditor', 'hardRemoveTooltip'])
  const restoreTooltip = _(['eventEditor', 'restoreTooltip'])

  const handleOnClick = (newState) => {
    onClick(id, newState)
  }

  const handleOnExportClick = () => {
    const newValue = !checked
    setChecked(newValue)
    onExport(id, newValue)
  }

  const handleOnEditClick = () => {
    onEditClick(id)
  }

  const handleOnRestoreClick = () => {
    const URL = 'https://kalendarium.tasr.sk/public/index.php/api/events/restore'

    fetch(URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ id }),
      mode: 'cors',
      headers: { 'content-type': 'application/json; charset=UTF-8' }
    })
      .then((result) => result.json())
      .then(() => {
        onRestore(id)
      })
  }

  const handleOnSoftDeleteClick = () => {
    if (!deleted) {
      dispatch(updateEventModalId({ id, deletePower: 1 }))
      // handleOnDelete(2)
    }
  }

  const handleOnHardDeleteClick = () => {
    if (!deleted) {
      dispatch(updateEventModalId({ id, deletePower: 2 }))
      // handleOnDelete(2)
    }
  }

  const renderTags = () => {
    const tags = getTagsFromEvent(tags2, showEditors ? editors : null)

    return tags.map((tag, idx) => (
      <EventTag variant={tag.variant} title={tag.title} key={`event-tag-${id}-${tag}-${idx}`} />
    ))
  }

  const renderEditMode = () => {
    return (
      <div className="event-icons">
        <div className="event-icon">
          <ModeEditIcon onClick={handleOnEditClick} id={`edit-mode-button-${id}`} />
        </div>
        {!deleted && (
          <div className="event-icon">
            <Tooltip title={softRemoveTooltip} arrow placement="top">
              <span>
                <DeleteIcon onClick={handleOnSoftDeleteClick} id={`soft-delete-button-${id}`} />
              </span>
            </Tooltip>
          </div>
        )}
        {deleted && (
          <div className="event-icon restore">
            <Tooltip title={restoreTooltip} arrow placement="top">
              <span>
                <RestoreFromTrashIcon onClick={handleOnRestoreClick} id={`restore-button-${id}`} />
              </span>
            </Tooltip>
          </div>
        )}
        <div className={`event-icon hard-remove${deleted ? ' disabled' : ''}`}>
          <Tooltip title={deleted ? '' : hardRemoveTooltip} arrow placement="top">
            <span>
              <DeleteForeverIcon
                onClick={handleOnHardDeleteClick}
                id={`hard-delete-button-${id}`}
              />
            </span>
          </Tooltip>
        </div>
      </div>
    )
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
        {editMode && renderEditMode()}
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
                {deleted && isAddedToday(startTime, deleted) && (
                  <div className="deleted-today">{_(['events', 'deletedToday'])}</div>
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
  isExported: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired
}
