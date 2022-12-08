import React from 'react'
import PropTypes from 'prop-types'
import { Drawer } from '@mui/material'

import './main-drawer.scss'

// const drawerWidth = 400
export const MainDrawer = ({ onClose, children, isOpened }) => {
  return (
    <Drawer anchor="left" onClose={onClose} open={isOpened} variant="persistent">
      <div className="main-drawer">{children}</div>
    </Drawer>
  )
}

MainDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string,
  isOpened: PropTypes.bool
}

MainDrawer.defaultProps = {
  onClose: () => {},
  className: null,
  isOpened: false
}
