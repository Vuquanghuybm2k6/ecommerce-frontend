import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Form, Input, InputNumber, Select, Switch, TreeSelect, Button, Space, Spin, Tag, AutoComplete } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import useAdminProductEdit from '../../../hooks/useAdminProductEdit'

const { Title, Text } = Typography
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
  const [variants, setVariants] = useState([])
  const [attrDefs, setAttrDefs] = useState([
    { name: 'Màu sắc', values: [] },
    { name: 'Phiên bản', values: [] },
  ])
  const [newColor, setNewColor] = useState('')
  const [newVersion, setNewVersion] = useState('')
  const fileInputRefs = useRef({})

  const [matrixSelections, setMatrixSelections] = useState({})
  const [matrixPrice, setMatrixPrice] = useState(0)
  const [matrixDiscount, setMatrixDiscount] = useState(0)
  const [matrixStock, setMatrixStock] = useState(0)
  const [matrixThumbnail, setMatrixThumbnail] = useState('')
  const [matrixThumbnailFile, setMatrixThumbnailFile] = useState(null)
  const [matrixThumbnailPreview, setMatrixThumbnailPreview] = useState('')
  const fileInputRefMatrix = useRef(null)

  useEffect(() => {
    const selections = {}
    if (attrDefs.length >= 2) {
      attrDefs[0].values.forEach(r => attrDefs[1].values.forEach(c => {
        selections[`${r}|${c}`] = false
      }))
    }
    setMatrixSelections(selections)
    setMatrixThumbnail('')
    setMatrixThumbnailFile(null)
    setMatrixThumbnailPreview('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(attrDefs.map(d => [d.name, ...d.values]))])

  const toggleMatrixCell = (rowVal, colVal) => {
    setMatrixSelections(prev => ({ ...prev, [`${rowVal}|${colVal}`]: !prev[`${rowVal}|${colVal}`] }))
  }

  const selectAllMatrix = () => {
    const selections = {}
    attrDefs[0].values.forEach(r => attrDefs[1].values.forEach(c => {
      selections[`${r}|${c}`] = true
    }))
    setMatrixSelections(selections)
  }

  const clearAllMatrix = () => {
    const selections = {}
    attrDefs[0].values.forEach(r => attrDefs[1].values.forEach(c => {
      selections[`${r}|${c}`] = false
    }))
    setMatrixSelections(selections)
  }

  const generateFromMatrix = () => {
    const selectedKeys = Object.entries(matrixSelections)
      .filter(([, v]) => v)
      .map(([k]) => k)
    if (selectedKeys.length === 0) return
    const [attr0, attr1] = [attrDefs[0].name, attrDefs[1].name]
    setVariants(selectedKeys.map(key => {
      const [v0, v1] = key.split('|')
      return {
        tempId: Date.now() + Math.random(),
        sku: '',
        price: matrixPrice,
        discountPercentage: matrixDiscount,
        stock: matrixStock,
        thumbnail: matrixThumbnailFile ? '' : (matrixThumbnail || ''),
        thumbnailFile: matrixThumbnailFile,
        thumbnailPreview: matrixThumbnailPreview,
        attrValues: { [attr0]: v0, [attr1]: v1 },
        status: 'active',
      }
    }))
  }

  const handleMatrixThumbnailFile = (file) => {
    if (matrixThumbnailPreview) URL.revokeObjectURL(matrixThumbnailPreview)
    setMatrixThumbnailFile(file)
    setMatrixThumbnailPreview(URL.createObjectURL(file))
    setMatrixThumbnail('')
  }

  const [batchColor, setBatchColor] = useState('')
  const [batchVersions, setBatchVersions] = useState([])
  const [batchPrice, setBatchPrice] = useState(0)
  const [batchDiscount, setBatchDiscount] = useState(0)
  const [batchStock, setBatchStock] = useState(0)
  const [batchThumbnail, setBatchThumbnail] = useState('')
  const [batchThumbnailFile, setBatchThumbnailFile] = useState(null)
  const [batchThumbnailPreview, setBatchThumbnailPreview] = useState('')
  const fileInputRefBatch = useRef(null)

  const addBatchVariants = () => {
    if (!batchColor || batchVersions.length === 0) return
    const newVariants = batchVersions.map(v => ({
      tempId: Date.now() + Math.random(),
      sku: '',
      price: batchPrice,
      discountPercentage: batchDiscount,
      stock: batchStock,
      thumbnail: batchThumbnailFile ? '' : (batchThumbnail || ''),
      thumbnailFile: batchThumbnailFile,
      thumbnailPreview: batchThumbnailPreview,
      attrValues: { 'Màu sắc': v, 'Phiên bản': batchColor },
      status: 'active',
    }))
    setVariants(prev => [...prev, ...newVariants])
    setBatchColor('')
    setBatchVersions([])
    setBatchPrice(0)
    setBatchDiscount(0)
    setBatchStock(0)
    setBatchThumbnail('')
    if (batchThumbnailPreview) URL.revokeObjectURL(batchThumbnailPreview)
    setBatchThumbnailFile(null)
    setBatchThumbnailPreview('')
  }

  const handleBatchThumbnailFile = (file) => {
    if (batchThumbnailPreview) URL.revokeObjectURL(batchThumbnailPreview)
    setBatchThumbnailFile(file)
    setBatchThumbnailPreview(URL.createObjectURL(file))
    setBatchThumbnail('')
  }

  useEffect(() => {
    if (!product) return
    form.setFieldsValue({
      title: product.title,
      product_category_id: product.product_category_id || undefined,
      status: product.status || 'active',
      featured: product.featured === '1',
      position: product.position,
      description: product.description,
    })
    if (product.variants?.length) {
      const colorSet = new Set()
      const versionSet = new Set()
      product.variants.forEach(v => {
        ;(v.options || []).forEach(o => {
          if (o.key === 'Màu sắc') colorSet.add(o.value)
          if (o.key === 'Phiên bản') versionSet.add(o.value)
        })
      })
      setAttrDefs([
        { name: 'Màu sắc', values: [...colorSet] },
        { name: 'Phiên bản', values: [...versionSet] },
      ])
      setVariants(product.variants.map(v => ({
        ...v,
        tempId: v.sku || Date.now() + Math.random(),
        thumbnailFile: null,
        thumbnailPreview: '',
        attrValues: Object.fromEntries((v.options || []).map(o => [o.key, o.value])),
      })))
    } else {
      setAttrDefs([
        { name: 'Màu sắc', values: [] },
        { name: 'Phiên bản', values: [] },
      ])
      setVariants([{
        tempId: Date.now() + Math.random(),
        sku: '',
        price: 0,
        discountPercentage: 0,
        stock: 0,
        thumbnail: '',
        thumbnailFile: null,
        thumbnailPreview: '',
        attrValues: {},
        status: 'active',
      }])
    }
  }, [product, form])

  const addAttrValue = (attrName, val) => {
    const v = val.trim()
    if (!v) return
    setAttrDefs(prev => prev.map(a =>
      a.name === attrName && !a.values.includes(v)
        ? { ...a, values: [...a.values, v] }
        : a
    ))
  }

  const removeAttrValue = (attrName, val) => {
    setAttrDefs(prev => prev.map(a =>
      a.name === attrName
        ? { ...a, values: a.values.filter(x => x !== val) }
        : a
    ))
  }

  const removeVariant = (tempId) => {
    setVariants(prev => prev.filter(v => v.tempId !== tempId))
  }

  const updateVariant = (tempId, field, value) => {
    setVariants(prev => prev.map(v => v.tempId === tempId ? { ...v, [field]: value } : v))
  }

  const updateVariantAttrValue = (tempId, attr, value) => {
    setVariants(prev => prev.map(v =>
      v.tempId === tempId
        ? { ...v, attrValues: { ...v.attrValues, [attr]: value } }
        : v
    ))
  }

  const handleThumbnailFile = (tempId, file) => {
    URL.revokeObjectURL(variants.find(v => v.tempId === tempId)?.thumbnailPreview || '')
    const previewUrl = URL.createObjectURL(file)
    setVariants(prev => prev.map(v =>
      v.tempId === tempId
        ? { ...v, thumbnailFile: file, thumbnailPreview: previewUrl, thumbnail: '' }
        : v
    ))
  }

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('status', values.status || 'active')
    formData.append('featured', values.featured ? '1' : '')
    formData.append('position', values.position || '')
    formData.append('product_category_id', values.product_category_id || '')
    formData.append('description', values.description || '')
    const processedVariants = variants.map(({ tempId: _tempId, ...rest }) => {
      const { thumbnailFile: _f, thumbnailPreview: _p, attrValues, ...restClean } = rest
      const options = Object.entries(attrValues || {}).map(([key, value]) => ({ key, value }))
      return {
        ...restClean,
        thumbnail: _f ? '' : (restClean.thumbnail || ''),
        options,
        label: Object.values(attrValues || {}).filter(Boolean).join(' '),
        sku: restClean.sku || `var-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      }
    })
    variants.forEach((v) => {
      if (v.thumbnailFile) {
        formData.append('variantThumbnail', v.thumbnailFile)
      }
    })
    formData.append('variants', JSON.stringify(processedVariants))
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

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={6} placeholder="Nhập mô tả sản phẩm (có thể dùng HTML)" />
        </Form.Item>

        <div style={{ marginBottom: 16 }} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}>
          <Text strong style={{ fontSize: 16 }}>Biến thể sản phẩm</Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
            Giá, giảm giá, tồn kho và hình ảnh được nhập trong từng biến thể.
            Ảnh biến thể đầu tiên sẽ làm ảnh đại diện sản phẩm.
          </Text>

          <div style={{ marginBottom: 12, padding: 12, background: '#fafafa', borderRadius: 6, border: '1px solid #f0f0f0' }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Định nghĩa giá trị biến thể</Text>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Màu sắc</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                {attrDefs[0].values.map(val => (
                  <Tag key={val} closable onClose={() => removeAttrValue('Màu sắc', val)} style={{ margin: 0 }}>{val}</Tag>
                ))}
                <Input
                  placeholder="Thêm màu..."
                  size="small"
                  style={{ width: 120 }}
                  value={newColor}
                  onChange={e => setNewColor(e.target.value)}
                  onPressEnter={() => { addAttrValue('Màu sắc', newColor); setNewColor('') }}
                />
              </div>
            </div>
            <div>
              <Text style={{ fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Phiên bản</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                {attrDefs[1].values.map(val => (
                  <Tag key={val} closable onClose={() => removeAttrValue('Phiên bản', val)} style={{ margin: 0 }}>{val}</Tag>
                ))}
                <Input
                  placeholder="Thêm phiên bản..."
                  size="small"
                  style={{ width: 140 }}
                  value={newVersion}
                  onChange={e => setNewVersion(e.target.value)}
                  onPressEnter={() => { addAttrValue('Phiên bản', newVersion); setNewVersion('') }}
                />
              </div>
            </div>
          </div>

          {attrDefs.length >= 2 && attrDefs[0].values.length > 0 && attrDefs[1].values.length > 0 && (
            <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6, border: '1px solid #f0f0f0' }}>
              <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Ma trận biến thể</Text>
              <div style={{ marginBottom: 8 }}>
                <Button size="small" onClick={selectAllMatrix} style={{ marginRight: 6 }}>Chọn tất cả</Button>
                <Button size="small" onClick={clearAllMatrix}>Bỏ chọn tất cả</Button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '4px 10px', border: '1px solid #d9d9d9', background: '#f0f0f0', textAlign: 'left' }}>{attrDefs[0].name}</th>
                      {attrDefs[1].values.map(c => (
                        <th key={c} style={{ padding: '4px 10px', border: '1px solid #d9d9d9', background: '#f0f0f0', textAlign: 'center', minWidth: 80 }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attrDefs[0].values.map(r => (
                      <tr key={r}>
                        <td style={{ padding: '4px 10px', border: '1px solid #d9d9d9', fontWeight: 500 }}>{r}</td>
                        {attrDefs[1].values.map(c => {
                          const key = `${r}|${c}`
                          return (
                            <td key={key} style={{ padding: '4px 10px', border: '1px solid #d9d9d9', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={!!matrixSelections[key]}
                                onChange={() => toggleMatrixCell(r, c)}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Giá chung</Text>
                  <InputNumber addonBefore="₫" min={0} value={matrixPrice} onChange={setMatrixPrice} style={{ width: 130 }} />
                </div>
                <div>
                  <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Giảm chung</Text>
                  <InputNumber min={0} max={100} value={matrixDiscount} onChange={setMatrixDiscount} addonAfter="%" style={{ width: 110 }} />
                </div>
                <div>
                  <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Tồn chung</Text>
                  <InputNumber min={0} value={matrixStock} onChange={setMatrixStock} style={{ width: 110 }} />
                </div>
                <div>
                  <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Ảnh chung</Text>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div
                      onClick={() => fileInputRefMatrix.current?.click()}
                      style={{
                        width: 50, height: 50, border: '1px dashed #d9d9d9', borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', background: '#fff', flexShrink: 0, overflow: 'hidden',
                      }}
                    >
                      {matrixThumbnailPreview ? (
                        <img src={matrixThumbnailPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <UploadOutlined style={{ fontSize: 16, color: '#999' }} />
                      )}
                    </div>
                    <input
                      ref={fileInputRefMatrix}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleMatrixThumbnailFile(f); e.target.value = '' }}
                    />
                    <Input
                      placeholder="Hoặc URL..."
                      value={matrixThumbnail}
                      onChange={e => { setMatrixThumbnail(e.target.value); setMatrixThumbnailFile(null) }}
                      style={{ width: 160 }}
                    />
                  </div>
                </div>
                <Button type="primary" onClick={generateFromMatrix} disabled={!Object.values(matrixSelections).some(Boolean)}>
                  Tạo {Object.values(matrixSelections).filter(Boolean).length} biến thể
                </Button>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6, border: '1px solid #f0f0f0' }}>
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Thêm biến thể theo phiên bản</Text>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Phiên bản</Text>
                <AutoComplete
                  value={batchColor}
                  onChange={setBatchColor}
                  options={attrDefs[1].values.map(v => ({ value: v }))}
                  placeholder="Chọn phiên bản..."
                  style={{ width: 130 }}
                  filterOption={(inputValue, option) =>
                    option.value.toLowerCase().includes(inputValue.toLowerCase())
                  }
                />
              </div>
              <div>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Màu sắc</Text>
                <Select
                  mode="multiple"
                  value={batchVersions}
                  onChange={setBatchVersions}
                  placeholder="Chọn màu sắc..."
                  style={{ minWidth: 200 }}
                  options={attrDefs[0].values.map(v => ({ value: v, label: v }))}
                />
              </div>
              <div>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Giá</Text>
                <InputNumber addonBefore="₫" min={0} value={batchPrice} onChange={setBatchPrice} style={{ width: 120 }} />
              </div>
              <div>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Giảm</Text>
                <InputNumber min={0} max={100} value={batchDiscount} onChange={setBatchDiscount} addonAfter="%" style={{ width: 100 }} />
              </div>
              <div>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Tồn</Text>
                <InputNumber min={0} value={batchStock} onChange={setBatchStock} style={{ width: 100 }} />
              </div>
              <div>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Ảnh</Text>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <div
                    onClick={() => fileInputRefBatch.current?.click()}
                    style={{
                      width: 50, height: 50, border: '1px dashed #d9d9d9', borderRadius: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', background: '#fff', flexShrink: 0, overflow: 'hidden',
                    }}
                  >
                    {batchThumbnailPreview ? (
                      <img src={batchThumbnailPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UploadOutlined style={{ fontSize: 16, color: '#999' }} />
                    )}
                  </div>
                  <input
                    ref={fileInputRefBatch}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleBatchThumbnailFile(f); e.target.value = '' }}
                  />
                  <Input
                    placeholder="URL..."
                    value={batchThumbnail}
                    onChange={e => { setBatchThumbnail(e.target.value); setBatchThumbnailFile(null) }}
                    style={{ width: 120 }}
                  />
                </div>
              </div>
              <Button type="primary" onClick={addBatchVariants} disabled={!batchColor || batchVersions.length === 0}>
                Thêm {batchVersions.length || ''} biến thể
              </Button>
            </div>
          </div>
          {variants.map((v, idx) => (
            <div key={v.tempId} style={{ border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, marginBottom: 12, position: 'relative' }}>
              <Text type="secondary" style={{ fontSize: 12, position: 'absolute', top: 6, left: 12 }}>
                Biến thể {idx + 1}{idx === 0 ? ' (ảnh đại diện)' : ''}
              </Text>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeVariant(v.tempId)}
                style={{ position: 'absolute', top: 4, right: 4 }}
              />
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>SKU</Text>
                    <Input
                      placeholder="Để trống tự sinh"
                      value={v.sku}
                      onChange={e => updateVariant(v.tempId, 'sku', e.target.value)}
                      style={{ width: 180 }}
                    />
                  </div>
                  {/* label auto-generated from attrValues */}
                  {attrDefs.map(def => (
                    <div key={def.name}>
                      <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>{def.name}</Text>
                      <AutoComplete
                        value={v.attrValues[def.name] || ''}
                        onChange={val => updateVariantAttrValue(v.tempId, def.name, val)}
                        options={def.values.map(val => ({ value: val }))}
                        placeholder={`Chọn/nhập ${def.name.toLowerCase()}`}
                        style={{ width: 140 }}
                        filterOption={(inputValue, option) =>
                          option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Giá</Text>
                    <InputNumber
                      placeholder="0"
                      min={0}
                      value={v.price}
                      onChange={val => updateVariant(v.tempId, 'price', val || 0)}
                      addonBefore="₫"
                      style={{ width: 150 }}
                    />
                  </div>
                  <div>
                    <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Giảm giá</Text>
                    <InputNumber
                      placeholder="0"
                      min={0}
                      max={100}
                      value={v.discountPercentage}
                      onChange={val => updateVariant(v.tempId, 'discountPercentage', val || 0)}
                      addonAfter="%"
                      style={{ width: 120 }}
                    />
                  </div>
                  <div>
                    <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Tồn kho</Text>
                    <InputNumber
                      placeholder="0"
                      min={0}
                      value={v.stock}
                      onChange={val => updateVariant(v.tempId, 'stock', val || 0)}
                      style={{ width: 120 }}
                    />
                  </div>
                  <div>
                    <Text style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>Ảnh</Text>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div
                        onClick={() => fileInputRefs.current[v.tempId]?.click()}
                        style={{
                          width: 60, height: 60, border: '1px dashed #d9d9d9', borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', background: '#fafafa', flexShrink: 0, overflow: 'hidden',
                        }}
                      >
                        {v.thumbnailPreview ? (
                          <img src={v.thumbnailPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : v.thumbnail ? (
                          <img src={v.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <UploadOutlined style={{ fontSize: 18, color: '#999' }} />
                        )}
                      </div>
                      <input
                        ref={el => fileInputRefs.current[v.tempId] = el}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleThumbnailFile(v.tempId, file)
                          e.target.value = ''
                        }}
                      />
                      <Input
                        placeholder="Hoặc nhập URL..."
                        value={v.thumbnail}
                        onChange={e => updateVariant(v.tempId, 'thumbnail', e.target.value)}
                        style={{ width: 180 }}
                      />
                    </div>
                  </div>
                </div>
              </Space>
            </div>
          ))}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Cập nhật sản phẩm</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditProduct
