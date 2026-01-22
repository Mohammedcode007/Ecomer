// import React from "react";
// import { Col, Row } from "react-bootstrap";
// import Modal from "react-bootstrap/Modal";

// const TrackViewModal = ({ handleClose, show, currentDate }) => {
//   return (
//     <>
//       <Modal
//         centered
//         show={show}
//         onHide={handleClose}
//         keyboard={false}
//         className="gi-Track-Order gi-track padding-tb-40"
//       >
//         <button
//           type="button"
//           className="btn-close qty_close"
//           data-bs-dismiss="modal"
//           aria-label="Close"
//           onClick={handleClose}
//         ></button>
//         <Modal.Body className="container">
//           <Row style={{ padding: "18px" }}>
//             <Col lg={12}>
//               {/* <!-- Details--> */}
//               <Row>
//                 <Col md={4} className="m-b-767">
//                   <div className="gi-track-card">
//                     <span className="gi-track-title">order</span>
//                     <span>#6152</span>
//                   </div>
//                 </Col>
//                 <Col md={4} className="m-b-767">
//                   <div className="gi-track-card">
//                     <span className="gi-track-title">Grasshoppers</span>
//                     <span>v534hb</span>
//                   </div>
//                 </Col>
//                 <Col md={4} className="m-b-767">
//                   <div className="gi-track-card">
//                     <span className="gi-track-title">Expected date</span>
//                     <span>{currentDate}</span>
//                   </div>
//                 </Col>
//               </Row>
//               {/* <ul className="gi" data-gi-steps="5">
//                 {steps.map((step: any, index: number) => (
//                   <li key={index} className={step.done ? "gi-done" : "gi-todo"}>
//                     {step.title}
//                   </li>
//                 ))}
//               </ul> */}
//             </Col>
//           </Row>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default TrackViewModal;
import { Order } from "@/store/reducers/orders/ordersSlice";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FaCheckCircle, FaTruck, FaTimesCircle, FaHourglassHalf, FaBox } from "react-icons/fa";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  size: string;
  quantity: number;
  price: number;
}



interface TrackViewModalProps {
  handleClose: () => void;
  show: boolean;
  currentDate: string;
  order?: Order | null;
}

const TrackViewModal: React.FC<TrackViewModalProps> = ({ handleClose, show, currentDate, order }) => {
  if (!order) return null;

  // Helper for status steps
const STATUS_FLOW: Record<string, string[]> = {
  pending: ["pending"],
  processing: ["pending", "processing"],
  inway: ["pending", "processing", "inway"],
  completed: ["pending", "processing", "inway", "completed"],
  cancelled: ["pending", "cancelled"],
};
const stepsToRender = STATUS_FLOW[order.status] || [];

  const statusIcons = {
    pending: <FaHourglassHalf />,
    processing: <FaBox />,
    inway: <FaTruck />,
    completed: <FaCheckCircle />,
    cancelled: <FaTimesCircle color="red" />,
  };

const getStepClass = (step: string) => {
  if (step === "cancelled") return "step-cancelled";
  if (step === order.status) return "step-current";
  return "step-done";
};


  return (
    <Modal centered show={show} onHide={handleClose} keyboard={false} className="gi-Track-Order gi-track padding-tb-40">
      <button
        type="button"
        className="btn-close qty_close"
        aria-label="Close"
        onClick={handleClose}
      ></button>
      <Modal.Body className="container">
        <Row className="mb-4">
          <Col md={12}>
            <h5 className="mb-3">Order Tracking</h5>
            <Row>
              <Col md={4}>
                <div className="gi-track-card">
                  <span className="gi-track-title">Order ID</span>
                  <span>{order._id.slice(-6)}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className="gi-track-card">
                  <span className="gi-track-title">Payment Status</span>
                  <span style={{ color: order.paymentStatus === "paid" ? "green" : "#f39c12" }}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </Col>
              <Col md={4}>
                <div className="gi-track-card">
                  <span className="gi-track-title">Order Date</span>
                  <span>{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
                </div>
              </Col>
            </Row>

            {/* Status Steps */}
         <div className="status-steps mt-3 d-flex justify-content-between">
  {stepsToRender.map((step, index) => (
    <div key={step} className={`step ${getStepClass(step)} text-center`}>
      <div className="step-icon">{statusIcons[step]}</div>
      <div className="step-label text-capitalize">{step}</div>
    </div>
  ))}
</div>

          </Col>
        </Row>

        {/* Order Items */}
        <Row>
          <Col md={12}>
            <h6 className="mb-3">Products</h6>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <img src={item.product.images?.[0]} alt={item.product.name} width={50} height={50} />
                    </td>
                    <td>{item.product.name}</td>
                    <td>{item.size}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="text-end fw-bold">Total</td>
                  <td className="fw-bold">${order.totalPrice}</td>
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>

        {/* Shipping Address */}
        <Row className="mt-3">
          <Col md={12}>
            <h6>Shipping Address</h6>
            <p>{order.address.street}, {order.address.city}</p>
            <p>Phone: {order.address.phone}</p>
          </Col>
        </Row>
      </Modal.Body>

      <style jsx>{`
        .status-steps {
          margin-top: 20px;
        }
        .step {
          flex: 1;
          position: relative;
        }
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 15px;
          right: -50%;
          width: 100%;
          height: 4px;
          background-color: #ddd;
          z-index: 0;
        }
        .step-done .step-icon {
          color: green;
        }
        .step-current .step-icon {
          color: #f39c12;
        }
        .step-todo .step-icon {
          color: #ccc;
        }
        .step-cancelled .step-icon {
          color: red;
        }
        .step-icon {
          font-size: 24px;
          margin-bottom: 5px;
        }
        .step-label {
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </Modal>
  );
};

export default TrackViewModal;
