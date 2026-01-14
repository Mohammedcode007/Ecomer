// import useSwr from "swr";
// import { useEffect, useState } from "react";
// import { Col } from "react-bootstrap";
// import ItemCard from "./ItemCard";
// import { ProductContentType } from "../../types";
// import fetcher from "../fetcher-api/Fetcher";
// import Spinner from "../button/Spinner";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { fetchProductsByStatus } from "@/store/reducers/products/productsSlice";

// function ProductAll({
//   url,
//   onSuccess = () => {},
//   hasPaginate = false,
//   onError = () => {},
// }: ProductContentType) {
//   const { data, error } = useSwr(url, fetcher, {
//     onSuccess,
//     onError,
//     revalidateOnFocus: false,
//     dedupingInterval: 10000,
//   });

//   const [selected, setSelected] = useState(false);

//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     dispatch(fetchProductsByStatus({ type: "newArrivals", page: 1, limit: 10 }));
//   }, [dispatch]);
//   const { newArrivals } = useAppSelector(state => state.products.statusProducts);




//   const products = newArrivals?.products || [];
//   const handleClick = () => {
//     setSelected(!selected);
//   };

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
//       {getData().map((item: any, index: number) => (
//         <Col
//           key={index}
//           md={4}
//           className={`col-sm-6 gi-product-box gi-col-5 ${
//             selected ? "active" : ""
//           }`}
//           onClick={handleClick}
//         >
//           <ItemCard data={item} />
//         </Col>
//       ))}
//     </>
//   );
// }

// export default ProductAll;

import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import ItemCard from "./ItemCard";
import Spinner from "../button/Spinner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductsByStatus } from "@/store/reducers/products/productsSlice";
import { mapProductToItem } from "@/utility/Functions";

function ProductAll({
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}: any) {
  const dispatch = useAppDispatch();
  const { newArrivals } = useAppSelector(state => state.products.statusProducts);

  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(
          fetchProductsByStatus({ type: "newArrivals", page: 1, limit: 10 })
        ).unwrap();
        onSuccess();
      } catch (err) {
        onError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch,]);

  const products = newArrivals?.products || [];

  const handleClick = () => {
    setSelected(!selected);
  };

  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );

  if (!products.length) return <div>No products found</div>;

  return (
    <>
      {products.map((item: any, index: number) => (
        <Col
          key={index}
          md={4}
          className={`col-sm-6 gi-product-box gi-col-5 ${selected ? "active" : ""
            }`}
          onClick={handleClick}
        >
          <ItemCard data={mapProductToItem(item)} />

        </Col>
      ))}
    </>
  );
}

export default ProductAll;
