export function getDisplayPrice(product = {}) {
  const priceNew = Number(product.priceNew)

  if (Number.isFinite(priceNew) && priceNew > 0) {
    return priceNew
  }

  const v = product.variants?.[0]
  if (v) {
    const price = Number(v.price)
    const discount = Number(v.discountPercentage)
    if (price > 0) {
      if (discount > 0) return Math.round(price - (price * discount) / 100)
      return price
    }
  }

  return 0
}

export function formatCurrency(value) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return '0₫'
  }

  return `${numericValue.toLocaleString('vi-VN')}₫`
}
