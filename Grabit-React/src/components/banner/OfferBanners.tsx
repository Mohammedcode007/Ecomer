"use client";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { Row } from "react-bootstrap";

const OfferBanners = () => {
  const { data: homepageData, loading } = useAppSelector(
    (state) => state.homepage
  );

  if (loading || !homepageData) return null;
  return (
    <>
      <section className="gi-offer-section padding-tb-40">
        <div className="container">
          {/* <!--  Offer banners --> */}
          <Row>
            <Fade
              triggerOnce
              direction="left"
              duration={2000}
              className="col-md-6 wow fadeInLeft"
              data-wow-duration="2s"
            >
              <div className="gi-ofr-banners"   >
                <div className="gi-bnr-body">
                  <div className="gi-bnr-img">
                    <span className="lbl">{homepageData.promoSections[0].discountPercentage} Off</span>
                    <img
                      src={homepageData.promoSections[0].image}
                      alt="banner"
                    />
                  </div>
                  <div className="gi-bnr-detail">
                     <h5>{homepageData.promoSections[0].title}
                    </h5>
                    <p>{homepageData.promoSections[0].description}
                    </p>
                    <a href="/shop-left-sidebar-col-3" className="gi-btn-2">
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </Fade>
            <Fade
              triggerOnce
              direction="right"
              duration={2000}
              className="col-md-6 wow fadeInRight"
              data-wow-duration="2s"
            >
              <div className="gi-ofr-banners m-t-767">
                <div className="gi-bnr-body">
                  <div className="gi-bnr-img">
                    <span className="lbl">{homepageData.promoSections[1].discountPercentage} Off</span>
                    <img
                      src={homepageData.promoSections[1].image}

                      alt="banner"
                    />
                  </div>
                  <div className="gi-bnr-detail">
                    <h5>{homepageData.promoSections[1].title}
                    </h5>
                    <p>{homepageData.promoSections[1].description}
                    </p>
                    <Link href="/shop-left-sidebar-col-3" className="gi-btn-2">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </Fade>
          </Row>
        </div>
      </section>
    </>
  );
};

export default OfferBanners;

// "use client";
// import { useAppSelector } from "@/store/hooks";
// import Link from "next/link";
// import { Fade } from "react-awesome-reveal";
// import { Row, Col } from "react-bootstrap";

// const OfferBanners = () => {
//   const { data: homepageData, loading } = useAppSelector(
//     (state) => state.homepage
//   );

//   if (loading || !homepageData) return null;

//   return (
//     <section className="gi-offer-section padding-tb-40">
//       <div className="container">
//         <Row>
//           {homepageData.promoSections?.map((promo, index) => (
//             <Col md={6} key={promo._id} className="mb-4">
//               <Fade
//                 triggerOnce
//                 direction={index % 2 === 0 ? "left" : "right"}
//                 duration={2000}
//               >
//                 <div
//                   className="gi-ofr-banners"
//                   style={{
//                     backgroundImage: `url(${promo.image})`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                     borderRadius: "12px",
//                     position: "relative",
//                     minHeight: "250px",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div
//                     className="gi-bnr-detail"
//                     style={{
//                       backgroundColor: "rgba(0,0,0,0.3)", // خلفية شفافة للنصوص
//                       padding: "20px",
//                       borderRadius: "10px",
//                       color: "#fff",
//                       marginLeft: "20px",
//                       maxWidth: "80%",
//                     }}
//                   >
//                     <span className="lbl" style={{ fontSize: "1.2rem" }}>
//                       {promo.title}
//                     </span>
//                     <h5 style={{ marginTop: "10px" }}>{promo.title}</h5>
//                     <p>{promo.description}</p>
//                     <Link
//                       href="/shop-left-sidebar-col-3"
//                       className="gi-btn-2"
//                       style={{ marginTop: "10px", display: "inline-block" }}
//                     >
//                       Shop Now
//                     </Link>
//                   </div>
//                 </div>
//               </Fade>
//             </Col>
//           ))}
//         </Row>
//       </div>
//     </section>
//   );
// };

// export default OfferBanners;

