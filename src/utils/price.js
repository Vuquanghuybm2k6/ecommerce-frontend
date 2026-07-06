export function getDisplayPrice(product = {}) {
  const price = Number(product.price)
  const priceNew = Number(product.priceNew)
  const discountPercentage = Number(product.discountPercentage)

  if (Number.isFinite(priceNew) && priceNew > 0) {
    return priceNew
  }

  if (Number.isFinite(price) && Number.isFinite(discountPercentage) && discountPercentage > 0) {
    return Math.round(price - (price * discountPercentage) / 100)
  }

  return Number.isFinite(price) ? price : 0
}

export function formatCurrency(value) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return '0₫'
  }

  return `${numericValue.toLocaleString('vi-VN')}₫`
}
