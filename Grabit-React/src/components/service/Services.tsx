// "use client";
// import { Row } from "react-bootstrap";
// import { Fade } from "react-awesome-reveal";
// import useSWR from "swr";
// import fetcher from "../fetcher-api/Fetcher";
// import Spinner from "../button/Spinner";
// import { useAppSelector } from "@/store/hooks";

// const Services = ({
//   onSuccess = () => { },
//   hasPaginate = false,
//   onError = () => { },
// }) => {
//   const { data, error } = useSWR("/api/groceryservice", fetcher, {
//     onSuccess,
//     onError,
//   });
//     const { data:realData, loading } = useAppSelector(
//       (state) => state.homepage
//     );

//   if (error) return <div>Failed to load products</div>;
//   if (!data)
//     return (
//       <div>
//         <Spinner />
//       </div>
//     );

//   const getData = () => {
//     if (hasPaginate) return data.data;
//     else return data;
//   };
//   return (
//     <>
//       <section className="gi-service-section padding-tb-40">
//         <div className="container">
//           <Row className=" m-tb-minus-12">
//             {getData().map((item: any, index: number) => (
//               <Fade
//                 triggerOnce
//                 direction="up"
//                 delay={400}
//                 key={index}
//                 className="gi-ser-content gi-ser-content-2 col-sm-6 col-md-6 col-lg-3 p-tp-12 wow fadeInUp">
//                 <div className="gi-ser-inner" key={index}>
//                   <div className="gi-service-image">
//                     <i className={item.icon}></i>
//                   </div>
//                   <div className="gi-service-desc">
//                     <h3>{item.name}</h3>
//                     <p>{item.title}</p>
//                   </div>
//                 </div>
//               </Fade>
//             ))}
//           </Row>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Services;

"use client";
import { Row, Col } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import { useAppSelector } from "@/store/hooks";
import Spinner from "../button/Spinner";

const Services = () => {
  const { data: homepageData, loading } = useAppSelector(
    (state) => state.homepage
  );

  if (loading || !homepageData) return <Spinner />;

  const features = homepageData.features || [];

  return (
    <section className="gi-service-section padding-tb-40">
      <div className="container">
        <Row className="m-tb-minus-12">
          {features.map((feature, index) => (
            <Col
              key={feature._id}
              sm={6}
              md={6}
              lg={3}
              className="p-tp-12"
            >
              <Fade
                triggerOnce
                direction="up"
                delay={index * 200} // تأثير متدرج لكل ميزة
              >
                <div className="gi-ser-content gi-ser-content-2">
                  <div className="gi-ser-inner text-center">
                    <div className="gi-service-image mb-3">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        style={{ width: "60px", height: "60px" }}
                      />
                    </div>
                    <div className="gi-service-desc">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                </div>
              </Fade>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Services;
