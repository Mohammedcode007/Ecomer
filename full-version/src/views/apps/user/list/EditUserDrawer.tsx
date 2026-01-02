import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { updateUser } from 'src/store/users/usersSlice'

interface Props {
  open: boolean
  toggle: () => void
  userData: any | null
}

interface UserForm {
  name: string
  email: string
  phone: string
  password: string
}

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  password: yup.string().min(6)
})

const EditUserDrawer = ({ open, toggle, userData }: Props) => {
  const dispatch = useDispatch()
  const { control, handleSubmit, reset } = useForm<UserForm>({
    defaultValues: { name: '', email: '', phone: '', password: '' },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: ''
      })
    }
  }, [userData, reset])

  const onSubmit = (data: UserForm) => {
    dispatch(updateUser({ id: userData.id, data }))
    toggle()
  }

  return (
    <Drawer open={open} anchor='right' onClose={toggle}>
      <Box sx={{ width: 400, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant='h5'>Edit User</Typography>
          <IconButton onClick={toggle}>
            <Icon icon='tabler:x' />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => <CustomTextField fullWidth label='Name' sx={{ mb: 4 }} {...field} />}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => <CustomTextField fullWidth label='Email' sx={{ mb: 4 }} {...field} />}
          />
          <Controller
            name='phone'
            control={control}
            render={({ field }) => <CustomTextField fullWidth label='Phone' sx={{ mb: 4 }} {...field} />}
          />
          <Controller
            name='password'
            control={control}
            render={({ field }) => <CustomTextField fullWidth label='Password' type='password' sx={{ mb: 4 }} {...field} />}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='submit' variant='contained' sx={{ mr: 2 }}>
              Save
            </Button>
            <Button variant='outlined' onClick={toggle}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default EditUserDrawer
