// "use client";
// import React, { useEffect, useState } from "react";
// import home from "../../../../utility/header/home";
// import classic from "../../../../utility/header/classic";
// import banner from "../../../../utility/header/benner";
// import column from "../../../../utility/header/columns";
// import list from "../../../../utility/header/list";
// import blog from "../../../../utility/header/blog";
// import pages from "../../../../utility/header/pages";
// import fruits from "../../../../utility/header/fruits";
// import bakery from "../../../../utility/header/bakery";
// import snacks from "../../../../utility/header/snacks";
// import spice from "../../../../utility/header/spice";
// import juice from "../../../../utility/header/juice";
// import softdrink from "../../../../utility/header/softdrink";
// import Link from "next/link";
// import productpage from "../../../../utility/header/productpage";
// import CurrentLocation from "./CurrentLocation";
// import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
// import { Fade } from "react-awesome-reveal";
// import { fetchCategories } from "@/store/reducers/categories/categoriesSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";

// function HeaderManu() {
//   const [selectedIndex, setSelectedIndex] = useState(0);

// const dispatch = useAppDispatch();

// const { categories, loading, error } = useAppSelector(
//   state => state.categories
// );
// console.log(categories);


//   // جلب الفئات الرئيسية عند تحميل الصفحة
//   useEffect(() => {
//     dispatch(fetchCategories())
//   }, [dispatch])
//   const handleProductClick = (index: number) => {
//     setSelectedIndex(index);
//   };
//   return (
//     <>
//       <div className="gi-header-cat d-none d-lg-block">
//         <div className="container position-relative">
//           <div className="gi-nav-bar">
//             {/* <!-- Category Toggle --> */}
//             <Tabs
//               selectedIndex={selectedIndex}
//               onSelect={(selectedIndex) => setSelectedIndex(selectedIndex)}
//               className="gi-category-icon-block"
//             >
//               <div className="gi-category-menu">
//                 <div className="gi-category-toggle">
//                   <i className="fi fi-rr-apps"></i>
//                   <span className="text">All Categories</span>
//                   <i
//                     className="fi-rr-angle-small-down d-1199 gi-angle"
//                     aria-hidden="true"
//                   ></i>
//                 </div>
//               </div>
//               <div className="gi-cat-dropdown">
//                 <div className="gi-cat-block">
//                   <div className="gi-cat-tab">
//                     <TabList>
//                       <div
//                         className="gi-tab-list nav flex-column nav-pills me-3"
//                         id="v-pills-tab"
//                         role="tablist"
//                         aria-orientation="vertical"
//                       >
//                         <Tab>
//                           <button
//                             className={`tab nav-link ${
//                               selectedIndex == 0 ? "active" : ""
//                             }`}
//                             onClick={() => handleProductClick(0)}
//                             key={"Dairy & Bakery"}
//                             id="v-pills-home-tab"
//                             data-bs-toggle="pill"
//                             data-bs-target="#v-pills-home"
//                             type="button"
//                             role="tab"
//                             aria-controls="v-pills-home"
//                             aria-selected="true"
//                             style={{
//                               padding: "10px 50px 10px 20px",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <i className="fi-rr-cupcake"></i>Dairy & Bakery
//                           </button>
//                         </Tab>
//                         <Tab>
//                           <button
//                             className={`nav-link ${
//                               selectedIndex == 1 ? "active" : ""
//                             }`}
//                             onClick={() => handleProductClick(1)}
//                             key={"Fruits & Vegetable"}
//                             id="v-pills-profile-tab"
//                             data-bs-toggle="pill"
//                             data-bs-target="#v-pills-profile"
//                             type="button"
//                             role="tab"
//                             aria-controls="v-pills-profile"
//                             aria-selected="false"
//                             style={{
//                               padding: "10px 22px",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <i className="fi fi-rs-apple-whole"></i>Fruits &
//                             Vegetable
//                           </button>
//                         </Tab>
//                         <Tab>
//                           <button
//                             className={`nav-link ${
//                               selectedIndex == 2 ? "active" : ""
//                             }`}
//                             onClick={() => handleProductClick(2)}
//                             key={"Snack & Spice"}
//                             id="v-pills-messages-tab"
//                             data-bs-toggle="pill"
//                             data-bs-target="#v-pills-messages"
//                             type="button"
//                             role="tab"
//                             aria-controls="v-pills-messages"
//                             aria-selected="false"
//                             style={{
//                               padding: "10px 50px 10px 20px",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <i className="fi fi-rr-popcorn"></i>Snack & Spice
//                           </button>
//                         </Tab>
//                         <Tab>
//                           <button
//                             className={`nav-link ${
//                               selectedIndex == 3 ? "active" : ""
//                             }`}
//                             onClick={() => handleProductClick(3)}
//                             key={"Juice & Drinks"}
//                             id="v-pills-settings-tab"
//                             data-bs-toggle="pill"
//                             data-bs-target="#v-pills-settings"
//                             type="button"
//                             role="tab"
//                             aria-controls="v-pills-settings"
//                             aria-selected="false"
//                             style={{
//                               padding: "10px 50px 10px 20px",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <i className="fi fi-rr-drink-alt"></i>Juice & Drinks{" "}
//                           </button>
//                         </Tab>
//                       </div>
//                     </TabList>
//                     <div className="tab-content" id="v-pills-tabContent">
//                       <Fade duration={500} delay={200}>
//                         <TabPanel
//                           className={`tab-pane fade ${
//                             selectedIndex === 0
//                               ? "show active product-block"
//                               : ""
//                           }`}
//                           role="tabpanel"
//                           aria-labelledby="v-pills-home-tab"
//                         >
//                           <div className="tab-list row">
//                             <div className="col">
//                               <h6 className="gi-col-title">Dairy</h6>
//                               <ul className="cat-list">
//                                 {fruits.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div className="col">
//                               <h6 className="gi-col-title">Bakery</h6>
//                               <ul className="cat-list">
//                                 {bakery.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </TabPanel>
//                       </Fade>
//                       <Fade duration={500} delay={200}>
//                         <TabPanel
//                           className={`tab-pane fade ${
//                             selectedIndex === 1
//                               ? "show active product-block"
//                               : ""
//                           }`}
//                           role="tabpanel"
//                           aria-labelledby="v-pills-profile-tab"
//                         >
//                           <div className="tab-list row">
//                             <div className="col">
//                               <h6 className="gi-col-title">Fruits</h6>
//                               <ul className="cat-list">
//                                 {fruits.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div className="col">
//                               <h6 className="gi-col-title">Vegetable</h6>
//                               <ul className="cat-list">
//                                 {fruits.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </TabPanel>
//                       </Fade>
//                       <Fade duration={500} delay={200}>
//                         <TabPanel
//                           className={`tab-pane fade ${
//                             selectedIndex === 2
//                               ? "show active product-block"
//                               : ""
//                           }`}
//                           id="v-pills-messages"
//                           role="tabpanel"
//                           aria-labelledby="v-pills-messages-tab"
//                         >
//                           <div className="tab-list row">
//                             <div className="col">
//                               <h6 className="gi-col-title">Snacks</h6>
//                               <ul className="cat-list">
//                                 {snacks.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div className="col">
//                               <h6 className="gi-col-title">Spice</h6>
//                               <ul className="cat-list">
//                                 {spice.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </TabPanel>
//                       </Fade>
//                       <Fade duration={500} delay={200}>
//                         <TabPanel
//                           className={`tab-pane fade ${
//                             selectedIndex === 3
//                               ? "show active product-block"
//                               : ""
//                           }`}
//                           id="v-pills-settings"
//                           role="tabpanel"
//                           aria-labelledby="v-pills-settings-tab"
//                         >
//                           <div className="tab-list row">
//                             <div className="col">
//                               <h6 className="gi-col-title">Juice</h6>
//                               <ul className="cat-list">
//                                 {juice.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div className="col">
//                               <h6 className="gi-col-title">soft drink</h6>
//                               <ul className="cat-list">
//                                 {softdrink.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </TabPanel>
//                       </Fade>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Tabs>

//             {/* <!-- Main Menu Start --> */}
//             <div
//               id="gi-main-menu-desk"
//               className="d-none d-lg-block sticky-nav"
//             >
//               <div className="nav-desk">
//                 <div className="row">
//                   <div className="col-md-12 align-self-center">
//                     <div className="gi-main-menu">
//                       <ul>
//                         <li className="dropdown drop-list">
//                           <Link href="/" className="dropdown-arrow">
//                             Home<i className="fi-rr-angle-small-right"></i>
//                           </Link>
//                           <ul className="sub-menu">
//                             {home.map((data, index) => (
//                               <li key={index}>
//                                 <Link href={data.href}>{data.name}</Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </li>
//                         <li className="dropdown drop-list position-static">
//                           <Link href="" className="dropdown-arrow">
//                             Categories
//                             <i className="fi-rr-angle-small-right"></i>
//                           </Link>
//                           <ul className="mega-menu d-block">
//                             <li className="d-flex">
//                               <span className="bg"></span>
//                               <ul className="d-block mega-block">
//                                 <li className="menu_title">
//                                   <Link href="/">Classic</Link>
//                                 </li>
//                                 {classic.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                               <ul className="d-block mega-block">
//                                 <li className="menu_title">
//                                   <Link href="">Banner</Link>
//                                 </li>
//                                 {banner.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                               <ul className="d-block mega-block">
//                                 <li className="menu_title">
//                                   <Link href="">Columns</Link>
//                                 </li>
//                                 {column.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                               <ul className="d-block mega-block">
//                                 <li className="menu_title">
//                                   <Link href="">List</Link>
//                                 </li>
//                                 {list.map((data, index) => (
//                                   <li key={index}>
//                                     <Link href={data.href}>{data.name}</Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </li>
//                           </ul>
//                         </li>
//                         <li className="dropdown drop-list">
//                           <Link href="" className="dropdown-arrow">
//                             Products<i className="fi-rr-angle-small-right"></i>
//                           </Link>
//                           <ul className="sub-menu">
//                             {productpage.map((data, index) => (
//                               <li
//                                 key={index}
//                                 className="dropdown position-static"
//                               >
//                                 <Link href="">
//                                   {data.name}
//                                   <i className="fi-rr-angle-small-right"></i>
//                                 </Link>
//                                 <ul className="sub-menu sub-menu-child">
//                                   {data.subname.map((subPage, subIndex) => (
//                                     <React.Fragment key={subIndex}>
//                                       <li>
//                                         <Link href={subPage.href}>
//                                           {subPage.name}
//                                         </Link>
//                                       </li>
//                                     </React.Fragment>
//                                   ))}
//                                 </ul>
//                               </li>
//                             ))}
//                             <li>
//                               <a href="/product-full-width">
//                                 Product full width
//                               </a>
//                             </li>
//                             <li>
//                               <a href="/product-according-full-width">
//                                 accordion full width
//                               </a>
//                             </li>
//                           </ul>
//                         </li>
//                         <li className="dropdown drop-list">
//                           <Link href="" className="dropdown-arrow">
//                             Blog<i className="fi-rr-angle-small-right"></i>
//                           </Link>
//                           <ul className="sub-menu">
//                             {blog.map((data, index) => (
//                               <li key={index}>
//                                 <Link href={data.href}>{data.name}</Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </li>
//                         <li className="dropdown drop-list">
//                           <Link href="" className="dropdown-arrow">
//                             Pages<i className="fi-rr-angle-small-right"></i>
//                           </Link>
//                           <ul className="sub-menu">
//                             {pages.map((data, index) => (
//                               <li key={index}>
//                                 <Link href={data.href}>{data.name}</Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </li>
//                         <li className="non-drop">
//                           <Link href="/banner-left-sidebar-col-3">
//                             <i className="fi-rr-badge-percent"></i>Offers
//                           </Link>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <!-- Main Menu End --> */}

//             <CurrentLocation />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default HeaderManu;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { Fade } from "react-awesome-reveal";

import CurrentLocation from "./CurrentLocation";
import { fetchCategories } from "@/store/reducers/categories/categoriesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function HeaderManu() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    state => state.categories
  );

  // جلب الفئات عند تحميل الهيدر
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return null;
  if (error) return null;

  return (
    <div className="gi-header-cat d-none d-lg-block">
      <div className="container position-relative">
        <div className="gi-nav-bar">

          {/* ================= Categories Dropdown ================= */}
          <Tabs
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index)}
            className="gi-category-icon-block"
          >
            <div className="gi-category-menu">
              <div className="gi-category-toggle">
                <i className="fi fi-rr-apps"></i>
                <span className="text">All Categories</span>
                <i className="fi-rr-angle-small-down gi-angle"></i>
              </div>
            </div>

            <div className="gi-cat-dropdown">
              <div className="gi-cat-block">
                <div className="gi-cat-tab">

                  {/* ================= Tab List (Main Categories) ================= */}
                  <TabList>
                    <div className="gi-tab-list nav flex-column nav-pills me-3">
                      {categories.map((category, index) => (
                        <Tab key={category._id}>
                          <button
                            className={`tab nav-link ${selectedIndex === index ? "active" : ""
                              }`}
                            onClick={() => setSelectedIndex(index)}
                            style={{
                              padding: "10px 40px 10px 20px",
                              marginBottom: "10px",
                              width: "220px"
                            }}
                          >
                            {
                              category.icon ? <i className={category.icon}></i> : <i className="fi fi-rr-apps"></i>
                            }

                            {category.name}
                          </button>
                        </Tab>
                      ))}
                    </div>
                  </TabList>

                  {/* ================= Tab Panels (Sub Categories) ================= */}
                  <div className="tab-content">
                    {categories.map((category, index) => (
                      <Fade key={category._id} duration={400}>
                        <TabPanel
                          className={`tab-pane fade ${selectedIndex === index
                              ? "show active product-block"
                              : ""
                            }`}
                        >
                          <div className="tab-list row">
                            <div className="col">
                              <h6 className="gi-col-title">
                                {category.name}
                              </h6>

                              <ul className="cat-list">
                                {category.subCategories &&
                                  category.subCategories.length > 0 ? (
                                  category.subCategories.map(sub => (
                                    <li key={sub._id}>
                                      <Link
                                        href={{
                                          pathname: "/shop-left-sidebar-col-3",
                                          query: { subCategoryId: sub._id }
                                        }}
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-muted">
                                    لا توجد فئات فرعية
                                  </li>
                                )}
                                {/* {category.subCategories &&
                                category.subCategories.length > 0 ? (
                                  category.subCategories.map(sub => (
                                    <li key={sub._id}>
                                      <Link
                                        href={`/category/${sub._id}`}
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-muted">
                                    لا توجد فئات فرعية
                                  </li>
                                )} */}
                              </ul>
                            </div>
                          </div>
                        </TabPanel>
                      </Fade>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </Tabs>

          {/* ================= Main Menu ================= */}
          <div
            id="gi-main-menu-desk"
            className="d-none d-lg-block sticky-nav"
          >
            <div className="nav-desk">
              <div className="gi-main-menu">
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>

                  <li className="dropdown drop-list position-static">
                    <Link href="#" className="dropdown-arrow">
                      Categories
                      <i className="fi-rr-angle-small-right"></i>
                    </Link>

                    <ul className="mega-menu d-block">
                      <li className="d-flex">
                        <ul className="mega-block">
                          <li className="menu_title">All Categories</li>
                          {categories.map(category => (
                            <li key={category._id}>
                              <Link href={`/category/${category._id}`}>
                                {category.name}
                              </Link>
                            </li>
                          ))}


                        </ul>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link href="/offers">
                      <i className="fi-rr-badge-percent"></i> Offers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <CurrentLocation />
        </div>
      </div>
    </div>
  );
}

export default HeaderManu;
