export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function ensAppUrl(name: string): string {
  return `https://app.ens.domains/${name}`
}

export function etherscanUrl(address: string): string {
  return `https://etherscan.io/address/${address}`
}

export function isPureNumeric(label: string): boolean {
  return /^\d+$/.test(label)
}

export function isPureAlpha(label: string): boolean {
  return /^[a-z]+$/.test(label)
}
