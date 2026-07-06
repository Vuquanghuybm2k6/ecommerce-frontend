import { useSearchParams, Link } from 'react-router-dom'
import { Spin, Empty, Typography } from 'antd'
import useSearch from '../../hooks/useSearch'
import ProductCard from '../../components/client/ProductCard'
import './SearchPage.css'

const { Title, Text } = Typography

function SearchPage() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''

  const { products, loading } = useSearch(keyword)

  return (
    <div className="search-page">
      <div className="search-header">
        <Title level={3}>
          {keyword ? (
            <>
              Kết quả tìm kiếm cho "<Text strong>{keyword}</Text>"
            </>
          ) : (
            'Tìm kiếm sản phẩm'
          )}
        </Title>
        {!loading && keyword && (
          <Text className="search-count">
            Tìm thấy {products.length} sản phẩm
          </Text>
        )}
      </div>

      {loading ? (
        <div className="search-loading">
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              highlightKeyword={keyword}
            />
          ))}
        </div>
      ) : keyword ? (
        <Empty
          description={
            <span>
              Không tìm thấy sản phẩm nào cho từ khóa "<Text strong>{keyword}</Text>"
            </span>
          }
        >
          <Link to="/products">Xem tất cả sản phẩm</Link>
        </Empty>
      ) : (
        <Empty description="Vui lòng nhập từ khóa tìm kiếm" />
      )}
    </div>
  )
}

export default SearchPage
