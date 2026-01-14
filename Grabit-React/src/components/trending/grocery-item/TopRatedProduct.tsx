

import { Fade } from "react-awesome-reveal";
import { Col } from "react-bootstrap";
import Slider from "react-slick";
import TrendingItem from "../trendingItem/TrendingItem";
import useSWR from "swr";
import fetcher from "../../fetcher-api/Fetcher";
import Spinner from "@/components/button/Spinner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchProductsByStatus } from "@/store/reducers/products/productsSlice";
import { mapProductToItem } from "@/utility/Functions";

const SellingProduct = ({
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}) => {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductsByStatus({ type: "topRated", page: 1, limit: 10 }));
  }, [dispatch]);
  const { topRated, error } = useAppSelector(state => state.products.statusProducts);

console.log(topRated,'7777777777');



  const products = topRated?.products || [];


  if (error) return <div>Failed to load products</div>;
  if (!topRated)
    return (
      <div>
        <Spinner />
      </div>
    );

  const settings = {
    dots: false,
  infinite: products.length > 3, // فقط إذا لديك 3 منتجات أو أكثر
    rows: 3,
    arrows: true,
    autoplay: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          rows: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          rows: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          rows: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          rows: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          rows: 2,
        },
      },
    ],
  };

  return (
    <>
      <Col
        xl={3}
        lg={6}
        md={6}
        sm={12}
        className="col-xs-6 gi-all-product-content gi-new-product-content mt-1199-40 wow fadeInUp"
      >
        <Fade triggerOnce direction="up" delay={800}>
          <Col md={12}>
            <div className="section-title">
              <div className="section-detail">
                <h2 className="gi-title">
                  Top <span>Rated</span>
                </h2>
              </div>
            </div>
          </Col>
          <Slider {...settings} className="gi-trending-slider">
            {products.map((item: any, index: number) => (

              <TrendingItem key={index} data={mapProductToItem(item)} />

            ))}
          </Slider>
        </Fade>
      </Col>
    </>
  );
};

export default SellingProduct;
