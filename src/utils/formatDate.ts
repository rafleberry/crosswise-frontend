const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const formatNumber = (number) => (number < 10 ? `0${number}` : number)

export const formatDate = (date = new Date()) => {
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export const formatDateTime = (date = new Date()) => {
  return `${formatNumber(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()} - ${formatNumber(
    date.getHours(),
  )} : ${formatNumber(date.getMinutes())} : ${formatNumber(date.getSeconds())}`
}

export const isValidDate = (date) => {
  return !Number.isNaN(date.getFullYear())
}

export const getDate = (date) => {
  if (!isValidDate(new Date(date))) return ''
  let input = Number(date) / 1000
  if (input < 1) return ''
  if (input < 60) return `${Math.floor(input)} seconds`
  input /= 60
  if (input < 60) return `${Math.floor(input)} minutes`
  input /= 60
  if (input < 24) return `${Math.floor(input)} hours`
  input /= 24
  return `${Math.floor(input)} days`
}
