import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Spin, Empty, Typography } from 'antd'
import useProducts from '../../hooks/useProducts'
import ProductCard from '../../components/client/ProductCard'
import ProductFilter from '../../components/client/ProductFilter'
import PaginationBar from '../../components/client/PaginationBar'
import './ProductList.css'

const { Title } = Typography

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const sortBy = searchParams.get('sort') || 'position-desc'

  const [localKeyword, setLocalKeyword] = useState(keyword)

  const { products, pagination, loading } = useProducts({ keyword, page })

  useEffect(() => {
    setLocalKeyword(keyword)
  }, [keyword])

  const updateParams = useCallback((updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value)
        else next.delete(key)
      })
      return next
    })
  }, [setSearchParams])

  const handleKeywordChange = (value) => {
    updateParams({ keyword: value, page: '' })
  }

  const handleSortChange = (value) => {
    updateParams({ sort: value, page: '' })
  }

  const handlePageChange = (newPage) => {
    updateParams({ page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="product-list-page">
      <Title level={2} className="page-title">Tất cả sản phẩm</Title>

      <ProductFilter
        keyword={localKeyword}
        sortBy={sortBy}
        onKeywordChange={handleKeywordChange}
        onSortChange={handleSortChange}
      />

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pagination && (
            <PaginationBar
              currentPage={pagination.currentPage}
              totalPage={pagination.totalPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <Empty description="Không tìm thấy sản phẩm nào" />
      )}
    </div>
  )
}

export default ProductList
