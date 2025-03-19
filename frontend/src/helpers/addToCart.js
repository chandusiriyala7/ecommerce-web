import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async (e, id, customizedImage = null) => {
    e?.stopPropagation();
    e?.preventDefault();
    const token = localStorage.getItem('authToken');  

    if (!token) {
        console.error("No auth token found");
        return;
    }
    const response = await fetch(SummaryApi.addToCartProduct.url, {
        method: SummaryApi.addToCartProduct.method,
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`,   // Send the token in Authorization header
            'Content-Type': 'application/json'    // Specify content type
        },
        body: JSON.stringify({
            productId: id,
            customizedImage // Include the customized image in the request body
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        toast.success(responseData.message);
    }

    if (responseData.error) {
        toast.error(responseData.message);
    }

    return responseData;
};

export default addToCart;