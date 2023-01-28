import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <div className="text-center p-2">
      <span>&copy; </span>
      <span>Developed by &nbsp;</span>
      <a href="https://awshad-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
        Awshad
      </a>
    </div>
  )
}

export default React.memo(AppFooter)
