import Link from "next/link";
import React from "react";

const CategoryItem = ({ data }) => {
  return (
    <div className="gi-cat-icon">
      <span className="gi-lbl">"30%"</span>
      {
        data.icon ?       <i className={data.icon}></i> :       <i className="fi fi-rr-apps"></i>
      }
      <div className="gi-cat-detail">
        <Link href="/shop-left-sidebar-col-3">
          <h4 className="gi-cat-title">{data.name}</h4>
        </Link>
        <p className="items">{data.productsCount} Items</p>
      </div>
    </div>
  );
};

export default CategoryItem;
