import { Routes, Route } from 'react-router-dom'

import ClientLayout from './components/layout/ClientLayout'
import AdminLayout from './components/layout/AdminLayout'
import NotFound from './components/layout/NotFound'

import HomePage from './pages/client/HomePage'
import ProductList from './pages/client/ProductList'
import ProductDetail from './pages/client/ProductDetail'
import CategoryProducts from './pages/client/CategoryProducts'
import SearchPage from './pages/client/SearchPage'
import CartPage from './pages/client/CartPage'
import CheckoutPage from './pages/client/CheckoutPage'
import VnpayReturn from './pages/client/VnpayReturn'
import OrderSuccess from './pages/client/OrderSuccess'
import LoginPage from './pages/client/LoginPage'
import RegisterPage from './pages/client/RegisterPage'
import LogoutPage from './pages/client/LogoutPage'
import ForgotPassword from './pages/client/ForgotPassword'
import OtpPage from './pages/client/OtpPage'
import ResetPassword from './pages/client/ResetPassword'
import UserInfo from './pages/client/UserInfo'
import EditProfile from './pages/client/EditProfile'
import OrderList from './pages/client/OrderList'
import OrderDetail from './pages/client/OrderDetail'

import AdminLoginPage from './pages/admin/LoginPage'
import Dashboard from './pages/admin/Dashboard'
import AdminProductList from './pages/admin/product/List'
import CreateProduct from './pages/admin/product/Create'
import EditProduct from './pages/admin/product/Edit'
import AdminProductDetail from './pages/admin/product/Detail'
import AdminCategoryList from './pages/admin/category/List'
import CreateCategory from './pages/admin/category/Create'
import EditCategory from './pages/admin/category/Edit'
import AdminRoleList from './pages/admin/role/List'
import CreateRole from './pages/admin/role/Create'
import EditRole from './pages/admin/role/Edit'
import RolePermissions from './pages/admin/role/Permissions'
import AdminAccountList from './pages/admin/account/List'
import CreateAccount from './pages/admin/account/Create'
import EditAccount from './pages/admin/account/Edit'
import MyAccount from './pages/admin/MyAccount'
import EditMyAccount from './pages/admin/EditMyAccount'
import AdminOrderList from './pages/admin/order/List'
import AdminOrderDetail from './pages/admin/order/Detail'
import SettingsGeneral from './pages/admin/SettingsGeneral'

function App() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/detail/:slug" element={<ProductDetail />} />
        <Route path="products/:slugCategory" element={<CategoryProducts />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/vnpay-success" element={<VnpayReturn />} />
        <Route path="checkout/success/:orderId" element={<OrderSuccess />} />
        <Route path="user/login" element={<LoginPage />} />
        <Route path="user/register" element={<RegisterPage />} />
        <Route path="user/logout" element={<LogoutPage />} />
        <Route path="user/password/forgot" element={<ForgotPassword />} />
        <Route path="user/password/otp" element={<OtpPage />} />
        <Route path="user/password/reset" element={<ResetPassword />} />
        <Route path="user/info" element={<UserInfo />} />
        <Route path="user/edit" element={<EditProfile />} />
        <Route path="user/orders" element={<OrderList />} />
        <Route path="user/orders/:orderId" element={<OrderDetail />} />
      </Route>

      <Route path="admin/login" element={<AdminLoginPage />} />

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProductList />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/detail/:id" element={<AdminProductDetail />} />
        <Route path="products-category" element={<AdminCategoryList />} />
        <Route path="products-category/create" element={<CreateCategory />} />
        <Route path="products-category/edit/:id" element={<EditCategory />} />
        <Route path="roles" element={<AdminRoleList />} />
        <Route path="roles/create" element={<CreateRole />} />
        <Route path="roles/edit/:id" element={<EditRole />} />
        <Route path="roles/permissions" element={<RolePermissions />} />
        <Route path="accounts" element={<AdminAccountList />} />
        <Route path="accounts/create" element={<CreateAccount />} />
        <Route path="accounts/edit/:id" element={<EditAccount />} />
        <Route path="orders" element={<AdminOrderList />} />
        <Route path="orders/detail/:id" element={<AdminOrderDetail />} />
        <Route path="my-account" element={<MyAccount />} />
        <Route path="my-account/edit" element={<EditMyAccount />} />
        <Route path="settings/general" element={<SettingsGeneral />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
