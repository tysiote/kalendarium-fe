import PropTypes from 'prop-types'
import { TButton } from '../../components/button'

import { translate as _ } from '../../services/translations'
import './event-editor-page.scss'
import { TInput } from '../../components/input'
import React, { useEffect, useState } from 'react'
import { PickerWithInput } from '../../components/picker-with-input'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Tooltip
} from '@mui/material'

import { isFilterChecked, updateFilters } from '../filter-page/utils'
import {
  LOCATION_FILTERS,
  METHOD_FILTERS,
  OUTPUT_METHOD_FILTERS,
  SPORT_TYPES_FILTERS
} from '../filter-page/constants'
import {
  convertEventTagsToRawTags,
  convertRawTagsToEventTags,
  convertStringDateToStartTime
} from './utils'

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

export const EventEditorPage = ({ onAdd, onEdit, onCancel, onRemove, onRestore, event }) => {
  const editing = !!event
  const {
    id,
    title: eventTitle,
    content: eventContent,
    editors,
    tags1: eventTags1,
    tags2: eventTags2,
    tags3: eventTags3,
    tags5: eventSportTypes,
    start_time: eventStartTime,
    no_time: eventNoTime,
    deleted: eventDeleted
  } = event ?? {}
  const [title, setTitle] = useState(eventTitle)
  const [content, setContent] = useState(eventContent)
  const [journalists, setJournalists] = useState(editors)
  const [tags, setTags] = useState(
    editing
      ? convertRawTagsToEventTags({
          tags1: eventTags1,
          tags2: eventTags2,
          tags3: eventTags3,
          sportTypes: eventSportTypes
        })
      : []
  )
  const [removeConfirmed, setRemoveConfirmed] = useState(false)
  const [startTime, setStartTime] = useState(
    editing ? convertStringDateToStartTime(eventStartTime) : new Date()
  )
  const [noTime, setNoTime] = useState(eventNoTime)
  const [additionalTimes, setAdditionalTimes] = useState([])

  const createEventLabel = _(['eventEditor', 'createEvent'])
  const updateEventLabel = _(['eventEditor', 'updateEvent'])
  const dismissLabel = _(['eventEditor', 'returnToEvents'])
  const softDeleteLabel = _(['eventEditor', 'softRemoveEvent'])
  const hardDeleteLabel = _(['eventEditor', 'hardRemoveEvent'])
  const restoreLabel = _(['eventEditor', 'restoreEvent'])
  const titleLabel = _(['eventEditor', 'titleLabel'])
  const contentLabel = _(['eventEditor', 'contentLabel'])
  const journalistsLabel = _(['eventEditor', 'journalistsLabel'])
  const confirmRemoveLabel = _(['eventEditor', 'confirmRemoveLabel'])
  const softRemoveTooltip = _(['eventEditor', 'softRemoveTooltip'])
  const hardRemoveTooltip = _(['eventEditor', 'hardRemoveTooltip'])
  const restoreTooltip = _(['eventEditor', 'restoreTooltip'])
  const editingLabel = _(['eventEditor', 'editingLabel'])
  const addingLabel = _(['eventEditor', 'addingLabel'])
  const eventHashtag = _(['eventEditor', 'eventHashtag'])
  const addTimeLabel = _(['eventEditor', 'addTimeLabel'])
  const additionalTimesLabel = _(['eventEditor', 'additionalTimesLabel'])

  useEffect(() => {
    setTags(
      editing
        ? convertRawTagsToEventTags({
            tags1: eventTags1,
            tags2: eventTags2,
            tags3: eventTags3,
            sportTypes: eventSportTypes
          })
        : []
    )
    setRemoveConfirmed(false)
  }, [event])

  const handleOnUpdateClick = () => {
    const { tags1, tags2, tags3, sport_type } = convertEventTagsToRawTags(tags)
    const newData = {
      title,
      content,
      editors: journalists ?? '',
      start_time: startTime.toISOString(),
      no_time: noTime ? 1 : 0,
      force_edit: 0,
      tags1,
      tags2,
      tags3,
      tags6: sport_type,
      id
    }
    const URL = 'https://kalendarium.tasr.sk/public/index.php/api/events/edit'

    fetch(URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(newData),
      mode: 'cors',
      headers: { 'content-type': 'application/json; charset=UTF-8' }
    })
      .then((result) => result.json())
      .then(() => {
        onEdit()
      })
  }

  const handleOnCancelClick = () => {
    onCancel()
  }

  const handleOnAddClick = () => {
    const { tags1, tags2, tags3, sport_type } = convertEventTagsToRawTags(tags)
    const newData = {
      title,
      content,
      editors: journalists ?? '',
      start_time: startTime.toISOString(),
      no_time: noTime ? 1 : 0,
      force_edit: 0,
      tags1,
      tags2,
      tags3,
      tags4: '',
      tags5: '',
      tags6: sport_type
    }

    const isBulk = !editing && additionalTimes?.length
    const newEvents = isBulk ? { data: [newData] } : newData
    if (additionalTimes) {
      additionalTimes.forEach((time) => {
        newEvents.data.push({
          ...newData,
          no_time: time.noTime ? 1 : 0,
          start_time: time.startTime.toISOString()
        })
      })
    }

    const URL = `https://kalendarium.tasr.sk/public/index.php/api/events/add${
      isBulk ? '/bulk' : ''
    }`

    fetch(URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(newEvents),
      mode: 'cors',
      headers: { 'content-type': 'application/json; charset=UTF-8' }
    })
      .then((result) => result.json())
      .then(() => {
        onAdd()
      })
  }

  const handleOnRemoveClick = (removePower) => {
    const URL = 'https://kalendarium.tasr.sk/public/index.php/api/events/delete'

    fetch(URL, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ id, delete_method: removePower === 1 ? 'soft' : 'hard' }),
      mode: 'cors',
      headers: { 'content-type': 'application/json; charset=UTF-8' }
    })
      .then((result) => result.json())
      .then(() => {
        onRemove(id, removePower)
      })
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

  const handleOnTagClick = (tagName) => {
    setTags(updateFilters(tags, tagName))
  }

  const handleOnPickerChange = (newValue, newNoTime) => {
    setStartTime(newValue)
    setNoTime(newNoTime)
  }

  const handleOnAdditionalPickerChange = (newValue, newNoTime, timeId) => {
    const newTime = { startTime: newValue, noTime: newNoTime }
    setAdditionalTimes(additionalTimes.map((time, idx) => (idx === timeId ? newTime : time)))
  }

  const handleOnAddTimeClick = () => {
    setAdditionalTimes(additionalTimes.concat([{ startTime: new Date(), noTime: false }]))
  }

  const handleOnRemoveTimeClick = (timeId) => {
    setAdditionalTimes(additionalTimes.filter((time, idx) => idx !== timeId))
  }

  const renderPageHeader = () => {
    return (
      <div className="event-editor-header">
        <h2>{editing ? editingLabel : addingLabel}</h2>
        {editing && <span>{`${eventHashtag} #${id}`}</span>}
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="event-editor-field event-title">
        <TInput
          onChange={(newValue) => setTitle(newValue)}
          value={title}
          label={titleLabel}
          id="event-editor-title"
          variant="outlined"
        />
      </div>
    )
  }

  const renderContent = () => {
    return (
      <div className="event-editor-field event-content">
        <TInput
          onChange={(newValue) => setContent(newValue)}
          value={content}
          multiline
          rows={6}
          label={contentLabel}
          variant="outlined"
          id="event-editor-content"
        />
      </div>
    )
  }

  const renderPicker = () => {
    return (
      <div className="event-editor-field event-picker">
        <div className="event-editor-picker-line">
          <PickerWithInput value={startTime} onChange={handleOnPickerChange} noTime={noTime} />
        </div>

        {!editing && (
          <div className="additional-times">
            <h4>{additionalTimesLabel}</h4>
            {additionalTimes.map((time, idx) => (
              <div className="event-editor-picker-line" key={`additional-time-${idx}`}>
                <RemoveCircleIcon
                  className="remove-time"
                  onClick={() => handleOnRemoveTimeClick(idx)}
                  fontSize={'large'}
                />
                <PickerWithInput
                  value={time.startTime}
                  onChange={(newValue, newNoTime) =>
                    handleOnAdditionalPickerChange(newValue, newNoTime, idx)
                  }
                  noTime={time.noTime}
                />
              </div>
            ))}
            <TButton
              onClick={handleOnAddTimeClick}
              id={'event-editor-add-time-button'}
              className="add-time-button">
              {addTimeLabel}
            </TButton>
          </div>
        )}
      </div>
    )
  }

  const renderJournalists = () => {
    return (
      <div className="event-editor-field event-journalists">
        <TInput
          onChange={(newValue) => setJournalists(newValue)}
          value={journalists}
          label={journalistsLabel}
          id="event-editor-journalists"
          variant="outlined"
        />
      </div>
    )
  }

  const renderTagGroup = (group, groupName, groupDisabled) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} className="tags-group">
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">{_(['filters', groupName])}</FormLabel>
          <FormGroup>
            {group.map((t, idx) => (
              <FormControlLabel
                key={`tag-checkbox-${idx}-${t.name}`}
                control={
                  <Checkbox
                    checked={!groupDisabled && isFilterChecked(tags, t.name)}
                    onChange={() => handleOnTagClick(t.name)}
                    name={t.name}
                    disabled={groupDisabled}
                  />
                }
                label={_(t.translation)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>
    )
  }

  const renderTags = () => {
    return (
      <div className="event-editor-field event-tags">
        <Grid container spacing={2}>
          {renderTagGroup(METHOD_FILTERS, 'filterMethodLabel')}
          {renderTagGroup(LOCATION_FILTERS, 'filterLocationLabel')}
          {renderTagGroup(OUTPUT_METHOD_FILTERS, 'filterOutputMethodLabel')}
          {renderTagGroup(SPORT_TYPES_FILTERS, 'filterSportLabel', !isFilterChecked(tags, 'sport'))}
        </Grid>
      </div>
    )
  }

  const renderRemoveOptions = () => {
    return (
      <div className="event-editor-field event-editor-remove-options">
        {!eventDeleted && (
          <Tooltip
            title={<div className="tooltip-content">{softRemoveTooltip}</div>}
            arrow
            placement="right">
            <span className="soft-remove">
              <TButton onClick={() => handleOnRemoveClick(1)} id={`soft-remove-${id}`}>
                {softDeleteLabel}
              </TButton>
            </span>
          </Tooltip>
        )}

        {eventDeleted && (
          <Tooltip
            title={<div className="tooltip-content">{restoreTooltip}</div>}
            arrow
            placement="right">
            <span className="soft-remove">
              <TButton onClick={handleOnRestoreClick} id={`restore-${id}`}>
                {restoreLabel}
              </TButton>
            </span>
          </Tooltip>
        )}

        <div>
          <Tooltip
            title={<div className="tooltip-content">{hardRemoveTooltip}</div>}
            arrow
            placement="bottom">
            <span className="hard-remove">
              <TButton
                onClick={() => handleOnRemoveClick(2)}
                id={`hard-remove-${id}`}
                disabled={!removeConfirmed}>
                {hardDeleteLabel}
              </TButton>
            </span>
          </Tooltip>
          <FormControlLabel
            control={
              <Checkbox
                checked={removeConfirmed}
                onChange={() => {
                  setRemoveConfirmed(!removeConfirmed)
                }}
              />
            }
            label={confirmRemoveLabel}
          />
        </div>
      </div>
    )
  }

  const renderPageButtons = () => {
    return (
      <div className="event-editor-page-buttons-wrapper">
        <div className="event-editor-page-buttons">
          <TButton
            onClick={handleOnCancelClick}
            id={`event-editor-dismiss`}
            className="event-editor-dismiss">
            {dismissLabel}
          </TButton>
          {!editing && (
            <TButton
              onClick={handleOnAddClick}
              id={`event-editor-add`}
              className="event-editor-save">
              {createEventLabel}
            </TButton>
          )}
          {editing && (
            <TButton
              onClick={handleOnUpdateClick}
              id={`event-editor-update`}
              className="event-editor-save">
              {updateEventLabel}
            </TButton>
          )}
        </div>
      </div>
    )
  }

  const renderFields = () => {
    return (
      <div className="event-editor-fields">
        {renderTitle()}
        {renderContent()}
        {renderJournalists()}
        {renderTags()}
        {renderPicker()}
        {editing && renderRemoveOptions()}
      </div>
    )
  }

  return (
    <div className="event-editor-page">
      {renderPageHeader()}
      {renderFields()}
      {renderPageButtons()}
    </div>
  )
}

EventEditorPage.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  event: PropTypes.object
}
