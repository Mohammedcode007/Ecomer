import { useEffect, useMemo, useState } from 'react'
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
  Stack,
  MenuItem,
  Pagination,
  Typography,
  Chip
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category
} from 'src/store/categories/categoriesSlice'

/* ================== Types ================== */

interface CategoryForm {
  name: string
  description?: string
  parent: string | null
}

interface FlatCategory extends Category {
  level: number
}

/* ================== Helpers ================== */

const flattenCategories = (
  categories: Category[],
  level = 0
): FlatCategory[] => {
  let result: FlatCategory[] = []

  categories.forEach(cat => {
    result.push({ ...cat, level })

    if (cat.subCategories && cat.subCategories.length > 0) {
      result = result.concat(
        flattenCategories(cat.subCategories, level + 1)
      )
    }
  })

  return result
}

/* ================== Initial Form ================== */

const emptyForm: CategoryForm = {
  name: '',
  description: '',
  parent: null
}

/* ================== Component ================== */

const CategoriesPageComplete = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { categories, loading } = useSelector(
    (state: RootState) => state.categories
  )

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)

  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  /* ================== Fetch ================== */

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  /* ================== Data ================== */

  const flatCategories = useMemo(
    () => flattenCategories(categories),
    [categories]
  )

  const paginatedCategories = flatCategories.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  const totalPages = Math.ceil(flatCategories.length / rowsPerPage)

  /* ================== Handlers ================== */

  const openAddModal = () => {
    setForm(emptyForm)
    setIsEdit(false)
    setSelectedId(null)
    setOpen(true)
  }

  const openEditModal = (category: Category) => {
    setForm({
      name: category.name,
      description: category.description ?? '',
      parent: category.parent ?? null
    })
    setSelectedId(category._id)
    setIsEdit(true)
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setForm(emptyForm)
    setSelectedId(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return

    const payload = {
      name: form.name.trim(),
      description: form.description || undefined,
      parent: form.parent
    }

    if (isEdit && selectedId) {
      dispatch(updateCategory({ categoryId: selectedId, ...payload }))
    } else {
      dispatch(createCategory(payload))
    }

    closeModal()
  }

  const handleDelete = (category: Category) => {
    if (category.productsCount && category.productsCount > 0) {
      alert('لا يمكن حذف فئة تحتوي على منتجات')
      return
    }

    dispatch(deleteCategory({ categoryId: category._id }))
  }

  /* ================== UI ================== */

  return (
    <Card>
      <CardContent>
        <Box display='flex' justifyContent='space-between' mb={4}>
          <Typography variant='h6'>إدارة الفئات</Typography>
          <Button variant='contained' onClick={openAddModal}>
            إضافة فئة
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الاسم</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>النوع</TableCell>
              <TableCell>المنتجات</TableCell>
              <TableCell align='center'>إجراءات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedCategories.map(category => (
              <TableRow key={category._id}>
                <TableCell>
                  <Box display='flex' alignItems='center'>
                    <Box width={category.level * 24} />
                    {category.level > 0 && (
                      <Typography color='text.secondary' mr={1}>
                        └
                      </Typography>
                    )}
                    <Typography
                      fontWeight={category.level === 0 ? 600 : 400}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{category.description || '-'}</TableCell>

                <TableCell>
                  <Chip
                    size='small'
                    label={category.level === 0 ? 'رئيسية' : 'فرعية'}
                    color={category.level === 0 ? 'primary' : 'default'}
                  />
                </TableCell>

                <TableCell>{category.productsCount ?? 0}</TableCell>

                <TableCell align='center'>
                  <IconButton onClick={() => openEditModal(category)}>
                    <Icon icon='mdi:pencil' />
                  </IconButton>

                  <IconButton
                    disabled={(category.productsCount ?? 0) > 0}
                    onClick={() => handleDelete(category)}
                  >
                    <Icon icon='mdi:delete' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack mt={3} alignItems='center'>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color='primary'
          />
        </Stack>
      </CardContent>

      {/* ================== MODAL ================== */}

      <Dialog open={open} onClose={closeModal} fullWidth maxWidth='sm'>
        <DialogTitle>{isEdit ? 'تعديل فئة' : 'إضافة فئة'}</DialogTitle>

        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label='اسم الفئة'
              name='name'
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label='الوصف'
              name='description'
              value={form.description ?? ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              select
              label='فئة رئيسية (اختياري)'
              value={form.parent ?? ''}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  parent: e.target.value || null
                }))
              }
            >
              <MenuItem value=''>بدون (فئة رئيسية)</MenuItem>

              {flatCategories
                .filter(c => c.level === 0 && c._id !== selectedId)
                .map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
            </TextField>
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
    </Card>
  )
}

export default CategoriesPageComplete
