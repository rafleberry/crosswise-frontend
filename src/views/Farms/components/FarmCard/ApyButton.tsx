import React from 'react'
import BigNumber from 'bignumber.js'
// import { useModal, CalculateIcon } from '@crosswise/uikit'
import { useModal } from '@crosswise/uikit'
import { useFarms } from 'state/farms/hooks'
import useLpPrice from 'hooks/useLpPrice'
import { getBalanceNumber } from 'utils/formatBalance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import { useTranslation } from 'contexts/Localization'
// import { StyledIconButton, CalculatorIcon } from './styled'
import { CalculatorIcon as Wrapper } from './styled'

export interface ApyButtonProps {
  lpLabel?: string
  crssPrice?: BigNumber
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  className?: string
}

const CalculatorIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path
      className="symbol"
      d="M3.16797 5.15332H3.79297V5.77832C3.79297 6.0372 4.00284 6.24707 4.26172 6.24707C4.52059 6.24707 4.73047 6.0372 4.73047 5.77832V5.15332H5.35547C5.61434 5.15332 5.82422 4.94345 5.82422 4.68457C5.82422 4.4257 5.61434 4.21582 5.35547 4.21582H4.73047V3.59082C4.73047 3.33195 4.52059 3.12207 4.26172 3.12207C4.00284 3.12207 3.79297 3.33195 3.79297 3.59082V4.21582H3.16797C2.90909 4.21582 2.69922 4.4257 2.69922 4.68457C2.69922 4.94345 2.90909 5.15332 3.16797 5.15332Z"
      fill="url(#paint0_linear_6611_35067)"
    />
    <path
      className="symbol"
      d="M10.4492 5.15332H12.3242C12.5831 5.15332 12.793 4.94345 12.793 4.68457C12.793 4.4257 12.5831 4.21582 12.3242 4.21582H10.4492C10.1903 4.21582 9.98047 4.4257 9.98047 4.68457C9.98047 4.94345 10.1903 5.15332 10.4492 5.15332Z"
      fill="url(#paint1_linear_6611_35067)"
    />
    <path
      className="symbol"
      d="M12.4805 12.1221H10.293C10.0341 12.1221 9.82422 12.3319 9.82422 12.5908C9.82422 12.8497 10.0341 13.0596 10.293 13.0596H12.4805C12.7393 13.0596 12.9492 12.8497 12.9492 12.5908C12.9492 12.3319 12.7393 12.1221 12.4805 12.1221Z"
      fill="url(#paint2_linear_6611_35067)"
    />
    <path
      className="symbol"
      d="M12.4805 10.5596H10.293C10.0341 10.5596 9.82422 10.7694 9.82422 11.0283C9.82422 11.2872 10.0341 11.4971 10.293 11.4971H12.4805C12.7393 11.4971 12.9492 11.2872 12.9492 11.0283C12.9492 10.7694 12.7393 10.5596 12.4805 10.5596Z"
      fill="url(#paint3_linear_6611_35067)"
    />
    <path
      className="symbol"
      d="M5.37442 10.6969C5.19139 10.5138 4.89458 10.5138 4.71152 10.6969L4.26173 11.1467L3.81192 10.6969C3.62889 10.5138 3.33208 10.5138 3.14902 10.6969C2.96595 10.8799 2.96595 11.1767 3.14902 11.3598L3.59883 11.8096L3.14902 12.2594C2.96595 12.4425 2.96595 12.7392 3.14902 12.9223C3.24055 13.0138 3.36052 13.0596 3.48048 13.0596C3.60045 13.0596 3.72042 13.0138 3.81192 12.9223L4.26173 12.4725L4.71155 12.9223C4.80305 13.0138 4.92302 13.0596 5.04298 13.0596C5.16295 13.0596 5.28292 13.0138 5.37442 12.9223C5.55748 12.7392 5.55748 12.4424 5.37442 12.2594L4.92464 11.8096L5.37445 11.3598C5.55752 11.1767 5.55752 10.8799 5.37442 10.6969Z"
      fill="url(#paint4_linear_6611_35067)"
    />
    <path
      d="M15.418 9.12735V2.05957C15.418 1.28416 14.7871 0.65332 14.0117 0.65332H1.63672C0.861313 0.65332 0.230469 1.28416 0.230469 2.05957V14.4346C0.230469 15.21 0.861313 15.8408 1.63672 15.8408H8.70447C9.47291 16.3538 10.3954 16.6533 11.3867 16.6533C14.0576 16.6533 16.2305 14.4804 16.2305 11.8096C16.2305 10.8183 15.931 9.89579 15.418 9.12735ZM14.4805 2.05957V8.08551C13.6407 7.38673 12.562 6.96582 11.3867 6.96582C10.2114 6.96582 9.13269 7.38673 8.29297 8.08551V1.59082H14.0117C14.2702 1.59082 14.4805 1.8011 14.4805 2.05957ZM1.63672 1.59082H7.35547V7.77832H1.16797V2.05957C1.16797 1.8011 1.37825 1.59082 1.63672 1.59082ZM1.16797 14.4346V8.71582H7.35547V9.12735C6.84247 9.89579 6.54297 10.8183 6.54297 11.8096C6.54297 12.9849 6.96387 14.0636 7.66266 14.9033H1.63672C1.37825 14.9033 1.16797 14.693 1.16797 14.4346ZM11.3867 15.7158C9.23281 15.7158 7.48047 13.9635 7.48047 11.8096C7.48047 9.65566 9.23281 7.90332 11.3867 7.90332C13.5406 7.90332 15.293 9.65566 15.293 11.8096C15.293 13.9635 13.5406 15.7158 11.3867 15.7158Z"
      fill="url(#paint5_linear_6611_35067)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6611_35067"
        x1="2.54113"
        y1="5.3112"
        x2="6.10085"
        y2="5.47486"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3F81EF" />
        <stop offset="1" stopColor="#8750F4" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_6611_35067"
        x1="9.83819"
        y1="4.87256"
        x2="12.9888"
        y2="5.30712"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3F81EF" />
        <stop offset="1" stopColor="#8750F4" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_6611_35067"
        x1="9.66613"
        y1="12.7788"
        x2="13.1515"
        y2="13.313"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3F81EF" />
        <stop offset="1" stopColor="#8750F4" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_6611_35067"
        x1="9.66613"
        y1="11.2163"
        x2="13.1515"
        y2="11.7505"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3F81EF" />
        <stop offset="1" stopColor="#8750F4" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_6611_35067"
        x1="2.88525"
        y1="12.3109"
        x2="5.73306"
        y2="12.4418"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3F81EF" />
        <stop offset="1" stopColor="#8750F4" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_6611_35067"
        x1="-0.578929"
        y1="11.8616"
        x2="17.6468"
        y2="12.6996"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#3F81EF" />
        <stop offset="1" stopColor="#8750F4" />
      </linearGradient>
    </defs>
  </svg>
)

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  // crssPrice,
  apr,
  displayApr,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()
  const { data: farms } = useFarms()
  const selectedFarm = farms.find((item) => item?.lpSymbol?.toLowerCase() === `${lpLabel}`.toLowerCase())
  const lpPriceInUsd = useLpPrice(selectedFarm)
  const lpTokenBalance = getBalanceNumber(new BigNumber(selectedFarm?.userData?.stakedBalance || '0'))
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      symbol={lpLabel}
      linkLabel={t('Get %symbol%', { symbol: lpLabel })}
      tokenPrice={lpPriceInUsd.toNumber()}
      apr={apr}
      displayApr={displayApr}
      linkHref={addLiquidityUrl}
      isFarm
      max={lpTokenBalance}
    />,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <Wrapper onClick={handleClickButton}>
      <CalculatorIcon />
    </Wrapper>
  )

  // return (
  //   <StyledIconButton
  //     className={className}
  //     onClick={handleClickButton}
  //     // variant="text"
  //     // scale="sm"
  //     // ml="10px"
  //   >
  //     {/* <CalculateIcon width="24px" /> */}
  //     <CalculatorIcon />
  //   </StyledIconButton>
  // )
}

export default ApyButton
