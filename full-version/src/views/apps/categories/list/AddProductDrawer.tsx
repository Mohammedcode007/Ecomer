import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { createProduct } from 'src/store/products/productsSlice'
import { useState } from 'react'
import type { AppDispatch } from 'src/store'

const AddProductDrawer = ({ open, toggle }: any) => {
  const dispatch = useDispatch<AppDispatch>()

  const [form, setForm] = useState({
    name: '',
    price: 0,
    description: ''
  })

  const handleSubmit = () => {
    dispatch(createProduct(form))
    toggle()
  }

  return (
    <Drawer open={open} anchor='right' onClose={toggle}>
      <Box sx={{ width: 400, p: 6 }}>
        <Typography variant='h6' mb={4}>
          إضافة منتج
        </Typography>

        <TextField
          fullWidth
          label='اسم المنتج'
          sx={{ mb: 4 }}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          fullWidth
          label='السعر'
          type='number'
          sx={{ mb: 4 }}
          value={form.price}
          onChange={e => setForm({ ...form, price: Number(e.target.value) })}
        />

        <TextField
          fullWidth
          label='الوصف'
          multiline
          rows={3}
          sx={{ mb: 4 }}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <Button fullWidth variant='contained' onClick={handleSubmit}>
          حفظ
        </Button>
      </Box>
    </Drawer>
  )
}

export default AddProductDrawer
