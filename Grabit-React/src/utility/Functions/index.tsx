interface Item {
  id: number;
  title: string;
  newPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  oldPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
    sizes?: { size: string; stock: number; _id: string }[]; // ← الحجم اختياري

}


export function mapProductToItem(product: any): Item {
  return {
    id: product._id,
    title: product.name,
    newPrice: product.price,
    waight: product.sizes?.[0]?.size || '',      // أخذ أول حجم متاح
    image: product.images?.[0] || '',            // الصورة الرئيسية
    imageTwo: product.images?.[1] || '',         // الصورة الثانية
    date: product.createdAt,
    status: product.trendingItems ? "trending" :
            product.topSelling ? "topSelling" :
            product.topRated ? "topRated" :
            product.newArrivals ? "newArrival" :
            product.dealOfTheDay ? "dealOfTheDay" : "normal",
    rating: product.ratingsAverage,
    oldPrice: product.priceBeforeDiscount,
    location: "",       // لا يوجد حقل location في المنتج الأصلي، يمكن تركه فارغ
    brand: "",          // لا يوجد حقل brand في المنتج الأصلي
    sku: product._id,
    category: product.category?.name || "",
    quantity: product.stockQuantity,
    sizes: product.sizes?.length ? product.sizes : undefined, // ← إضافة الحجم الاختياري

  };
}