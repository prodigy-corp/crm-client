export const handleError = (data: any) => {
  let error = "An unexpected error occurred";

  // Check if it's an axios error with response
  if (data?.response?.data) {
    const response = data.response.data;
    
    if (response?.message) {
      error = response.message;
    } else if (typeof response === 'string') {
      error = response;
    } else if (response?.error) {
      error = response.error;
    }
  } 
  // Check if it's a network error
  else if (data?.message) {
    error = data.message;
  }
  // Check if it's a string error
  else if (typeof data === 'string') {
    error = data;
  }

  return { error };
};