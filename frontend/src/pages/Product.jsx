import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency , addToCart  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(item => String(item._id) === String(productId));
      if (found) {
        setProductData(found);
        setImage(found.image?.[0] || "");
      }
    }
  }, [productId, products]);

  if (!productData) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading product...
      </div>
    );
  }

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* LEFT SIDE (Images) */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                alt={`thumbnail-${index}`}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="Selected product" />
          </div>
        </div>

        {/* RIGHT SIDE (Details) */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2 text-gray-600">(122)</p>
          </div>

          {/* Price */}
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          {/* Description */}
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Sizes */}
          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  className={`cursor-pointer border py-2 px-4 bg-gray-100 hover:bg-gray-200 transition ${item === size ? "border-orange-500":""}`}
                  key={index}
                  onClick={()=>setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer '>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original product</p>
              <p>Cash on delivery is available on this product</p>
              <p>Easy return exchange policy with in 7 days </p>
          </div>
        </div>
      </div>
          <div className="mt-20">
            <div className="flex">
              <b className='border px-5 py-3 text-sm'>Description</b>
              <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
            </div>
            <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
              <p>An e-commerce website is an online platform that facilitates buying and sales</p>
              <p>E-commerce websites typically display products or services along with detailed</p>
            </div>
          </div>

          <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>
    </div>
  ) : <div className="opacity-0"></div>
};

export default Product;
