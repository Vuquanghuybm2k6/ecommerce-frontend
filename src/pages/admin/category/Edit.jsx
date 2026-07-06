import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Form, Input, InputNumber, Select, Upload, TreeSelect, Button, Space, Spin } from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import useAdminCategoryEdit from '../../../hooks/useAdminCategoryEdit'

const { Title } = Typography
const { TextArea } = Input

function mapToTreeData(records) {
  return records.map(cat => ({
    value: cat._id,
    title: cat.title,
    children: cat.children ? mapToTreeData(cat.children) : undefined,
  }))
}

function EditCategory() {
  const { id } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { category, records, loading, submitting, updateCategory } = useAdminCategoryEdit(id)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (!category) return
    form.setFieldsValue({
      title: category.title,
      parent_id: category.parent_id || undefined,
      description: category.description,
      status: category.status || 'active',
      position: category.position,
    })
    if (category.thumbnail) {
      setFileList([{ uid: '-1', name: 'thumbnail.png', status: 'done', url: category.thumbnail }])
    }
  }, [category, form])

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('parent_id', values.parent_id || '')
    formData.append('description', values.description || '')
    formData.append('status', values.status || 'active')
    formData.append('position', values.position != null ? String(values.position) : '')
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('thumbnail', fileList[0].originFileObj)
    }
    updateCategory(formData)
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  const treeData = mapToTreeData(records)

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/products-category')}>Quay lại</Button>
      </Space>
      <Title level={3}>Chỉnh sửa danh mục</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Nhập tiêu đề danh mục" />
        </Form.Item>

        <Form.Item name="parent_id" label="Danh mục cha">
          <TreeSelect
            treeData={treeData}
            placeholder="Chọn danh mục cha"
            allowClear
            treeDefaultExpandAll
          />
        </Form.Item>

        <Space style={{ width: '100%' }} size="large">
          <Form.Item name="status" label="Trạng thái">
            <Select style={{ width: 200 }}>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Dừng hoạt động</Select.Option>
            </Select>
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
          <TextArea rows={4} placeholder="Nhập mô tả danh mục" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Cập nhật danh mục</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditCategory
