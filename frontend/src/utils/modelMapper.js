/**
 * Maps a product object from MongoDB to its corresponding 3D GLB model path
 * located in the public/models/ directory.
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";
  
  // If the product object has a model array (e.g. from local mock data)
  if (product.model && product.model[0]) {
    const filename = product.model[0].split('/').pop();
    return `/models/${filename}`;
  }
  
  const name = (product.name || "").toLowerCase();
  const firstImage = product.image && product.image[0] ? product.image[0].toLowerCase() : "";
  
  // Match standard chairs based on image filename or product name
  if (firstImage.includes("chair1") || name.includes("bellino")) return "/models/chair1.glb";
  if (firstImage.includes("chair2") || name.includes("wendy")) return "/models/chair2.glb";
  if (firstImage.includes("chair3") || name.includes("counter stool")) return "/models/chair3.glb";
  if (firstImage.includes("chair4") || name.includes("euclid")) return "/models/chair4.glb";
  if (firstImage.includes("chair5") || name.includes("executive")) return "/models/chair5.glb";
  if (firstImage.includes("chair6")) return "/models/chair6.glb";
  
  // Match sofas
  if (name.includes("sofa") || name.includes("couch") || firstImage.includes("sofa")) return "/models/sofa.glb";
  
  // Match armchairs
  if (name.includes("armchair") || firstImage.includes("armchair")) return "/models/armchair.glb";
  
  // Match generic chairs/stools/benches
  if (name.includes("chair") || name.includes("stool") || name.includes("bench")) return "/models/chair.glb";
  
  // If the image filename matches image_(\d+).jpeg, map it to one of the numbered GLB models (1.glb - 5.glb)
  const imgMatch = firstImage.match(/image_(\d+)/);
  if (imgMatch) {
    const num = parseInt(imgMatch[1], 10);
    const modelNum = (num % 5) + 1;
    return `/models/${modelNum}.glb`;
  }
  
  const itemId = parseInt(product.itemId, 10);
  if (!isNaN(itemId)) {
    const modelNum = (itemId % 5) + 1;
    return `/models/${modelNum}.glb`;
  }

  // Default fallback
  return "/models/chair1.glb";
};
