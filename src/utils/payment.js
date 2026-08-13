export const getPaymentMethodLabel = (method) => {
  const key = String(method || '').toLowerCase()
  const map = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    vnpay: 'VNPay',
  }
  return map[key] || method || ''
}

export const getPaymentStatusLabel = (status) => {
  const map = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    cancelled: 'Đã hủy thanh toán',
  }
  return map[status] || status || ''
}