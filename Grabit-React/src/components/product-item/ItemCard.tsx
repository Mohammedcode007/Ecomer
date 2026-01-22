import { useEffect, useState } from "react";
import StarRating from "../stars/StarRating";
import QuickViewModal from "../model/QuickViewModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  setItems,
  updateItemQuantity,
} from "../../store/reducers/cartSlice";
import Link from "next/link";
import { showSuccessToast } from "../toast-popup/Toastify";
import { RootState } from "@/store";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { addCompare, removeCompareItem } from "@/store/reducers/compareSlice";
import { getWishlist, Product, toggleWishlist } from "@/store/reducers/wishList/wishlistSlice";
import { useAppDispatch } from "@/store/hooks";
import { addToCart, CartItem, getCart } from "@/store/reducers/cart/cartSlice";



interface Item {
  id: number;
  title: string;
  newPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  oldPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}
const ItemCard = ({ data }: any) => {

  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { products, loading } = useSelector(
    (state: RootState) => state.wishlistRealData
  );

  useEffect(() => {
    dispatch(getWishlist({ page: 1, limit: 10 }));
  }, [dispatch]);
  const compareItems = useSelector((state: RootState) => state.compare.compare);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const itemsFromLocalStorage =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("products") || "[]")
        : [];
    if (itemsFromLocalStorage.length) {
      dispatch(setItems(itemsFromLocalStorage));
    }
  }, [dispatch]);

  const handleCart = (data: Item) => {
    const isItemInCart = cartItems.some((item: Item) => item.id === data.id);

    if (!isItemInCart) {
      dispatch(addItem({ ...data, quantity: 1 }));
      showSuccessToast("Add product in Cart Successfully!");
    } else {
      const updatedCartItems = cartItems.map((item: Item) =>
        item.id === data.id
          ? {
            ...item,
            quantity: item.quantity + 1,
            price: item.newPrice + data.newPrice,
          } // Increment quantity and update price
          : item
      );
      dispatch(updateItemQuantity(updatedCartItems));
      showSuccessToast("Add product in Cart Successfully!");
    }
  };

  const isInWishlist = (data: { id: string }) => {
    return products.some((item: Product) => item._id === data.id);
  };





  const isInCompare = (data: Item) => {
    return compareItems.some((item: Item) => item.id === data.id);
  };

  const handleCompareItem = (data: Item) => {
    if (!isInCompare(data)) {
      dispatch(addCompare(data));
      showSuccessToast(`Add product in Compare list Successfully!`, {
        icon: false,
      });
    } else {
      dispatch(removeCompareItem(data.id));
      showSuccessToast("Remove product on Compare list Successfully!", {
        icon: false,
      });
      // showErrorToast("Item already have to compare list");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const token = localStorage.getItem("token");
  const handleToggleWishlist = (productId: string) => {

    dispatch(toggleWishlist({ productId }));
  };

  const cart = useSelector((state: RootState) => state.cartRealData) as {
    items: CartItem[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
  };
  // const { items, error, totalItems } = cart;

  // عند تحميل الـ Component، جلب العربة
  useEffect(() => {
    dispatch(getCart({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleAddToCart = (data: any) => {
    dispatch(
      addToCart({
        productId: data.id,
        size: data?.sizes[0].size,
        quantity: 1,
      })
    );
  };


  return (
    <>
      <div className="gi-product-content">
        <div className={` gi-product-inner`}>
          <div className="gi-pro-image-outer">
            <div className="gi-pro-image">
              <Link
                onClick={handleSubmit}
                href="/"
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  height: "260px", // حجم موحد لكل الصور
                  overflow: "hidden",
                }}
              >
                <span
                  className="label veg"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 2,
                  }}
                >
                  <span className="dot" style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "green",
                  }}></span>
                </span>

                <img
                  className="main-image"
                  src={data.image}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.4s ease",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />

                <img
                  className="hover-image"
                  src={data.imageTwo}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.4s ease",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget.style.opacity = "1"))}
                  onMouseLeave={(e) => ((e.currentTarget.style.opacity = "0"))}
                />
              </Link>
              

              <span className="flags">
                {data.size1 && (
                  <li
                    className={selectedSize === data.size1 ? "active" : ""}
                    onClick={() => setSelectedSize(data.size1)}
                  >
                    <a href="#">{data.size1}</a>
                    <p>454</p>
                  </li>
                )}
                {data.size2 && (
                  <li
                    className={selectedSize === data.size2 ? "active" : ""}
                    onClick={() => setSelectedSize(data.size2)}
                  >
                    <a href="#">{data.size2}</a>
                  </li>
                )}

            
              </span>

              {
                token && (
                  <div className="gi-pro-actions">
                    <button
                      onClick={() => handleToggleWishlist(data.id)}
                      className={
                        "gi-btn-group wishlist " +
                        (isInWishlist(data) ? "active" : "")
                      }
                      title="Wishlist"
                    >
                      <i className="fi-rr-heart"></i>
                    </button>
                    {/* <button
                  onClick={() => handleWishlist(data)}
                  className={
                    "gi-btn-group wishlist " +
                    (isInWishlist(data) ? "active" : "")
                  }
                  title="Wishlist"
                >
                  <i className="fi-rr-heart"></i>
                </button> */}
                    <button
                      className="gi-btn-group quickview gi-cart-toggle"
                      data-link-action="quickview"
                      title="Quick view"
                      data-bs-toggle="modal"
                      data-bs-target="#gi_quickview_modal"
                      onClick={handleShow}
                    >
                      <i className="fi-rr-eye"></i>
                    </button>
                    <button
                      onClick={() => handleCompareItem(data)}
                      className={
                        "gi-btn-group compare " +
                        (isInCompare(data) ? "active" : "")
                      }
                      title="Compare"
                    >
                      <i className="fi fi-rr-arrows-repeat"></i>
                    </button>
                    <button
                      title="Add To Cart"
                      className="gi-btn-group add-to-cart"
                      onClick={() => handleAddToCart(data)}
                    >
                      <i className="fi-rr-shopping-basket"></i>
                    </button>
                  </div>
                )
              }

              <div className="gi-pro-option">
                {data.color1 && data.color2 && data.color3 && (
                  <ul className="colors">
                    {data.color1 && (
                      <li className={`color-${data.color1}`}>
                        <a href=""></a>
                      </li>
                    )}
                    {data.color2 && (
                      <li className={`color-${data.color2}`}>
                        <a href=""></a>
                      </li>
                    )}
                    {data.color3 && (
                      <li className={`color-${data.color3}`}>
                        <a href=""></a>
                      </li>
                    )}
                  </ul>
                )}
                {data.size1 && data.size2 && (
                  <ul className="sizes">
                    {data.size1 && (
                      <li>
                        <a href="">{data.size1}</a>
                      </li>
                    )}
                    {data.size2 && (
                      <li>
                        <a href="">{data.size2}</a>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="gi-pro-content">
            <Link href="/shop-left-sidebar-col-3">
              <h6 className="gi-pro-stitle">{data.category}</h6>
            </Link>
            <h5 className="gi-pro-title">
              <Link href="/product-left-sidebar">{data.title}</Link>
            </h5>
            <p className="gi-info">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old.
            </p>
            <div className="gi-pro-rat-price">
              <span className="gi-pro-rating">
                <StarRating rating={data.rating} />
                <span className="qty">{data.weight}</span>
              </span>
              <span className="gi-price">
                <span className="new-price">${data.newPrice}.00</span>
                <span className="old-price">${data.oldPrice}.00</span>
              </span>
            </div>
          </div>
        </div>
        <QuickViewModal data={data} handleClose={handleClose} show={show} />
      </div>
    </>
  );
};

export default ItemCard;
