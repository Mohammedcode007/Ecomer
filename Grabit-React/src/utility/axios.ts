import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // عدل حسب السيرفر
  headers: {
    'Content-Type': 'application/json'
  }
})

// إضافة التوكن تلقائيًا إن وجد
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
