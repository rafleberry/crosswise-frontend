import React from 'react'
import { IconSave } from 'components/SvgIcons'

import {
  Wrapper,
  //  Gear1,
  //  Gear2,
  //  Gear3
} from './styled'

interface SaveIconButtonProps {
  visible: boolean
  onClick?: any
}

const SaveIconButton: React.FC<SaveIconButtonProps> = ({ visible, onClick }) => {
  const handleClickSave = () => {
    if (!visible) return
    if (onClick) onClick()
  }

  return (
    <Wrapper visible={visible} onClick={handleClickSave}>
      <IconSave />
      {/* <Gear1 size={19} />
      <Gear2 size={15} />
      <Gear3 size={12} /> */}
    </Wrapper>
  )
}

export default SaveIconButton
