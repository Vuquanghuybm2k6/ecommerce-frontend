import { useParams, useSearchParams } from 'react-router-dom'
import { Spin, Empty, Typography } from 'antd'
import useCategoryProducts from '../../hooks/useCategoryProducts'
import ProductCard from '../../components/client/ProductCard'
import PaginationBar from '../../components/client/PaginationBar'
import './CategoryProducts.css'

const { Title } = Typography

function CategoryProducts() {
  const { slugCategory } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page')) || 1

  const { products, pagination, loading } = useCategoryProducts({ slug: slugCategory, page })

  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="category-products-page">
      <Title level={2} className="page-title">
        Danh mục: {slugCategory}
      </Title>

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
        <Empty description="Không có sản phẩm trong danh mục này" />
      )}
    </div>
  )
}

export default CategoryProducts
