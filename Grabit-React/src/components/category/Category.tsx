
"use client";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CategoryItem from "../product-item/CategoryItem";
import useSWR from "swr";
import fetcher from "../fetcher-api/Fetcher";
import Spinner from "../button/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchCategories } from "@/store/reducers/categories/categoriesSlice";

const Category = ({
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
  className = "padding-tb-40",
}) => {
  const { direction } = useSelector((state: RootState) => state.theme);

  const dispatch = useAppDispatch();

  const { categories, loading, error } = useAppSelector(
    state => state.categories
  );

  // جلب الفئات عند تحميل الكومبوننت
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // فئات رئيسية فقط
  const mainCategories = categories.filter(
    (cat: any) => !cat.parent && !cat.parentId
  );
  console.log(mainCategories.length);

  if (error) return <div>Failed to load products</div>;
  if (!categories)
    return (
      <div>
        <Spinner />
      </div>
    );



  return (
    <section className={`gi-category body-bg ${className}`}>
      <div className="container">
        <Row className="m-b-minus-15px">
          <Col xl={12}>
            <Swiper
              dir={direction == "RTL" ? "rtl" : "ltr"}
              loop={true}
              autoplay={{ delay: 1000 }}
              slidesPerView={5}
              spaceBetween={20}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                320: {
                  slidesPerView: 1,
                },
                425: {
                  slidesPerView: 2,
                },
                767: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
                1440: {
                  slidesPerView: 6,
                },
              }}
              className={`gi-category-block owl-carousel  ${direction == "RTL" ? "rtl" : "ltr"}`}
            >
              {mainCategories.map((item: any) => (
                <SwiperSlide key={item._id} className={`gi-cat-box gi-cat-box-${item.num}`}
                >
                  <CategoryItem data={item} />
                </SwiperSlide>
              ))}

            </Swiper>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Category;
