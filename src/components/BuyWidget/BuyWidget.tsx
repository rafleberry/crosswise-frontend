import React from 'react'
// import { TabMenu, Tab } from '@crosswise/uikit'
// import { useTranslation } from 'contexts/Localization'
import CryptoTab from './CryptoTab'
// import FiatTab from './FiatTab'
import { BuyWidgetContainer, BuyWidgetBodyContainer, StyledHeader } from './styled'

interface Props {
  temp?: string
}

// enum Tabs {
//   Crypto = 0,
//   Fiat,
// }

const BuyModal: React.FC<Props> = () => {
  // const [tab, setTab] = useState(0)

  // const { t } = useTranslation()

  return (
    <BuyWidgetContainer flexDirection="column">
      {/* <TabMenu variant="primaryGradient" activeIndex={tab} onItemClick={setTab} fullWidth> */}
      {/* <TabMenu variant="primaryGradient" activeIndex={0} fullWidth> */}
      {/* <StyledTab>{t('Quick Swap')}</StyledTab> */}
      {/* <Tab>{t('With Fiat')}</Tab> */}
      {/* </TabMenu> */}
      <StyledHeader>Quick Swap</StyledHeader>
      <BuyWidgetBodyContainer>
        {/* {tab === Tabs.Crypto && <CryptoTab />} */}
        {/* {tab === Tabs.Fiat && <FiatTab />} */}
        <CryptoTab />
      </BuyWidgetBodyContainer>
    </BuyWidgetContainer>
  )
}

export default BuyModal
