// import { useDispatch } from "react-redux";
// import { updateQuantity } from "../../store/reducers/cartSlice";

// const QuantitySelector = ({
//   id,
//   quantity,
//   setQuantity,
// }: {
//   id: number;
//   quantity: number;
//   setQuantity?: any;
// }) => {
//   const dispatch = useDispatch();

//   const handleQuantityChange = (operation: "increase" | "decrease") => {
//     let newQuantity = quantity;

//     if (operation === "increase") {
//       newQuantity = quantity + 1;
//     } else if (operation === "decrease" && quantity > 1) {
//       newQuantity = quantity - 1;
//     }

//     if (undefined !== setQuantity) {
//       setQuantity(newQuantity);
//     } else {
//       dispatch(updateQuantity({ id, quantity: newQuantity }));
//     }
//   };

//   return (
//     <>
//       <div
//         style={{ margin: " 0 0 0 10px", cursor: "pointer" }}
//         onClick={() => handleQuantityChange("decrease")}
//       >
//         -
//       </div>
//       <input
//         readOnly
//         className="qty-input"
//         type="text"
//         name="gi-qtybtn"
//         value={quantity}
//       />
//       <div
//         style={{ margin: " 0 10px 0 0", cursor: "pointer" }}
//         onClick={() => handleQuantityChange("increase")}
//       >
//         +
//       </div>
//     </>
//   );
// };

// export default QuantitySelector;

import React from "react";

interface QuantitySelectorProps {
  id: string | number;
  quantity: number;
  maxQuantity?: number; // اختيارياً لتحديد الحد الأقصى
  onChange?: (newQuantity: number) => void;
}

const QuantitySelector = ({
  id,
  quantity,
  onChange,
  maxQuantity,
}: QuantitySelectorProps) => {

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    let newQuantity = quantity;

    if (operation === "increase") {
      if (!maxQuantity || quantity < maxQuantity) newQuantity = quantity + 1;
    } else if (operation === "decrease" && quantity > 1) {
      newQuantity = quantity - 1;
    }

    if (onChange) {
      onChange(newQuantity);
    }
  };

  return (
    <div className="quantity-selector" style={{ display: "flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => handleQuantityChange("decrease")}
        style={{ cursor: "pointer" }}
      >
        -
      </button>
      <input
        readOnly
        className="qty-input"
        type="text"
        value={quantity}
        style={{ width: "40px", textAlign: "center", margin: "0 5px" }}
      />
      <button
        type="button"
        onClick={() => handleQuantityChange("increase")}
        style={{ cursor: "pointer" }}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
