import Image from "next/image";
import Link from "next/link";
import BreadCrumb from "@/components/BreadCrumb";
import Service from "@/components/Service";
import { CiInstagram, CiLinkedin, CiFacebook } from "react-icons/ci";
import ShortSec from "@/components/ShortSec";
import { getProductById, getFeaturedProduct } from "@/sanity/queries/FetchProduct";
import AddTocartDynamicPage from "@/components/AddToCartDynamicPage";
import { Metadata } from "next";

interface ProductDetailProps {
  params: { productid: string };
}

export async function generateMetadata({ params }: ProductDetailProps): Promise<Metadata> {
  const { productid } = params;
  const product = await getProductById(productid);

  return {
    title: product ? `${product.name} - Product Page` : "Product Not Found",
    description: product ? product.description : "This product does not exist.",
  };
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { productid } = params;

  if (!productid) {
    return <div className="text-center text-red-500">Invalid product ID</div>;
  }

  const product = await getProductById(productid);
  const featuredData = (await getFeaturedProduct()) || [];

  if (!product) {
    return <div className="text-center text-gray-500">Product not found</div>;
  }

  return (
    <div>
      <BreadCrumb title="Product Page" url="/" />
      <div className="mx-auto px-4 py-8">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full max-w-md mx-auto sm:max-w-none">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="responsive"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                height={400}
                width={400}
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-semibold">{product.name}</h1>
            <p className="text-xl text-gray-700">Rs. {product.price}.00</p>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-lg">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.rating} Customer Reviews)</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Add to Cart */}
            <AddTocartDynamicPage
              product={{
                id: product._id,
                name: product.name,
                image: product.imageUrl,
                price: product.price,
                quantity: 1,
                stock: product.stockLevel || 0,
              }}
            />

            {/* Product Metadata */}
            <div className="space-y-2 pt-4 border-t text-sm text-gray-600">
              <div className="flex justify-between"><span>SKU</span><span>{product._id}</span></div>
              <div className="flex justify-between"><span>Category</span><span>{product.category}</span></div>
              <div className="flex justify-between"><span>Tags</span><span>{(product.tags || []).join(", ")}</span></div>
              <div className="flex justify-between">
                <span>Share</span>
                <div className="flex gap-2">
                  <Link href="#" className="text-lg text-blue-600"><CiFacebook /></Link>
                  <Link href="#" className="text-lg text-blue-500"><CiLinkedin /></Link>
                  <Link href="#" className="text-lg text-pink-500"><CiInstagram /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShortSec
        title="More Products"
        description="Find a bright ideal to suit your taste with our great selection of suspension, floor and table lights"
        cardData={featuredData}
      />
      <Service />
    </div>
  );
}
