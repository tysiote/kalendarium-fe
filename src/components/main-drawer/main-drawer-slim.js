import React from 'react'
import PropTypes from 'prop-types'

import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import './main-drawer.scss'

export const MainDrawerSlim = ({ onClick }) => {
  return (
    <div className="main-drawer-slim" onClick={onClick}>
      <IconButton aria-label="open-drawer">
        <MenuIcon />
      </IconButton>
    </div>
  )
}

MainDrawerSlim.propTypes = {
  onClick: PropTypes.func.isRequired
}
