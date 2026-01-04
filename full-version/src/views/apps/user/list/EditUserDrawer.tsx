// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { createUser } from 'src/store/users/usersSlice'
import { updateUser } from 'src/store/users/usersSlice'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  user: UsersType | null

}

interface UserData {
  email: string
  phone: string
  name: string

}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  phone: yup
    .string()
    .required('رقم الهاتف مطلوب')
    .matches(
      /^01[0-2,5]\d{8}$/,
      'رقم الهاتف غير صالح'
    ),

  name: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),

})

const defaultValues = {
  email: '',
  phone: '',
  name: '',

}

const EditUserDrawer = (props: SidebarAddUserType) => {
  const { open, toggle, user } = props

  const [plan, setPlan] = useState<string>('basic')
  const [role, setRole] = useState<string>('subscriber')
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UserData>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
      setRole(user.role)
    }
  }, [user, reset])

  const onSubmit = async (data: UserData) => {
    if (!user) return

    setLoading(true)
    setErrorMsg(null)

    try {
      await dispatch(
        updateUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role
        })
      ).unwrap()

      reset()
      toggle() // إغلاق Drawer بعد النجاح
    } catch (error: any) {
      setErrorMsg(error || 'حدث خطأ أثناء تعديل المستخدم')
    } finally {
      setLoading(false)
    }
  }


  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    reset()
    setErrorMsg(null)
    toggle()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Add User</Typography>
        <IconButton size='small' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>

      <Box sx={{ p: 6 }}>
        {errorMsg && (
          <Typography color='error' sx={{ mb: 2 }}>
            {errorMsg}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                label='Full Name'
                sx={{ mb: 4 }}
                {...field}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                sx={{ mb: 4 }}
                {...field}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                label='Phone'
                sx={{ mb: 4 }}
                {...field}
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
              />
            )}
          />

          <CustomTextField
            select
            fullWidth
            value={role}
            sx={{ mb: 4 }}
            label='Select Role'
            onChange={e => setRole(e.target.value)}
          >
            <MenuItem value='user'>user</MenuItem>
            <MenuItem value='admin'>admin</MenuItem>
            <MenuItem value='owner'>owner</MenuItem>
          </CustomTextField>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' disabled={loading} sx={{ mr: 3 }}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}



export default EditUserDrawer
