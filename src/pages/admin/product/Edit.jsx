import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Form, Input, InputNumber, Select, Switch, Upload, TreeSelect, Button, Space, Spin } from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import useAdminProductEdit from '../../../hooks/useAdminProductEdit'

const { Title } = Typography
const { TextArea } = Input

function mapToTreeData(categories) {
  return categories.map(cat => ({
    value: cat._id,
    title: cat.title,
    children: cat.children ? mapToTreeData(cat.children) : undefined,
  }))
}

function EditProduct() {
  const { id } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { product, categories, loading, submitting, updateProduct } = useAdminProductEdit(id)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (!product) return
    form.setFieldsValue({
      title: product.title,
      product_category_id: product.product_category_id || undefined,
      price: product.price,
      discountPercentage: product.discountPercentage,
      stock: product.stock,
      status: product.status || 'active',
      featured: product.featured === '1',
      position: product.position,
      description: product.description,
    })
    if (product.thumbnail) {
      setFileList([{ uid: '-1', name: 'thumbnail.png', status: 'done', url: product.thumbnail }])
    }
  }, [product, form])

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('price', values.price || 0)
    formData.append('discountPercentage', values.discountPercentage || 0)
    formData.append('stock', values.stock || 0)
    formData.append('status', values.status || 'active')
    formData.append('featured', values.featured ? '1' : '')
    formData.append('position', values.position || '')
    formData.append('product_category_id', values.product_category_id || '')
    formData.append('description', values.description || '')
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('thumbnail', fileList[0].originFileObj)
    }
    updateProduct(formData)
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  const treeData = mapToTreeData(categories)

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/products')}>Quay lại</Button>
      </Space>
      <Title level={3}>Chỉnh sửa sản phẩm</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 800 }}
      >
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Nhập tiêu đề sản phẩm" />
        </Form.Item>

        <Form.Item name="product_category_id" label="Danh mục">
          <TreeSelect
            treeData={treeData}
            placeholder="Chọn danh mục"
            allowClear
            treeDefaultExpandAll
          />
        </Form.Item>

        <Space style={{ width: '100%' }} size="large">
          <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
            <InputNumber min={0} style={{ width: 200 }} placeholder="Nhập giá" />
          </Form.Item>

          <Form.Item name="discountPercentage" label="Giảm giá (%)">
            <InputNumber min={0} max={100} style={{ width: 200 }} placeholder="0" />
          </Form.Item>

          <Form.Item name="stock" label="Kho" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <InputNumber min={0} style={{ width: 200 }} placeholder="Nhập số lượng" />
          </Form.Item>
        </Space>

        <Space style={{ width: '100%' }} size="large">
          <Form.Item name="status" label="Trạng thái">
            <Select style={{ width: 200 }}>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Dừng hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="featured" label="Nổi bật" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="position" label="Vị trí">
            <InputNumber min={0} style={{ width: 200 }} placeholder="Tự động" />
          </Form.Item>
        </Space>

        <Form.Item label="Hình ảnh">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
            maxCount={1}
            accept="image/*"
          >
            {fileList.length < 1 && (
              <div><UploadOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={6} placeholder="Nhập mô tả sản phẩm (có thể dùng HTML)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Cập nhật sản phẩm</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditProduct
