import { useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'

function VnpayReturn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (success === 'true' && orderId) {
      navigate(`/checkout/success/${orderId}`, { replace: true })
    }
  }, [success, orderId, navigate])

  if (success === 'true' && orderId) {
    return <div className="checkout-loading"><Spin size="large" /></div>
  }

  return (
    <Result
      status="error"
      title="Thanh toán thất bại"
      subTitle="Giao dịch VNPay không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
      extra={[
        <Link to="/checkout" key="retry">
          <Button type="primary">Thử lại</Button>
        </Link>,
        <Link to="/" key="home">
          <Button>Về trang chủ</Button>
        </Link>,
      ]}
    />
  )
}

export default VnpayReturn
