"use client";
import { Col, Row } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import TrendingProduct from "./grocery-item/TrendingProduct";
import TopRatedProduct from "./grocery-item/TopRatedProduct";
import SellingProduct from "./grocery-item/SellingProduct";
import { useAppSelector } from "@/store/hooks";

const Trending = () => {
    const { data:realData, loading } = useAppSelector(
      (state) => state.homepage
    );
      const textImage = realData?.textImageSections?.[0];

  return (
    <div>
      <section className="gi-offer-section padding-tb-40">
        <div className="container">
          <Row>
            {/* <!-- Banner --> */}
            <Col
              xl={3}
              lg={6}
              md={6}
              sm={12}
              className="col-xs-6 gi-all-product-content gi-new-product-content wow fadeInUp"
            >
              <Fade triggerOnce direction="up" className="gi-banner-inner">
                <div className="gi-banner-block gi-banner-block-1"   style={{
                    backgroundImage: `url(${textImage?.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                    padding: "20px",
                    color: "#fff",
                  }}>
                  <div className="banner-block">
                    <div className="banner-content">
                      <div className="banner-text">
                        <span className="gi-banner-title">
                          {realData?.textImageSections[0].description}
                        </span>
                      </div>
                      <a href="/shop-left-sidebar-col-3" className="gi-btn-2">
                        Shop Now
                      </a>
                    </div>
                  </div>
                </div>
              </Fade>
            </Col>
            {/* <!-- Trending --> */}
            
              <TrendingProduct />

            {/* <!-- Top Rated --> */}
            
              <TopRatedProduct />

            {/* <!-- Top Selling --> */}
            
              <SellingProduct />
          </Row>
        </div>
      </section>
    </div>
  );
};

export default Trending;
