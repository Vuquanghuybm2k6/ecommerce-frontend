import { Pagination } from 'antd'
import './PaginationBar.css'

function PaginationBar({ currentPage, totalPage, onPageChange }) {
  if (!totalPage || totalPage <= 1) return null

  return (
    <div className="pagination-bar">
      <Pagination
        current={currentPage}
        total={totalPage * 10}
        pageSize={10}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  )
}

export default PaginationBar
