import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const Product = () => {
  const { productId } = useParams();

  const mutation = useMutation({
    mutationFn: (newProduct) => {
      return axios.put(
        `https://dummyjson.com/products/${productId}`,
        newProduct
      );
    },
  });

  const fetchProduct = async () => {
    //If there is error in api, then react-query will retry by default 3 times after 1st call, so total 4
    //Then it will show error
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    const data = await response.json();
    return data;
  };

  const {
    isLoading,
    error,
    data: product,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: fetchProduct,
  });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>Error: {error.message}</h3>;
  }

  if (mutation.error) {
    return <h3>Error: {mutation.error.message}</h3>;
  }

  if (mutation.isLoading) {
    return <h3>Updating...</h3>;
  }

  return (
    <>
      <div>Product: {product?.title}</div>

      <button
        onClick={() => {
          mutation.mutate({ title: "Updated Title" });
        }}
      >
        Update Title
      </button>
    </>
  );
};

export default Product;
