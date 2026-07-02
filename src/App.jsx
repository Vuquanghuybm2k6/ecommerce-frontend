import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/products" element={<div>Product List</div>} />
      <Route path="/products/detail/:slug" element={<div>Product Detail</div>} />
      <Route path="/products/:slugCategory" element={<div>Category Products</div>} />
      <Route path="/search" element={<div>Search</div>} />
      <Route path="/cart" element={<div>Cart</div>} />
      <Route path="/checkout" element={<div>Checkout</div>} />
      <Route path="/checkout/success/:orderId" element={<div>Order Success</div>} />
      <Route path="/user/login" element={<div>Login</div>} />
      <Route path="/user/register" element={<div>Register</div>} />
      <Route path="/user/logout" element={<div>Logout</div>} />
      <Route path="/user/password/forgot" element={<div>Forgot Password</div>} />
      <Route path="/user/password/otp" element={<div>OTP</div>} />
      <Route path="/user/password/reset" element={<div>Reset Password</div>} />
      <Route path="/user/info" element={<div>User Info</div>} />
      <Route path="/user/edit" element={<div>Edit Profile</div>} />
      <Route path="/admin/login" element={<div>Admin Login</div>} />
      <Route path="/admin" element={<div>Admin Dashboard</div>} />
      <Route path="/admin/products" element={<div>Admin Products</div>} />
      <Route path="/admin/products/create" element={<div>Create Product</div>} />
      <Route path="/admin/products/edit/:id" element={<div>Edit Product</div>} />
      <Route path="/admin/products/detail/:id" element={<div>Product Detail</div>} />
      <Route path="/admin/products-category" element={<div>Admin Categories</div>} />
      <Route path="/admin/products-category/create" element={<div>Create Category</div>} />
      <Route path="/admin/products-category/edit/:id" element={<div>Edit Category</div>} />
      <Route path="/admin/roles" element={<div>Admin Roles</div>} />
      <Route path="/admin/roles/create" element={<div>Create Role</div>} />
      <Route path="/admin/roles/edit/:id" element={<div>Edit Role</div>} />
      <Route path="/admin/roles/permissions" element={<div>Role Permissions</div>} />
      <Route path="/admin/accounts" element={<div>Admin Accounts</div>} />
      <Route path="/admin/accounts/create" element={<div>Create Account</div>} />
      <Route path="/admin/accounts/edit/:id" element={<div>Edit Account</div>} />
      <Route path="/admin/my-account" element={<div>My Account</div>} />
      <Route path="/admin/my-account/edit" element={<div>Edit My Account</div>} />
      <Route path="/admin/settings/general" element={<div>Settings</div>} />
    </Routes>
  )
}

export default App