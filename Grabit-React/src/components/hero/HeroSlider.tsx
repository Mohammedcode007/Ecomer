
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { useEffect } from "react";
import { fetchHomepage } from "@/store/reducers/homepage/homepageSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function HeroSlider() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) => state.homepage
  );

  useEffect(() => {
    dispatch(fetchHomepage());
  }, [dispatch]);

  if (loading) return null;
  if (error) return null;

  return (
    <section className="section gi-hero m-tb-40">
      <div className="container">
        <div className="gi-main-content">
          <div className="gi-slider-content">
            <div className="gi-main-slider">
              <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination, Autoplay]}
                loop
                speed={2000}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                slidesPerView={1}
                className="gi-slider main-slider-dot"
              >
                {data?.heroSection?.map((slide, index) => (
                  <SwiperSlide
                    key={index}
                    className="gi-slide-item d-flex"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="gi-slide-content slider-animation">
                       <p>
                        {slide.title}
                        </p>
                        <h1 className="gi-slide-title">
                        {slide.description}
                        </h1>
                      <div className="gi-slide-btn">
                        <Link href="/shop" className="gi-btn-1">
                          Shop Now
                          <i className="fi-rr-angle-double-small-right" />
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
