/**
 * Maps a product object from MongoDB to its corresponding 3D GLB model path.
 * Aligns the 3D visualizer model with the product image shown on the card.
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";
  
  // 0. Use the precise 3D model path assigned in the database
  if (product.model && product.model.length > 0 && product.model[0]) {
    return product.model[0];
  }
  
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const firstImage = product.image && product.image[0] ? product.image[0].toLowerCase() : "";
  const filename = firstImage.split('/').pop();
  
  // 1. Specific chairs (exact matches)
  if (filename.includes("chair1") || name.includes("bellino")) return "/models/chair1.glb";
  if (filename.includes("chair2") || name.includes("wendy")) return "/models/chair2.glb";
  if (filename.includes("chair3") || name.includes("counter stool")) return "/models/chair3.glb";
  if (filename.includes("chair4") || name.includes("euclid")) return "/models/chair4.glb";
  if (filename.includes("chair5") || name.includes("executive")) return "/models/chair5.glb";
  if (filename.includes("chair6") || name.includes("beverly")) return "/models/sofa.glb"; // Beverly Sofa uses chair6 image, map to sofa

  // Exact image filename matches from the mapping script
  if (filename.includes("c1.png")) return "/models/1.glb";
  if (filename.includes("c2.png")) return "/models/2.glb";
  if (filename.includes("c3.png")) return "/models/3.glb";
  if (filename.includes("c4.png")) return "/models/4.glb";
  if (filename.includes("c5.png")) return "/models/5.glb";
  
  if (filename.includes("s2.png") || filename.includes("s6.png") || filename.includes("sofa.png")) {
    return "/models/sofa.glb";
  }
  
  // 2. Sofas / Couches
  if (
    name.includes("sofa") || 
    name.includes("couch") || 
    name.includes("lounger") || 
    category === "sofas"
  ) {
    return "/models/sofa.glb";
  }
  
  // 3. Stools, Poufs, Ottomans, Benches (Map to stool or bench model)
  if (name.includes("stool") || name.includes("pouf") || name.includes("ottoman")) {
    return "/models/chair3.glb"; // Stool model
  }
  if (name.includes("bench")) {
    return "/models/chair.glb"; // Bench/Chair model
  }
  
  // 4. Armchairs
  if (name.includes("armchair")) return "/models/armchair.glb";
  if (name.includes("modern")) return "/models/modernarmchair.glb";
  
  // 5. Default fallback: cycle through numbered models to add variety
  const itemId = parseInt(product.itemId, 10);
  if (!isNaN(itemId)) {
    const modelNum = (itemId % 5) + 1;
    return `/models/${modelNum}.glb`;
  }

  return "/models/chair1.glb";
};
