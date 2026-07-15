/**
 * Uploads an image file to Cloudinary and returns the secure URL
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const uploadImageToCloudinary = async (file) => {
  const url = "https://api.cloudinary.com/v1_1/xgx0pjxq/image/upload";
  const formData = new FormData();
  
  formData.append("file", file);
  formData.append("upload_preset", "website");

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
