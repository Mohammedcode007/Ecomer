// "use client";
// import Link from "next/link";
// import React from "react";
// import { Fade } from "react-awesome-reveal";
// import { Col, Row } from "react-bootstrap";

// const Banner = () => {
//   return (
//     <Fade triggerOnce direction="up" duration={2000} delay={200}>
//       <section
//         className="gi-banner padding-tb-40 wow fadeInUp"
//         data-wow-duration="2s"
//       >
//         <div className="container">
//           <Row>
//             <Col md={12}>
//               <div
//                 className="gi-animated-banner"
//                 data-aos="fade-up"
//                 data-aos-duration="2000"
//                 data-aos-delay="200"
//               >
//                 <h2 className="d-none">Offers</h2>
//                 <div className="gi-bnr-detail">
//                   <div className="gi-bnr-info">
//                     <h2>
//                       Fresh Fruits <br></br>Healthy Products
//                     </h2>
//                     <h3>
//                       30% off sale <span>Hurry up!!!</span>
//                     </h3>
//                     <Link href="/shop-left-sidebar-col-3" className="gi-btn-2">
//                       Shop now
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </section>
//     </Fade>
//   );
// };

// export default Banner;

"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";

const HeroBanner = () => {
  const { data: homepageData, loading } = useAppSelector(
    (state) => state.homepage
  );

  if (loading || !homepageData) return null;

  // نفترض أن Hero Banner هو أول عنصر في sections أو heroSection
  const hero = homepageData.sections?.[0] || homepageData.heroSection?.[0];
  if (!hero) return null;

  return (
          <div className="container">

    <section
      className="hero-banner"
      style={{
        backgroundImage: `url(${hero.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        padding: "100px 0", // ارتفاع مناسب للـ Hero
      }}
    >
      <div className="container">
        <Row className="justify-content-start">
          <Col lg={6} md={8} sm={12}>
            <Fade triggerOnce direction="up" duration={2000} delay={200}>
              <div
                style={{
                  padding: "30px",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              >
                {/* العنوان */}
                {hero.title && (
                  <h1
                    dangerouslySetInnerHTML={{ __html: hero.title || "" }}
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "15px",
                    }}
                  />
                )}

                {/* الوصف */}
                {hero.description && (
                  <p
                    dangerouslySetInnerHTML={{ __html: hero.description || "" }}
                    style={{
                      fontSize: "1.2rem",
                      marginBottom: "20px",
                    }}
                  />
                )}

                  <Link
                    href=""
                    className="gi-btn-2"
                    style={{ fontWeight: "bold" }}
                  >
                    Shop Now
                  </Link>
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
    </section>
          </div>

  );
};

export default HeroBanner;
