import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    MenuItem,
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import {
    fetchMyOrders,
    fetchOrderById,
    updateOrderStatus,
    confirmCashPayment,
    deleteOrder,
    Order,
    OrderStatus
} from 'src/store/orders/ordersSlice'

/* ================== Helpers ================== */

const statusColor = (status: OrderStatus) => {
    switch (status) {
        case 'pending':
            return 'warning'
        case 'processing':
            return 'info'
        case 'completed':
            return 'success'
        case 'cancelled':
            return 'error'
        default:
            return 'default'
    }
}

/* ================== Component ================== */

const OrdersPageComplete = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { orders, selectedOrder, loading } = useSelector(
        (state: RootState) => state.orders
    )

    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
    const [page, setPage] = useState(1)
    const rowsPerPage = 8

    const [detailsOpen, setDetailsOpen] = useState(false)

    /* ================== Fetch Orders ================== */
    useEffect(() => {
        dispatch(fetchMyOrders())
    }, [dispatch])

    /* ================== Filters ================== */

    const filteredOrders =
        statusFilter === 'all'
            ? orders
            : orders.filter(o => o.status === statusFilter)

    const paginatedOrders = filteredOrders.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    )

    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage)

    /* ================== Handlers ================== */

    const openDetails = (orderId: string) => {
        dispatch(fetchOrderById(orderId))
        setDetailsOpen(true)
    }

    const closeDetails = () => {
        setDetailsOpen(false)
    }

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        dispatch(updateOrderStatus({ orderId, status }))
    }

    const handleCashConfirm = (orderId: string) => {
        dispatch(confirmCashPayment(orderId))
    }

    const handleDelete = (orderId: string) => {
        if (confirm('هل أنت متأكد من حذف الطلب؟')) {
            dispatch(deleteOrder({ orderId }))
        }
    }

    /* ================== UI ================== */

    return (
        <Card>
            <CardContent>
                <Box display='flex' justifyContent='space-between' mb={4}>
                    <Typography variant='h6'>إدارة الطلبات</Typography>

                    <TextField
                        select
                        size='small'
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                    >
                        <MenuItem value='all'>كل الحالات</MenuItem>
                        <MenuItem value='pending'>قيد الانتظار</MenuItem>
                        <MenuItem value='processing'>قيد المعالجة</MenuItem>
                        <MenuItem value='completed'>مكتمل</MenuItem>
                        <MenuItem value='cancelled'>ملغي</MenuItem>
                    </TextField>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>رقم الطلب</TableCell>
                            <TableCell>السعر الكلي</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>الدفع</TableCell>
                            <TableCell>التاريخ</TableCell>
                            <TableCell align='center'>إجراءات</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedOrders.map(order => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id.slice(-6)}</TableCell>
                                <TableCell>{order.totalPrice} جنيه</TableCell>

                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        color={statusColor(order.status)}
                                        size='small'
                                    />
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={order.paymentStatus}
                                        color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                                        size='small'
                                    />
                                </TableCell>

                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell align='center'>
                                    <IconButton onClick={() => openDetails(order._id)}>
                                        <Icon icon='mdi:eye' />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => handleCashConfirm(order._id)}
                                        disabled={order.paymentStatus === 'paid'}
                                    >
                                        <Icon icon='mdi:cash-check' />
                                    </IconButton>

                                    <IconButton onClick={() => handleDelete(order._id)}>
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

            {/* ================== Order Details ================== */}
            <Dialog open={detailsOpen} onClose={closeDetails} fullWidth maxWidth='md'>
                <DialogTitle>تفاصيل الطلب</DialogTitle>

                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography mb={2}>
                                العنوان: {selectedOrder.address.city} -{' '}
                                {selectedOrder.address.street}
                            </Typography>

                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>المنتج</TableCell>
                                        <TableCell>المقاس</TableCell>
                                        <TableCell>الكمية</TableCell>
                                        <TableCell>السعر</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {selectedOrder.items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell>{item.size}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Box mt={3}>
                                <Typography fontWeight='bold'>
                                    الإجمالي: {selectedOrder.totalPrice} جنيه
                                </Typography>
                            </Box>

                            <Box mt={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label='تغيير حالة الطلب'
                                    value={selectedOrder.status}
                                    onChange={e =>
                                        handleStatusChange(
                                            selectedOrder._id,
                                            e.target.value as OrderStatus
                                        )
                                    }
                                >
                                    <MenuItem value='pending'>قيد الانتظار</MenuItem>
                                    <MenuItem value='processing'>قيد المعالجة</MenuItem>
                                    <MenuItem value='completed'>مكتمل</MenuItem>
                                    <MenuItem value='cancelled'>ملغي</MenuItem>
                                </TextField>
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeDetails}>إغلاق</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default OrdersPageComplete
