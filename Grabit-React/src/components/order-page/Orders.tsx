"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import TrackViewModal from "../model/TrackViewModal";
import { Col, Row } from "react-bootstrap";
import Link from "next/link";
import { fetchMyOrders, Order, OrderItem } from "@/store/reducers/orders/ordersSlice";
import { useAppDispatch } from "@/store/hooks";
import { FaCheckCircle, FaHourglassHalf, FaEye, FaBox, FaTruck, FaTimesCircle } from "react-icons/fa";
interface OrderDetails {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "inway" | "completed" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid";
  address: {
    city: string;
    street: string;
    phone: string;
  };
  createdAt: string;
}
interface TrackViewModalProps {
  handleClose: () => void;
  show: boolean;
  currentDate: string;
  order?: OrderDetails | null;
}

const OrderPage = () => {
  const dispatch = useAppDispatch();
  const { orders } = useSelector((state: RootState) => state.orders);

  const [show, setShow] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString("en-GB"));

  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);
  // State لـ Order
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // عند الضغط على عرض الطلب
  const handleShow = (order: Order) => {
    console.log("Selected Order:", order);
    setSelectedOrder(order);
    setShow(true);
  };




  const handleClose = () => setShow(false);

const pendingOrders = orders.filter(
  (o) => o.status === "pending" || o.status === "processing" || o.status === "inway" || o.status ===  "cancelled"
);
  const completedOrders = orders.filter((o) => o.status === "completed");

  const paginatedPendingOrders = pendingOrders.slice(
    (pendingPage - 1) * itemsPerPage,
    pendingPage * itemsPerPage
  );
  const paginatedCompletedOrders = completedOrders.slice(
    (completedPage - 1) * itemsPerPage,
    completedPage * itemsPerPage
  );

  const totalPendingPages = Math.ceil(pendingOrders.length / itemsPerPage);
  const totalCompletedPages = Math.ceil(completedOrders.length / itemsPerPage);

  // Function to color code status
 const renderStatus = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <span style={{ color: "#f39c12", fontWeight: 600 }}>
          <FaHourglassHalf /> Pending
        </span>
      );
    case "processing":
      return (
        <span style={{ color: "#3498db", fontWeight: 600 }}>
          <FaBox /> Processing
        </span>
      );
    case "inway":
      return (
        <span style={{ color: "#8e44ad", fontWeight: 600 }}>
          <FaTruck /> In Way
        </span>
      );
    case "completed":
      return (
        <span style={{ color: "#27ae60", fontWeight: 600 }}>
          <FaCheckCircle /> Completed
        </span>
      );
    case "cancelled":
      return (
        <span style={{ color: "#e74c3c", fontWeight: 600 }}>
          <FaTimesCircle /> Cancelled
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};


  return (
    <>
      <section className="gi-faq padding-tb-40 gi-wishlist">
        <div className="container">
          <div className="section-title-2 text-center mb-4">
            <h2 className="gi-title">Product <span>Order List</span></h2>
            <p>Your product order is our first priority.</p>
          </div>

          {/* Pending Orders */}
          <Row>
            <Col md={12}>
              <div className="gi-vendor-dashboard-card shadow-sm rounded">
                <div className="gi-vendor-card-header d-flex justify-content-between align-items-center bg-light p-3 rounded-top">
                  <h5 className="mb-0 text-warning">Pending Orders</h5>
                  <Link className="gi-btn-2 btn btn-primary" href="/shop-left-sidebar-col-3">
                    Shop Now
                  </Link>
                </div>
                <div className="gi-vendor-card-body p-3">
                  <div className="gi-vendor-card-table table-responsive">
                    <table className="table table-striped align-middle text-center">
                      <thead className="table-dark">
                        <tr>
                          <th>Order ID</th>
                          <th>Shipping</th>
                          <th>Quantity</th>
                          <th>Date</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPendingOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center text-muted">
                              No orders found
                            </td>
                          </tr>
                        ) : (
                          paginatedPendingOrders.map((order) => (
                            <tr key={order._id} className="align-middle">
                              <td className="fw-bold">{order._id.slice(-6)}</td>
                              <td>{order.address.city}</td>
                              <td>{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                              <td>${order.totalPrice}</td>
                              <td>{renderStatus(order.status)}</td>
                              <td>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleShow(order)}
                                >
                                  <FaEye /> View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPendingPages > 1 && (
                      <div className="d-flex justify-content-center gap-2 mt-3">
                        {Array.from({ length: totalPendingPages }, (_, i) => (
                          <button
                            key={i}
                            className={`btn btn-sm ${pendingPage === i + 1 ? "btn-primary" : "btn-outline-secondary"}`}
                            onClick={() => setPendingPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Completed Orders */}
          <Row className="mt-5">
            <Col md={12}>
              <div className="gi-vendor-dashboard-card shadow-sm rounded">
                <div className="gi-vendor-card-header bg-light p-3 rounded-top">
                  <h5 className="mb-0 text-success">Completed Orders</h5>
                </div>
                <div className="gi-vendor-card-body p-3">
                  <div className="gi-vendor-card-table table-responsive">
                    <table className="table table-striped align-middle text-center">
                      <thead className="table-dark">
                        <tr>
                          <th>Order ID</th>
                          <th>Shipping</th>
                          <th>Quantity</th>
                          <th>Date</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCompletedOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center text-muted">
                              No orders found
                            </td>
                          </tr>
                        ) : (
                          paginatedCompletedOrders.map((order) => (
                            <tr key={order._id} className="align-middle">
                              <td className="fw-bold">{order._id.slice(-6)}</td>
                              <td>{order.address.city}</td>
                              <td>{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString("en-GB")}</td>
                              <td>${order.totalPrice}</td>
                              <td>{renderStatus(order.status)}</td>
                              <td>
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => handleShow(order)}
                                >
                                  <FaEye /> View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {totalCompletedPages > 1 && (
                      <div className="d-flex justify-content-center gap-2 mt-3">
                        {Array.from({ length: totalCompletedPages }, (_, i) => (
                          <button
                            key={i}
                            className={`btn btn-sm ${completedPage === i + 1 ? "btn-success" : "btn-outline-secondary"}`}
                            onClick={() => setCompletedPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <TrackViewModal
        currentDate={currentDate}
        handleClose={handleClose}
        show={show}
        order={selectedOrder}
      />

    </>
  );
};

export default OrderPage;
