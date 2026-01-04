import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Stack,
  MenuItem,
  Chip,
  Pagination,
  Grid
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductSize,
  Category
} from 'src/store/products/productsSlice'
import axios from 'src/utils/axios'

/* ================== Form State ================== */

const emptyForm: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  priceBeforeDiscount: 0,
  hasDiscount: false,
  colors: [],
  images: [],
  sizes: [],
  stockQuantity: 0,
  category: undefined
}

const ProductsPageComplete = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, loading, page, totalPages } = useSelector(
    (state: RootState) => state.products
  )

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Product>>(emptyForm)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [imageInput, setImageInput] = useState('')

  /* ================== Fetch categories ================== */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get('/categories')
      setCategories(res.data)
    }
    fetchCategories()
  }, [])

  /* ================== Fetch products ================== */
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10, search }))
  }, [dispatch, search])

  /* ================== Handlers ================== */

  const openAddModal = () => {
    setForm(emptyForm)
    setIsEdit(false)
    setOpen(true)
  }



  const closeModal = () => {
    setOpen(false)
    setSelectedId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement // حددنا النوع صراحة
    const { name, value, type, checked } = target

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }


  const handleAddColor = (color: string) => {
    if (!color) return
    setForm(prev => ({
      ...prev,
      colors: [...(prev.colors || []), color]
    }))
  }

  const handleRemoveColor = (color: string) => {
    setForm(prev => ({
      ...prev,
      colors: (prev.colors || []).filter(c => c !== color)
    }))
  }

  const handleAddSize = () => {
    setForm(prev => ({
      ...prev,
      sizes: [...(prev.sizes || []), { size: '', stock: 0 }]
    }))
  }
  const openEditModal = (product: Product) => {
    setForm(product)
    setSelectedId(product._id)
    setIsEdit(true)
    setOpen(true)
    setImageInput((product.images || []).join(', '))
  }


  const handleSizeChange = (index: number, field: 'size' | 'stock', value: string | number) => {
    setForm(prev => {
      const newSizes = [...(prev.sizes || [])]
      newSizes[index] = { ...newSizes[index], [field]: value }
      return { ...prev, sizes: newSizes }
    })
  }

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id))
  }

  const handleSubmit = () => {
    if (isEdit && selectedId) {
      dispatch(updateProduct({ id: selectedId, data: form }))
    } else {
      dispatch(createProduct(form))
    }
    closeModal()
  }

  /* ================== Update stockQuantity automatically ================== */
  useEffect(() => {
    const totalStock = form.sizes?.reduce((acc, s) => acc + (s.stock || 0), 0) || 0
    setForm(prev => ({ ...prev, stockQuantity: totalStock }))
  }, [form.sizes])

  /* ================== UI ================== */
  const [openImages, setOpenImages] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  // فتح مودال الصور
  const handleOpenImages = (images: string[]) => {
    setSelectedImages(images)
    setOpenImages(true)
  }

  const handleCloseImages = () => {
    setOpenImages(false)
    setSelectedImages([])
  }
  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' mb={4}>
          <TextField
            placeholder='بحث عن منتج...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            size='small'
          />
          <Button variant='contained' onClick={openAddModal}>
            إضافة منتج
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الصور</TableCell>

              <TableCell>الاسم</TableCell>
              <TableCell>السعر</TableCell>
              <TableCell>السعر قبل الخصم</TableCell>
              <TableCell>الخصم</TableCell>
              <TableCell>المخزون</TableCell>
              <TableCell>الألوان</TableCell>
              <TableCell>الفئة</TableCell>
              <TableCell align='center'>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow key={product._id}>
                <TableCell align='left'>

                  {product.images?.length > 0 && (
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => handleOpenImages(product.images)}
                      sx={{ ml: 1 }}
                    >
                      عرض الصور
                    </Button>
                  )}
                </TableCell>

                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.priceBeforeDiscount || '-'}</TableCell>
                <TableCell>{product.hasDiscount ? 'نعم' : 'لا'}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  {(product.colors || []).map(color => (
                    <Chip key={color} label={color} size='small' sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>{product.category?.name || '-'}</TableCell>
                <TableCell align='center'>
                  <IconButton onClick={() => openEditModal(product)}>
                    <Icon icon='mdi:pencil' />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product._id)}>
                    <Icon icon='mdi:delete' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack spacing={2} mt={3} alignItems='center'>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => {
              dispatch(fetchProducts({ page: value, limit: 10, search }))
            }}
            color='primary'
            showFirstButton
            showLastButton
          />
        </Stack>
      </CardContent>

      {/* ================== MODAL ================== */}
      <Dialog open={open} onClose={closeModal} fullWidth maxWidth='md'>
        <DialogTitle>{isEdit ? 'تعديل منتج' : 'إضافة منتج'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label='اسم المنتج'
              name='name'
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label='الوصف'
              name='description'
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label='السعر'
              name='price'
              type='number'
              value={form.price}
              onChange={handleChange}
              fullWidth
            />
            <Box display='flex' alignItems='center'>
              <Checkbox
                checked={Boolean(form.hasDiscount)}
                name='hasDiscount'
                onChange={handleChange}
              />
              يوجد خصم
            </Box>
            {form.hasDiscount && (
              <TextField
                label='السعر قبل الخصم'
                name='priceBeforeDiscount'
                type='number'
                value={form.priceBeforeDiscount}
                onChange={handleChange}
                fullWidth
              />
            )}

            {/* Category */}
            <TextField
              select
              label='الفئة'
              name='category'
              value={form.category?._id || ''}
              onChange={e => {
                const cat = categories.find(c => c._id === e.target.value)
                setForm(prev => ({ ...prev, category: cat }))
              }}
            >
              {categories.map(cat => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Colors */}
            <Box>
              <TextField
                label='إضافة لون'
                size='small'
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const input = e.currentTarget as HTMLInputElement  // حددنا النوع صراحة
                    handleAddColor(input.value)
                    input.value = ''
                  }
                }}
              />

              <Box mt={1}>
                {(form.colors || []).map(color => (
                  <Chip
                    key={color}
                    label={color}
                    size='small'
                    onDelete={() => handleRemoveColor(color)}
                    sx={{ mr: 0.5 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Sizes */}
            <Box>
              <Button onClick={handleAddSize} size='small'>
                إضافة مقاس
              </Button>
              <Stack spacing={2} mt={1}>
                {(form.sizes || []).map((s, idx) => (
                  <Box key={idx} display='flex' gap={1}>
                    <TextField
                      label='المقاس'
                      size='small'
                      value={s.size}
                      onChange={e => handleSizeChange(idx, 'size', e.target.value)}
                    />
                    <TextField
                      label='الكمية'
                      size='small'
                      type='number'
                      value={s.stock}
                      onChange={e => handleSizeChange(idx, 'stock', Number(e.target.value))}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
            <Dialog open={open} onClose={closeModal} fullWidth maxWidth='md'>
              <DialogTitle>{isEdit ? 'تعديل منتج' : 'إضافة منتج'}</DialogTitle>
              <DialogContent>
                <Stack spacing={3} mt={1}>
                  {/* اسم المنتج */}
                  <TextField
                    label='اسم المنتج'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                  />

                  {/* الوصف */}
                  <TextField
                    label='الوصف'
                    name='description'
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                  />

                  {/* السعر */}
                  <TextField
                    label='السعر'
                    name='price'
                    type='number'
                    value={form.price}
                    onChange={handleChange}
                    fullWidth
                  />

                  {/* الخصم */}
                  <Box display='flex' alignItems='center'>
                    <Checkbox
                      checked={Boolean(form.hasDiscount)}
                      name='hasDiscount'
                      onChange={handleChange}
                    />
                    يوجد خصم
                  </Box>
                  {form.hasDiscount && (
                    <TextField
                      label='السعر قبل الخصم'
                      name='priceBeforeDiscount'
                      type='number'
                      value={form.priceBeforeDiscount}
                      onChange={handleChange}
                      fullWidth
                    />
                  )}

                  {/* الفئة */}
                  <TextField
                    select
                    label='الفئة'
                    name='category'
                    value={form.category?._id || ''}
                    onChange={e => {
                      const cat = categories.find(c => c._id === e.target.value)
                      setForm(prev => ({ ...prev, category: cat }))
                    }}
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* الألوان */}
                  <Box>
                    <TextField
                      label='إضافة لون'
                      size='small'
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.currentTarget as HTMLInputElement
                          handleAddColor(input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <Box mt={1}>
                      {(form.colors || []).map(color => (
                        <Chip
                          key={color}
                          label={color}
                          size='small'
                          onDelete={() => handleRemoveColor(color)}
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* المقاسات */}
                  <Box>
                    <Button onClick={handleAddSize} size='small'>
                      إضافة مقاس
                    </Button>
                    <Stack spacing={2} mt={1}>
                      {(form.sizes || []).map((s, idx) => (
                        <Box key={idx} display='flex' gap={1}>
                          <TextField
                            label='المقاس'
                            size='small'
                            value={s.size}
                            onChange={e => handleSizeChange(idx, 'size', e.target.value)}
                          />
                          <TextField
                            label='الكمية'
                            size='small'
                            type='number'
                            value={s.stock}
                            onChange={e => handleSizeChange(idx, 'stock', Number(e.target.value))}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* روابط الصور */}
                  <Box>
                    <TextField
                      label='إضافة رابط/روابط الصور مفصولة بفاصلة ,'
                      size='small'
                      fullWidth
                      placeholder='https://example.com/image1.jpg, https://example.com/image2.jpg'
                      value={imageInput} // ربطه بحالة imageInput
                      onChange={e => setImageInput(e.target.value)}
                      onBlur={() => {
                        // تحديث form.images عند الخروج من الحقل
                        const links = imageInput.split(',').map(link => link.trim()).filter(link => link)
                        setForm(prev => ({ ...prev, images: links }))
                      }}
                    />
                    {form.images && form.images.length > 0 && (
                      <Box mt={1} display='flex' flexWrap='wrap' gap={0.5}>
                        {form.images.map((img, idx) => (
                          <Chip
                            key={idx}
                            label={img}
                            size='small'
                            onDelete={() =>
                              setForm(prev => ({
                                ...prev,
                                images: (prev.images || []).filter((_, i) => i !== idx)
                              }))
                            }
                            sx={{ maxWidth: '200px' }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeModal}>إلغاء</Button>
                <Button
                  variant='contained'
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {isEdit ? 'حفظ التعديل' : 'إضافة'}
                </Button>
              </DialogActions>
            </Dialog>


          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>إلغاء</Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={loading}
          >
            {isEdit ? 'حفظ التعديل' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openImages} onClose={handleCloseImages} maxWidth='md' fullWidth>
        <DialogTitle>صور المنتج</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedImages.map((img, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box
                  component='img'
                  src={img}
                  alt={`صورة ${idx + 1}`}
                  sx={{
                    width: '100%',
                    height: 150,
                    objectFit: 'cover',
                    borderRadius: 1,
                    boxShadow: 1
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ProductsPageComplete
