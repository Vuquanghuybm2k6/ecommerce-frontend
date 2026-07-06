import { useEffect, useState } from 'react'
import { Typography, Form, Input, Upload, Button, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import useAdminSettingsGeneral from '../../hooks/useAdminSettingsGeneral'

const { Title } = Typography

function SettingsGeneral() {
  const [form] = Form.useForm()
  const { settings, loading, saving, saveSettings } = useAdminSettingsGeneral()
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (!settings) return
    form.setFieldsValue({
      websiteName: settings.websiteName,
      email: settings.email,
      address: settings.address,
      copyright: settings.copyright,
      phone: settings.phone,
    })
    if (settings.logo) {
      setFileList([{ uid: '-1', name: 'logo.png', status: 'done', url: settings.logo }])
    }
  }, [settings, form])

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('websiteName', values.websiteName || '')
    formData.append('email', values.email || '')
    formData.append('address', values.address || '')
    formData.append('copyright', values.copyright || '')
    formData.append('phone', values.phone || '')
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('logo', fileList[0].originFileObj)
    }
    saveSettings(formData)
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  return (
    <div>
      <Title level={3}>Cài đặt chung</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="websiteName" label="Tên website">
          <Input placeholder="Nhập tên website" />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item name="copyright" label="Copyright">
          <Input placeholder="Nhập copyright" />
        </Form.Item>

        <Form.Item label="Logo">
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>Lưu cài đặt</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SettingsGeneral
