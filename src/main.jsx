import React from 'react'
// ReactDOM có nhiệm vụ "gắn" ứng dụng React vào file HTML
import ReactDOM from 'react-dom/client'

// BrowserRouter giúp React quản lý URL (Routing)
// Nếu không có BrowserRouter thì Route, Link, useNavigate...
// sẽ không hoạt động.
import { BrowserRouter } from 'react-router-dom'

// ConfigProvider là nơi cấu hình chung cho Ant Design
// Ví dụ: Màu chủ đạo, Font chữ, Ngôn ngữ, Theme
import { ConfigProvider } from 'antd'

// Component gốc của ứng dụng
// Sau khi React khởi động sẽ render component này đầu tiên
import App from './App'

// Tìm phần tử <div id="root"></div> trong file index.html
// rồi "đổ" toàn bộ ứng dụng React vào đó.
ReactDOM.createRoot(
  document.getElementById('root')
).render(

  // StrictMode chỉ hoạt động khi develop
  // Nó giúp phát hiện lỗi, cảnh báo code chưa tốt.
  // Vì vậy đôi khi bạn sẽ thấy useEffect chạy 2 lần.
  <React.StrictMode>

    {/* ConfigProvider bọc toàn bộ ứng dụng để mọi component
        của Ant Design đều dùng chung cấu hình */}
    <ConfigProvider
      // Theme chung của Ant Design
      theme={{
        token: {
          // Màu chủ đạo
          // Ví dụ Button, Switch, Checkbox...
          // sẽ tự động dùng màu này.
          colorPrimary: '#1677ff'

        }
      }}
    >

      {/* BrowserRouter giúp website có nhiều trang
          Ví dụ:
          /
          /products
          /login
          /cart

          React sẽ biết khi URL thay đổi
          thì cần render component nào.
      */}
      <BrowserRouter>
        {/* Component gốc của toàn bộ website

            App.jsx sẽ chứa:

            <Routes>

              <Route ... />

            </Routes>

            để điều hướng các trang.
        */}
        <App />

      </BrowserRouter>

    </ConfigProvider>

  </React.StrictMode>
)