export interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  decimals?: number
  balanceLabel?: string
  hideNoneBalanceString?: boolean
  extraString?: string
}

export interface SpacerProps {
  size?: 'sm' | 'md' | 'lg'
}

export interface StyledSpacerProps {
  size: number
}
