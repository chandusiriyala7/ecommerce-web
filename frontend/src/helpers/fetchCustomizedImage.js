import SummaryApi from '../common';

const fetchCustomizedImage = async (userId, productId) => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  const url = `${SummaryApi.getCustomizedProduct.url}?userId=${userId}&productId=${productId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data?.data || null; // This is the image (base64 or URL)
};

export default fetchCustomizedImage; 