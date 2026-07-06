import { useState, useEffect } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminProductDetail(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosAdminAuth.get(API.adminProductDetail(id))
      .then(res => setProduct(res.data.data?.product || null))
      .catch(() => message.error('Không thể tải chi tiết sản phẩm'))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading }
}

export default useAdminProductDetail
