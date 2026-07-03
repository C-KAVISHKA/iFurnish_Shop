/**
 * Maps a product object from MongoDB to its corresponding 3D GLB model path.
 * Aligns the 3D visualizer model with the product image shown on the card.
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";
  
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const firstImage = product.image && product.image[0] ? product.image[0].toLowerCase() : "";
  const filename = firstImage.split('/').pop();
  
  // 1. If it's a sofa (category is Sofas, or name has sofa/couch/lounger/pouf/ottoman), return the sofa model
  if (
    name.includes("sofa") || 
    name.includes("couch") || 
    name.includes("lounger") || 
    name.includes("pouf") || 
    name.includes("ottoman") || 
    category === "sofas" ||
    filename.includes("sofa") ||
    filename.includes("s2.png") ||
    filename.includes("s6.png")
  ) {
    return "/models/sofa.glb";
  }
  
  // 2. If it's a specific chair image, load its corresponding custom 3D chair model
  if (filename.includes("chair1") || name.includes("bellino")) return "/models/chair1.glb";
  if (filename.includes("chair2") || name.includes("wendy")) return "/models/chair2.glb";
  if (filename.includes("chair3") || name.includes("counter stool")) return "/models/chair3.glb";
  if (filename.includes("chair4") || name.includes("euclid")) return "/models/chair4.glb";
  if (filename.includes("chair5") || name.includes("executive")) return "/models/chair5.glb";
  if (filename.includes("chair6")) return "/models/chair6.glb";
  
  // 3. Match generic chair types
  if (name.includes("armchair")) return "/models/armchair.glb";
  if (name.includes("modern")) return "/models/modernarmchair.glb";
  if (name.includes("chair") || name.includes("stool") || name.includes("bench")) return "/models/chair.glb";
  
  // 4. Default fallback: cycle through numbered models (excluding sofa models) to add variety
  const itemId = parseInt(product.itemId, 10);
  if (!isNaN(itemId)) {
    // We have 1.glb, 2.glb, 3.glb, 4.glb, 5.glb
    const modelNum = (itemId % 5) + 1;
    return `/models/${modelNum}.glb`;
  }

  return "/models/chair1.glb";
};
