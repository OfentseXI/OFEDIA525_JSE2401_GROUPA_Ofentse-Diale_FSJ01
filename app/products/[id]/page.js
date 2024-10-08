"use client";

import { useState, useEffect } from 'react';
import Loading from '@/app/loading';
import Link from 'next/link';
import ErrorPage from '@/app/error'; 

/**
 * Fetch product details from the API.
 *
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Object>} A promise that resolves to the product details.
 * @throws {Error} Throws an error if the fetch request fails.
 */
async function fetchProductDetails(id) {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
}

/**
 * ProductDetails component to display detailed information about a single product.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters from the URL.
 * @param {string} props.params.id - The ID of the product to display details for.
 * @returns {JSX.Element} The rendered ProductDetails component.
 */
export default function ProductDetails({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null); // State to store product details
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error status
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image index
  const [reviewsVisible, setReviewsVisible] = useState(false); // State to toggle reviews visibility

  /**
   * Fetch product details when the component mounts or the product ID changes.
   */
  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true); // Set loading to true while fetching data
      setError(null); // Reset error state before fetching
      try {
        const productData = await fetchProductDetails(id);
        setProduct(productData); // Update product state with fetched data
      } catch (err) {
        setError('Failed to load product details. Please try again later.'); // Update error state on failure
      } finally {
        setLoading(false); // Disable loading state after fetching is complete
      }
    };
    loadProductDetails();
  }, [id]); // Dependency array to refetch product details when the ID changes

  if (loading) {
    return <Loading />; // Show loading spinner while data is being fetched
  }

  if (error) {
    return <ErrorPage message={error} />; // Show error page if there's an error
  }

  /**
   * Handle image navigation to the next image.
   */
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  /**
   * Handle image navigation to the previous image.
   */
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Image Section */}
              <div className="flex-1 relative">
                <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-gray-100">
                  <span
                    className={`absolute top-2 left-2 px-3 py-1 text-m text-white rounded-md ${
                      product.stock > 0 ? "bg-indigo-600" : "bg-red-500"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                  <img
                    className="object-contain w-full h-full"
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                  />
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
                  >
                    {/* Left Arrow SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-800"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
                  >
                    {/* Right Arrow SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-800"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>

                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer p-1 border rounded-md ${
                          index === currentImageIndex
                            ? 'border-indigo-600'
                            : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          className="w-full h-24 object-contain"
                          src={image}
                          alt={`Image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <p className="text-2xl font-bold text-indigo-600 mt-2">${product.price}</p>
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800 mt-2">
                  {product.category}
                </span>
                <p className="text-gray-700 mt-4">{product.description}</p>
                <div className="flex items-center mt-4">
                  <span className="text-yellow-400">
                    {Array(Math.round(product.rating?.rate || 0)).fill('★').join('')}
                  </span>
                  <span className="text-gray-600">Rated: {product.rating} out of 5</span>
                </div>
                <p className="text-gray-600 mt-2">Stock: {product.stock}</p>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900">Tags:</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
              <button
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                onClick={() => setReviewsVisible(!reviewsVisible)}
              >
                {reviewsVisible ? 'Hide Reviews' : 'Show Reviews'}
              </button>

              {reviewsVisible && (
                <div className="mt-6 space-y-6">
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg">
                        <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                        <p className="text-gray-600 text-sm">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                        <div className="text-yellow-400 mt-2">
                          {Array(Math.round(review.rating || 0)).fill('★').join('')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Back to Products Link */}
            <div className="mt-10">
              <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
