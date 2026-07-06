import { Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import './ProductFilter.css'

const { Option } = Select

function ProductFilter({ keyword, sortBy, onKeywordChange, onSortChange }) {
  return (
    <div className="product-filter">
      <Input.Search
        placeholder="Tìm kiếm sản phẩm..."
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={e => onKeywordChange(e.target.value)}
        onSearch={onKeywordChange}
        className="filter-search"
        allowClear
      />

      <Select
        value={sortBy}
        onChange={onSortChange}
        className="filter-sort"
        placeholder="Sắp xếp"
      >
        <Option value="position-desc">Mặc định</Option>
        <Option value="price-asc">Giá: Thấp đến cao</Option>
        <Option value="price-desc">Giá: Cao đến thấp</Option>
        <Option value="title-asc">Tên: A-Z</Option>
        <Option value="title-desc">Tên: Z-A</Option>
      </Select>
    </div>
  )
}

export default ProductFilter
