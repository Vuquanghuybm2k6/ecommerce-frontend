import { useState, useEffect } from 'react'
import { Spin, Empty, Typography } from 'antd'
import axiosClient from '../../api/axiosClient'
import API from '../../api/endpoints'
import ProductCard from '../../components/client/ProductCard'
import './HomePage.css'

const { Title } = Typography

function HomePage() {
  const [productsFeatured, setProductsFeatured] = useState([])
  const [productsNew, setProductsNew] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get(API.home)
      .then(res => {
        const data = res.data.data
        setProductsFeatured(data.productsFeatured || [])
        setProductsNew(data.productsNew || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="home-loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Chào mừng đến với Shop</h1>
          <p className="hero-subtitle">
            Khám phá bộ sưu tập sản phẩm đa dạng với giá tốt nhất
          </p>
          <a href="#products-featured" className="hero-cta">
            Xem sản phẩm nổi bật
          </a>
        </div>
      </section>

      {productsFeatured.length > 0 && (
        <section id="products-featured" className="product-section">
          <Title level={2} className="section-title">Sản phẩm nổi bật</Title>
          <div className="product-grid">
            {productsFeatured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {productsNew.length > 0 && (
        <section className="product-section">
          <Title level={2} className="section-title">Sản phẩm mới</Title>
          <div className="product-grid">
            {productsNew.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {!loading && productsFeatured.length === 0 && productsNew.length === 0 && (
        <Empty description="Chưa có sản phẩm nào" />
      )}
    </div>
  )
}

export default HomePage
