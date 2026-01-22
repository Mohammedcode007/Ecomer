"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ItemCard from "../product-item/ItemCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import StarRating from "../stars/StarRating";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import useSWR from "swr";
import fetcher from "../fetcher-api/Fetcher";
import { Col, Form, Row } from "react-bootstrap";
import Spinner from "../button/Spinner";
import { useRouter } from "next/navigation";
import { addOrder, clearCart, setOrders } from "@/store/reducers/cartSlice";
import { login } from "@/store/reducers/registrationSlice";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import DiscountCoupon from "../discount-coupon/DiscountCoupon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { mapProductToItem } from "@/utility/Functions";
import { applyCoupon } from "@/store/reducers/coupon/couponSlice";
import { CartItem, removeFromCart, updateCartItem } from "@/store/reducers/cart/cartSlice";
import { addAddress, deleteAddress, fetchMyAddresses } from "@/store/reducers/address/addressSlice";
import { createOrder, fetchMyOrders } from "@/store/reducers/orders/ordersSlice";

export interface Address {
  _id: string;
  user: string;
  type: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  details?: string;
  phone: string;
  deliveryStart?: string;
  deliveryEnd?: string;
  createdAt: string;
  updatedAt: string;
}


interface Registration {
  details: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  password: string;
  uid: any;
}



interface Country {
  id: string;
  name: any;
  iso2: string;
}

interface State {
  id: string;
  name: any;
  state_code: string;
}

interface City {
  id: string;
  name: any;
  iso2: string;
}

const CheckOut = ({
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}) => {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
console.log(selectedAddress,'88888');

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    details?: string;
    address?: string;
    phoneNumber?: string;
    postalCode?: string;
    country?: string;
    state?: string;
    city?: string;
  }>({});
  const dispatch = useAppDispatch();

  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const orders = useSelector((state: RootState) => state.cart.orders);
  const cart = useSelector((state: RootState) => state.cartRealData);
  const { error: couponError, totalDiscount } = useSelector((state: RootState) => state.coupon);

  const { items } = cart;
  const [mappedItems, setMappedItems] = useState<any[]>([]);

  useEffect(() => {
    if (!items || items.length === 0) {
      setMappedItems([]);
      return;
    }

    const mapped = items.map((item: CartItem) => ({
      ...mapProductToItem(item.product),
      quantity: item.quantity,
    }));

    setMappedItems(mapped);
  }, [items]);
  const isLogin = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("free");
  const [checkOutMethod, setCheckOutMethod] = useState("guest");
  const [billingMethod, setBillingMethod] = useState("new");
  const [billingVisible, setBillingVisible] = useState(false);
  const [addressVisible, setAddressVisible] = useState<any[]>([]);
  const [optionVisible, setOptionVisible] = useState(true);
  const [loginVisible, setLoginVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);
  
  const [filteredCountryData, setFilteredCountryData] = useState<Country[]>([]);
  const [filteredStateData, setFilteredStateData] = useState<State[]>([]);
  const [filteredCityData, setFilteredCityData] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const [couponCode, setCouponCode] = useState("");
  const [formData, setFormData]: any = useState({
    details: "",
    address: "",   // يمكنك إزالة هذا أو تركه كحقل اختياري
    street: "",    // جديد
    phone: "",     // جديد
    country: "",
    state: "",
    city: "",
    postalCode: "",
  });

  const { data: country } = useSWR("/api/country", fetcher, {
    onSuccess,
    onError,
  });

//   useEffect(() => {
//  if(selectedAddress)
//     setSelectedAddressId(selectedAddress?._id);

  
//   }, [selectedAddress]);

  useEffect(() => {
    if (selectedAddress) {
      setBillingMethod("use");
    } else {
      setBillingMethod("new");
    }
  }, [selectedAddress]);

  useEffect(() => {
    if (isLogin) {
      setBtnVisible(false);
      setOptionVisible(false);
      setBillingVisible(true);
    }
  }, [isLogin]);

  useEffect(() => {
    if (country) {
      setFilteredCountryData(
        country.map((country: any) => ({
          id: country.id,
          countryName: country.name,
          iso2: country.iso2,
        }))
      );
    }
  }, [country]);

  const handleDeliveryChange = (event: any) => {
    setSelectedMethod(event.target.value);
  };

  const handleBillingChange = (event: any) => {
    setBillingMethod(event.target.value);
  };

  const handleCheckOutChange = (event: any) => {
    const method = event.target.value;
    setCheckOutMethod(method);
    setBillingVisible(false);
    setLoginVisible(true);
    setBtnVisible(true);

    if (method === "guest") {
      setBillingVisible(false);
      setLoginVisible(false);
    } else if (method === "login") {
      setLoginVisible(true);
      setBtnVisible(false);
    }
  };

  const handleContinueBtn = () => {
    if (checkOutMethod === "register") {
      router.push("/register");
    } else if (checkOutMethod === "guest") {
      setBillingVisible(true);
      setLoginVisible(false);
      setBtnVisible(false);
    } else if (checkOutMethod === "login") {
      setBillingVisible(false);
    }
  };

  const handleInputChange = (e: any, additionalValue: string = "") => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === "country" && { countryName: additionalValue }),
      ...(name === "state" && { stateName: additionalValue }),
    });
  };

  useEffect(() => {
    const storedRegistrations = JSON.parse(
      localStorage.getItem("registrationData") || "[]"
    );
    setRegistrations(storedRegistrations);
  }, []);

  useEffect(() => {
    const storedAddresses = JSON.parse(
      localStorage.getItem("shippingAddresses") || "[]"
    );
    setAddressVisible(storedAddresses);
  }, []);

  // item Price
  useEffect(() => {
    if (cartItems.length === 0) {
      setSubTotal(0);
      setVat(0);
      return;
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.newPrice * item.quantity,
      0
    );

    setSubTotal(subtotal);

    // مبلغ توصيل ثابت
    setVat(50); // ← غير الرقم حسب المطلوب
  }, [items]);



  const handleDiscountApplied = (discount) => {
    setDiscount(discount);
  };

  const discountAmount = subTotal * (discount / 100);
  // item Price end

  const { data, error } = useSWR("/api/deal", fetcher, { onSuccess, onError });




  const generateRandomId = () => {
    const randomNum = Math.floor(Math.random() * 100000);
    return `${randomNum}`;
  };

  const randomId = generateRandomId();
  const handleCreateOrder = async () => {
        if (!isTermsChecked) {
      showErrorToast("Please agree to the Terms & Conditions.");
      checkboxRef.current?.focus();
      return;
    }
       if (!selectedAddress) {
      showErrorToast("Please select a billing address.");
      return;
    }
    if (!selectedAddress) {
      alert('يرجى اختيار عنوان');
      return;
    }

    try {
      const resultAction = await dispatch(createOrder({ addressId: selectedAddress?._id }));

      if (createOrder.fulfilled.match(resultAction)) {
        alert('تم إنشاء الطلب بنجاح!');
        // إعادة جلب الطلبات بعد الإنشاء
        dispatch(fetchMyOrders());
      } else {
        alert(resultAction.payload || 'فشل إنشاء الطلب');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إنشاء الطلب');
    }
  };

  // const handleCheckout = () => {
  //   if (!isTermsChecked) {
  //     showErrorToast("Please agree to the Terms & Conditions.");
  //     checkboxRef.current?.focus();
  //     return;
  //   }

  //   if (!selectedAddress) {
  //     showErrorToast("Please select a billing address.");
  //     return;
  //   }

  //   const newOrder = {
  //     orderId: randomId,
  //     date: new Date().getTime(),
  //     shippingMethod: selectedMethod,
  //     totalItems: cartItems.length,
  //     totalPrice: total,
  //     status: "Pending",
  //     products: cartItems,
  //     address: selectedAddress,
  //   };

  //   const orderExists = orders.some(
  //     (order: any) => order.id === newOrder.orderId
  //   );

  //   if (!orderExists) {
  //     dispatch(addOrder(newOrder));
  //   } else {
  //     console.log(
  //       `Order with ID ${newOrder.orderId} already exists and won't be added again.`
  //     );
  //   }
  //   dispatch(clearCart());

  //   router.push("/orders");
  // };
  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العنوان؟")) {
      dispatch(deleteAddress(id));
    }
  };


  const handleSelectAddress = (address: any) => {
    setSelectedAddress(address);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const foundUser = registrations.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      const userData = { uid: foundUser.uid, email, password };

      localStorage.setItem("login_user", JSON.stringify(userData));
      dispatch(login(foundUser));
      showSuccessToast("User Login Success");
    } else {
      showErrorToast("Invalid email or password");
    }

    const requiredFields = ["email", "password"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setValidated(true);
        return;
      }
    }
    setValidated(true);
  };

  const handleCountryChange = async (e: any) => {
    const { value, options, selectedIndex } = e.target;
    const countryName = options[selectedIndex].text;
    handleInputChange(e, countryName);

    setLoadingStates(true);
    const response = await fetcher(`/api/state`, {
      country_code: value,
    });
    setLoadingStates(false);
    setFilteredStateData(
      response.map((state: any) => ({
        id: state.id,
        StateName: state.name,
        state_code: state.state_code,
      }))
    );
    setFilteredCityData([]);
  };

  const handleStateChange = async (e: any) => {
    const { value, options, selectedIndex } = e.target;
    const stateName = options[selectedIndex].text;

    handleInputChange(e, stateName);
    setLoadingCities(true);

    const response = await fetcher(`/api/city`, {
      states_code: value,
      country_code: formData.country,
    });
    setLoadingCities(false);
    setFilteredCityData(
      response.map((city: any) => ({
        id: city.id,
        CityName: city.name,
        iso2: city.iso2,
      }))
    );
  };

  const handleCityChange = (e: any) => {
    handleInputChange(e);
  };

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

  // تحديث حساب Sub-Total بدون خصم كل عنصر
  useEffect(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setSubTotal(subtotal);
  }, [items]);

  const total =
    subTotal -
    (totalDiscount || 0) +
    vat;
  const { addresses, loading } = useAppSelector((state) => state.address);



  // جلب العناوين عند التحميل
  useEffect(() => {
    dispatch(fetchMyAddresses());
  }, [dispatch]);

  // تغيير بيانات الفورم
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // إرسال الفورم لإضافة عنوان جديد
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    try {
      await dispatch(addAddress(formData)).unwrap(); // إضافة العنوان
      alert("تم إضافة العنوان بنجاح");
      setFormData({
        details: "",
        address: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
      });
      setValidated(false);
    } catch (err: any) {
      alert(err || "فشل إضافة العنوان");
    }
  };

  if (error) return <div>Failed to load products</div>;
  if (!data)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <>
      <Breadcrumb title={"Checkout"} />
      <section className="gi-checkout-section padding-tb-40">
        <h2 className="d-none">Checkout Page</h2>
        <div className="container">
          {mappedItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "300",
              }}
              className="gi-pro-content cart-pro-title"
            >
              {" "}
              Your cart is currently empty. Please add items to your cart to
              proceed.
            </div>
          ) : (
            <Row>
              {/* <!-- Sidebar Area Start --> */}
              <Col lg={4} md={12} className="gi-checkout-rightside">
                <div className="gi-sidebar-wrap">
                  {/* <!-- Sidebar Summary Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Summary</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-checkout-summary">
                        <div>
                          <span className="text-left">Sub-Total</span>
                          <span className="text-right">${subTotal.toFixed(2)}</span>
                        </div>

                        <div>
                          <span className="text-left">Delivery Charges</span>
                          <span className="text-right">${vat.toFixed(2)}</span>
                        </div>

                        {totalDiscount > 0 && (
                          <div>
                            <span className="text-left">Discount</span>
                            <span className="text-right">-${totalDiscount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="gi-checkout-total">
                          <strong>Total</strong>
                          <strong>${total.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="gi-checkout-summary">
                        <div>
                          <span className="text-left">Sub-Total</span>
                          <span className="text-right">
                            ${subTotal.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-left">Delivery Charges</span>
                          <span className="text-right">${vat.toFixed(2)}</span>
                        </div>
                        <div>
                          <DiscountCoupon
                            onDiscountApplied={handleDiscountApplied}
                          />
                        </div>
                        <div className="gi-checkout-coupan-content">
                          <form
                            className="gi-checkout-coupan-form"
                            name="gi-checkout-coupan-form"
                            method="post"
                            action="#"
                          >
                            <input
                              className="gi-coupan"
                              type="text"
                              required
                              placeholder="Enter Your Coupan Code"
                              name="gi-coupan"
                              defaultValue=""
                            />
                            <button
                              className="gi-coupan-btn gi-btn-2"
                              type="submit"
                              name="subscribe"
                            >
                              Apply
                            </button>
                          </form>
                        </div>
                        <div className="gi-checkout-summary-total">
                          <span className="text-left">Total Amount</span>
                          <span className="text-right">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                  {/* <!-- Sidebar Summary Block --> */}
                </div>
                <div className="gi-sidebar-wrap gi-checkout-del-wrap">
                  {/* <!-- Sidebar Summary Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Delivery Method</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-checkout-del">
                        <div className="gi-del-desc">
                          Please select the preferred shipping method to use on
                          this order.
                        </div>
                        <form action="#">
                          <span className="gi-del-option">
                            <span>
                              <span className="gi-del-opt-head">
                                Free Shipping
                              </span>
                              <input
                                type="radio"
                                id="del1"
                                name="radio-group"
                                value="free"
                                checked={selectedMethod === "free"}
                                onChange={handleDeliveryChange}
                              />
                              <label htmlFor="del1">Rate - $0.00</label>
                            </span>
                            <span>
                              <span className="gi-del-opt-head">Flat Rate</span>
                              <input
                                type="radio"
                                id="del2"
                                name="radio-group"
                                value="flat"
                                checked={selectedMethod === "flat"}
                                onChange={handleDeliveryChange}
                              />
                              <label htmlFor="del2">Rate - $5.00</label>
                            </span>
                          </span>
                          <span className="gi-del-comment">
                            <span className="gi-del-opt-head">
                              Add Comments About Your Order
                            </span>
                            <textarea
                              name="your-comment"
                              placeholder="Comments"
                            ></textarea>
                          </span>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Sidebar Summary Block --> */}
                </div>
                <div className="gi-sidebar-wrap gi-checkout-pay-wrap">
                  {/* <!-- Sidebar Payment Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Payment Method</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-checkout-pay">
                        <div className="gi-pay-desc">
                          Please select the preferred payment method to use on
                          this order.
                        </div>
                        <form action="#">
                          <span className="gi-pay-option">
                            <span>
                              <input
                                readOnly
                                type="radio"
                                id="pay1"
                                name="radio-group"
                                value=""
                                checked
                              />
                              <label htmlFor="pay1">Cash On Delivery</label>
                            </span>
                          </span>
                          <span className="gi-pay-commemt">
                            <span className="gi-pay-opt-head">
                              Add Comments About Your Order
                            </span>
                            <textarea
                              name="your-commemt"
                              placeholder="Comments"
                            ></textarea>
                          </span>
                          <span className="gi-pay-agree">
                            <input
                              ref={checkboxRef}
                              required
                              checked={isTermsChecked}
                              onChange={() =>
                                setIsTermsChecked(!isTermsChecked)
                              }
                              type="checkbox"
                              value=""
                            />
                            <a href="#">
                              I have read and agree to the{" "}
                              <span>Terms & Conditions.</span>
                            </a>
                            <span className="checked"></span>
                          </span>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Sidebar Payment Block --> */}
                </div>
                <div className="gi-sidebar-wrap gi-check-pay-img-wrap">
                  {/* <!-- Sidebar Payment Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Payment Method</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-check-pay-img-inner">
                        <div className="gi-check-pay-img">
                          <img
                            src={
                              process.env.NEXT_PUBLIC_URL +
                              "/assets/img/hero-bg/payment.png"
                            }
                            alt="payment"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Sidebar Payment Block --> */}
                </div>
              </Col>
              <Col lg={8} md={12} className="gi-checkout-leftside m-t-991">
                {/* <!-- checkout content Start --> */}
                <div className="gi-checkout-content">
                  <div className="gi-checkout-inner">
                    {optionVisible && (
                      <>
                        <div className="gi-checkout-wrap m-b-40">
                          <div className="gi-checkout-block">
                            <h3 className="gi-checkout-title">New Customer</h3>
                            <div className="gi-check-block-content">
                              <div className="gi-check-subtitle">
                                Checkout Options
                              </div>
                              <form action="#">
                                <span className="gi-new-option">
                                  <span>
                                    <input
                                      type="radio"
                                      id="account2"
                                      name="radio-group"
                                      value="guest"
                                      checked={checkOutMethod === "guest"}
                                      onChange={handleCheckOutChange}
                                    />
                                    <label htmlFor="account2">
                                      Guest Account
                                    </label>
                                  </span>
                                  <span>
                                    <input
                                      type="radio"
                                      id="account1"
                                      name="radio-group"
                                      value="register"
                                      checked={checkOutMethod === "register"}
                                      onChange={handleCheckOutChange}
                                    />
                                    <label htmlFor="account1">
                                      Register Account
                                    </label>
                                  </span>
                                  <span>
                                    <input
                                      type="radio"
                                      id="account3"
                                      name="radio-group"
                                      value="login"
                                      checked={checkOutMethod === "login"}
                                      onChange={handleCheckOutChange}
                                    />
                                    <label htmlFor="account3">
                                      Login Account
                                    </label>
                                  </span>
                                </span>
                              </form>

                              {btnVisible ? (
                                <>
                                  <div className="gi-new-desc">
                                    By creating an account you will be able to
                                    shop faster, be up to date on an order`s
                                    status, and keep track of the orders you
                                    have previously made.
                                  </div>

                                  <div className="gi-new-btn">
                                    <a
                                      onClick={handleContinueBtn}
                                      className="gi-btn-2"
                                    >
                                      Continue
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {loginVisible && (
                                    <div
                                      style={{ marginTop: "15px" }}
                                      className=" m-b-40"
                                    >
                                      <div className="gi-checkout-block gi-check-login">
                                        <div className="gi-check-login-form">
                                          <Form
                                            noValidate
                                            validated={validated}
                                            onSubmit={handleLogin}
                                            action="#"
                                            method="post"
                                          >
                                            <span className="gi-check-login-wrap">
                                              <label>Email Address</label>
                                              <Form.Group>
                                                <Form.Control
                                                  type="text"
                                                  name="email"
                                                  placeholder="Enter your email address"
                                                  value={email}
                                                  onChange={(e) =>
                                                    setEmail(e.target.value)
                                                  }
                                                  required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  Please Enter correct username.
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </span>
                                            <span
                                              style={{ marginTop: "24px" }}
                                              className="gi-check-login-wrap"
                                            >
                                              <label>Password</label>
                                              <Form.Group>
                                                <Form.Control
                                                  type="password"
                                                  name="password"
                                                  pattern="^\d{6,12}$"
                                                  placeholder="Enter your password"
                                                  required
                                                  value={password}
                                                  onChange={(e) =>
                                                    setPassword(e.target.value)
                                                  }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                  Please Enter 6-12 digit
                                                  number.
                                                </Form.Control.Feedback>
                                              </Form.Group>
                                            </span>
                                            <span className="gi-check-login-wrap gi-check-login-btn">
                                              <button
                                                className="gi-btn-2"
                                                type="submit"
                                              >
                                                Continue
                                              </button>
                                              <a
                                                className="gi-check-login-fp"
                                                href="#"
                                              >
                                                Forgot Password?
                                              </a>
                                            </span>
                                          </Form>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {billingVisible && (
                      <div className="gi-checkout-wrap m-b-30 padding-bottom-3">
                        <div className="gi-checkout-block gi-check-bill">
                          <h3 className="gi-checkout-title">Billing details</h3>
                          <div className="gi-bl-block-content">
                            <div className="gi-check-subtitle">
                              Checkout Options
                            </div>
                            <span className="gi-bill-option">
                              <span>
                                <input
                                  type="radio"
                                  id="bill1"
                                  name="radio-group"
                                  value="use"
                                  checked={billingMethod === "use"}
                                  onChange={handleBillingChange}
                                  disabled={addressVisible.length === 0}
                                />
                                <label htmlFor="bill1">
                                  I want to use an existing address
                                </label>
                              </span>
                              <span>
                                <input
                                  type="radio"
                                  id="bill2"
                                  name="radio-group"
                                  value="new"
                                  checked={
                                    billingMethod === "new" ||
                                    addressVisible.length === 0
                                  }
                                  onChange={handleBillingChange}
                                />
                                <label htmlFor="bill2">
                                  I want to use new address
                                </label>
                              </span>
                            </span>
                            {(billingMethod === "new" || addressVisible.length === 0) && (
                              <div className="gi-check-bill-form">
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                  {/* First Name */}


                                  {/* Last Name */}
                                  <span className="gi-bill-wrap gi-bill-half" style={{ marginTop: "10px" }}>
                                    <label>details *</label>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        name="details"
                                        placeholder="Enter your details"
                                        value={formData.details}
                                        onChange={handleInputChange}
                                        required
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter details.
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </span>

                                  {/* Phone */}
                                  <span className="gi-bill-wrap gi-bill-half" style={{ marginTop: "10px" }}>
                                    <label>Phone *</label>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter Phone Number.
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </span>

                                  {/* Street */}
                                  <span className="gi-bill-wrap" style={{ marginTop: "10px" }}>
                                    <label>Street *</label>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        name="street"
                                        placeholder="Enter street address"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        required
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter Street Address.
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </span>

                                  {/* Country */}
                                  <Form.Group className="gi-bill-wrap gi-bill-half" style={{ marginTop: "10px" }}>
                                    <label>Country *</label>
                                    <Form.Select
                                      name="country"
                                      value={formData.country}
                                      onChange={handleCountryChange}
                                      isInvalid={validated && !formData.country}
                                      required
                                      className="gi-bill-select"
                                    >
                                      <option value="" disabled>Country</option>
                                      {filteredCountryData.map((country: any, index: number) => (
                                        <option key={index} value={country.iso2}>{country.countryName}</option>
                                      ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">Please select Country.</Form.Control.Feedback>
                                  </Form.Group>

                                  {/* State */}
                                  <span className="gi-bill-wrap gi-bill-half" style={{ marginTop: "10px" }}>
                                    <label>Region/State *</label>
                                    <Form.Group>
                                      <Form.Select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleStateChange}
                                        required
                                        className="gi-bill-select"
                                      >
                                        <option value="" disabled>Region/State</option>
                                        {loadingStates ? (
                                          <option disabled>Loading...</option>
                                        ) : (
                                          filteredStateData.map((state: any, index) => (
                                            <option key={index} value={state.state_code}>{state.StateName}</option>
                                          ))
                                        )}
                                      </Form.Select>
                                    </Form.Group>
                                  </span>

                                  {/* City */}
                                  <span className="gi-bill-wrap gi-bill-half" style={{ marginTop: "10px" }}>
                                    <label>City *</label>
                                    <Form.Group>
                                      <Form.Select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                        required
                                        className="gi-bill-select"
                                      >
                                        <option value="" disabled>City</option>
                                        {loadingCities ? (
                                          <option disabled>Loading...</option>
                                        ) : (
                                          filteredCityData.map((city: any, index) => (
                                            <option key={index} value={city.iso2}>{city.CityName}</option>
                                          ))
                                        )}
                                      </Form.Select>
                                    </Form.Group>
                                  </span>

                                  {/* Postal Code */}
                                  <span className="gi-bill-wrap gi-bill-half" style={{ marginTop: "10px" }}>
                                    <label>Post Code *</label>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        name="postalCode"
                                        pattern="^\d{5,6}$"
                                        placeholder="Post Code"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        Please enter 5-6 digit number.
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </span>

                                  {/* Submit Button */}
                                  <span className="gi-check-order-btn" style={{ marginTop: "20px" }}>
                                    <button type="submit" className="gi-btn-2">
                                      Add
                                    </button>
                                  </span>
                                </Form>
                              </div>
                            )}

                            {billingMethod === "use" && addresses.length > 0 && (
                              <div className="gi-checkout-block gi-check-bill">
                                <div className="gi-sidebar-block">
                                  <div className="gi-sb-title">
                                    <h3 className="gi-sidebar-title">Address</h3>
                                  </div>
                                  <div className="gi-sb-block-content">
                                    {selectedAddress === null && (
                                      <div className="gi-pay-desc" style={{ marginBottom: "15px" }}>
                                        Please select the preferred Address to use on this order.
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <ul>
                                  {addresses.map((address) => (
                                    <li key={address._id}>
                                      <div className="bill-box m-b-30" style={{ padding: "10px", position: "relative" }}>
                                        {/* Checkbox */}
                                        <div style={{ position: "absolute", top: "10px", left: "10px" }} className="checkboxes__item">
                                          <label className="checkbox style-c">
                                            <input
                                              type="checkbox"
                                              checked={selectedAddress?._id === address._id}
                                              onChange={() => handleSelectAddress(address)}
                                            />
                                            <div className="checkbox__checkmark"></div>
                                            <div className="checkbox__body"></div>
                                          </label>
                                        </div>

                                        {/* Address details */}
                                        <Row style={{ padding: "0 30px" }}>
                                          <Col lg={6} md={6} sm={12} style={{ lineHeight: "25px" }}>
                                            <ul className="gi-single-list">

                                              <li>
                                                <strong className="gi-check-subtitle">Street :</strong>{" "}
                                                <span style={{ color: "#777" }}>{address.street}</span>
                                              </li>
                                              <li>
                                                <strong className="gi-check-subtitle">details :</strong>{" "}
                                                <span style={{ color: "#777" }}>{address.details}</span>
                                              </li>
                                              <li>
                                                <strong className="gi-check-subtitle">Postal Code :</strong>{" "}
                                                <span style={{ color: "#777" }}>{address.postalCode}</span>
                                              </li>
                                              <li>
                                                <strong className="gi-check-subtitle">Phone :</strong>{" "}
                                                <span style={{ color: "#777" }}>{address.phone}</span>
                                              </li>
                                            </ul>
                                          </Col>

                                          <Col lg={6} md={6} sm={12} style={{ lineHeight: "25px" }}>
                                            <ul className="gi-single-list">
                                              <li>
                                                <strong className="gi-check-subtitle">Country :</strong>{" "}
                                                <span style={{ color: "#777" }}>{address.country}</span>
                                              </li>

                                              <li>
                                                <strong className="gi-check-subtitle">City :</strong>{" "}
                                                <span style={{ color: "#777" }}>{address.city}</span>
                                              </li>
                                            </ul>
                                          </Col>
                                        </Row>

                                        {/* Remove Button */}
                                        <a
                                          onClick={() => handleDelete(address._id)}
                                          href="#/"
                                          className="remove"
                                          style={{
                                            fontSize: "30px",
                                            color: "#5caf90",
                                            position: "absolute",
                                            top: "0",
                                            right: "10px",
                                          }}
                                        >
                                          ×
                                        </a>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    )}
                    {btnVisible ||
                      (!btnVisible === billingVisible && (
                        <span className="gi-check-order-btn">
                          <a onClick={handleCreateOrder} className="gi-btn-2">
                            Place Order
                          </a>
                        </span>
                      ))}
                  </div>
                </div>
                {/* <!--cart content End --> */}
              </Col>
            </Row>
          )}
        </div>
      </section>
      {mappedItems.length !== 0 ? (
        <section className="gi-new-product padding-tb-40">
          <div className="container">
            <Row className="overflow-hidden m-b-minus-24px">
              <Col lg={12} className="gi-new-prod-section col-lg-12">
                <div className="gi-products">
                  <Fade
                    direction="up"
                    duration={2000}
                    triggerOnce
                    delay={200}
                    className="section-title-2"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                    data-aos-delay="200"
                  >
                    <h2 className="gi-title">
                      New <span>Arrivals</span>
                    </h2>
                    <p>Browse The Collection of Top Products</p>
                  </Fade>
                  <Fade
                    direction="up"
                    duration={2000}
                    triggerOnce
                    delay={200}
                    className="gi-new-block m-minus-lr-12"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                    data-aos-delay="300"
                  >
                    <Swiper
                      loop={true}
                      autoplay={{ delay: 1000 }}
                      slidesPerView={5}
                      className="deal-slick-carousel gi-product-slider"
                      breakpoints={{
                        0: {
                          slidesPerView: 1,
                        },
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 25,
                        },
                        426: {
                          slidesPerView: 2,
                        },
                        640: {
                          slidesPerView: 2,
                        },
                        768: {
                          slidesPerView: 3,
                        },
                        1024: {
                          slidesPerView: 3,
                        },
                        1025: {
                          slidesPerView: 5,
                        },
                      }}
                    >
                      {/* {getData().map((item: any, index: number) => (
                        <SwiperSlide key={index}>
                          <ItemCard data={item} />
                        </SwiperSlide>
                      ))} */}
                    </Swiper>
                  </Fade>
                </div>
              </Col>
            </Row>
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default CheckOut;

export const useLoadOrders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginUser = JSON.parse(localStorage.getItem("login_user") || "{}");

      if (loginUser?.uid) {
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "{}");
        const userOrders = storedOrders[loginUser.uid] || [];

        if (userOrders.length > 0) {
          dispatch(setOrders(userOrders));
        }
      }
    }
  }, [dispatch]);
};
