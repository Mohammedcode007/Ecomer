

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Link from "next/link";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { useAppDispatch } from "@/store/hooks";
import { updateCartItem, removeFromCart, getCart } from "@/store/reducers/cart/cartSlice";
import { mapProductToItem } from "@/utility/Functions";
import { applyCoupon } from "@/store/reducers/coupon/couponSlice";

const SidebarCart = ({ closeCart, isCartOpen }: any) => {
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cartRealData);

  const { items } = cart;

  const [subTotal, setSubTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    dispatch(getCart({ page: 1, limit: 10 }));
  }, [dispatch]);

  // تحديث SubTotal بعد تطبيق الخصم
  useEffect(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    const totalDiscount = items.reduce(
      (acc, item) => acc + (item.discountAmount || 0),
      0
    );

    setSubTotal(subtotal - totalDiscount);
  }, [items]);


  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };


  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    dispatch(applyCoupon(couponCode));
  };
  const { error: couponError, totalDiscount } = useSelector((state: RootState) => state.coupon);

  // تحديث حساب Sub-Total بدون خصم كل عنصر
  useEffect(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setSubTotal(subtotal);
  }, [items]);

  const total = subTotal - (totalDiscount || 0);

  return (
    <>
      {isCartOpen && (
        <div
          className="gi-side-cart-overlay"
          style={{ display: "block" }}
          onClick={closeCart}
        ></div>
      )}

      <div id="gi-side-cart" className={`gi-side-cart ${isCartOpen ? "gi-open-cart" : ""}`}>
        <div className="gi-cart-inner">
          <div className="gi-cart-top">
            <div className="gi-cart-title">
              <span className="cart_title">My Cart</span>
              <Link href="/" onClick={closeCart} className="gi-cart-close">
                <i className="fi-rr-cross-small"></i>
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="gi-pro-content cart-pro-title">Your cart is empty.</div>
            ) : (
              <ul className="gi-cart-pro-items">
                {items.map((cartItem, index) => {
                  const itemData = mapProductToItem(cartItem.product);
                  const itemWithQuantity = {
                    ...itemData,
                    quantity: cartItem.quantity,
                    waight: cartItem.size || itemData.waight,
                  };

                  const key = `${cartItem.product._id}-${cartItem.size}-${index}`;

                  return (
                    <li key={key}>
                      <Link href="/" onClick={(e) => e.preventDefault()} className="gi-pro-img">
                        {itemWithQuantity.image && <img src={itemWithQuantity.image} alt={itemWithQuantity.title} />}
                      </Link>
                      <div className="gi-pro-content">
                        <Link href="/" className="cart-pro-title">{itemWithQuantity.title}</Link>
                        <span className="cart-price">
                          {itemWithQuantity.waight}{" "}
                          <span>
                            ${(itemWithQuantity.newPrice * itemWithQuantity.quantity - (cartItem.discountAmount || 0)).toFixed(2)}
                          </span>
                          {cartItem.discountAmount && cartItem.discountAmount > 0 && (
                            <small className="text-success d-block">
                              خصم: -${cartItem.discountAmount.toFixed(2)}
                            </small>
                          )}
                        </span>

                        <div className="qty-plus-minus gi-qty-rtl">
                          <QuantitySelector
                            id={itemWithQuantity.id}
                            quantity={itemWithQuantity.quantity}
                            onChange={(newQty: number) =>
                              handleUpdateQuantity(cartItem.product._id, newQty)
                            }
                          />
                        </div>
                        <Link href="#/" className="remove" onClick={() => handleRemoveItem(cartItem.product._id)}>
                          ×
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="gi-cart-bottom">
              <div className="apply-coupon mb-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="form-control"
                />
                <button className="gi-btn-2 mt-1" onClick={handleApplyCoupon}>Apply Coupon</button>
                {couponError && <p className="text-danger mt-1">{couponError}</p>}
              </div>

              <div className="cart-sub-total">
                <table className="table cart-table">
                  <tbody>
                    <tr>
                      <td className="text-left">Sub-Total :</td>
                      <td className="text-right">${subTotal.toFixed(2)}</td>
                    </tr>
                    {totalDiscount > 0 && (
                      <tr>
                        <td className="text-left text-success">Discount :</td>
                        <td className="text-right text-success">-${totalDiscount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="text-left">Total :</td>
                      <td className="text-right primary-color">${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="cart_btn">
                <Link href="/cart" className="gi-btn-1" onClick={closeCart}>View Cart</Link>
                <Link href="/checkout" className="gi-btn-2" onClick={closeCart}>Checkout</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
