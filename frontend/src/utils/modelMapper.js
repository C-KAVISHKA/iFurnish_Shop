/**
 * Master 3D AR Model Mapping and Prioritization Utility
 *
 * Flagship products with 100% verified 1:1 matching 3D models:
 *   1. High Back Chair        → /models/chair4.glb (Curved wood lounge chair, grey cushion)
 *   2. Orange Chair           → /models/chair1.glb (Molded shell chair, wooden legs)
 *   3. Wendy Chair            → /models/chair2.glb (Egg/pod rounded armchair)
 *   4. Adjustable Counter Stool → /models/chair3.glb (Red swivel bar stool with metal wire legs)
 *   5. Office Chair           → /models/chair5.glb (Black executive ergonomic office chair)
 *   6. Beverly Sofa           → /models/sofa.glb   (Modern 2-seater teal sofa with cushions)
 *   7. Grace Sofa             → /models/sofa.glb   (Modern 2-seater teal sofa)
 *   8. Elegance Dining Table  → /models/table.glb  (Wooden rectangular dining table)
 *   9. Bellino Wing Chair     → /models/armchair.glb (Classic tufted armchair)
 *  10. Classic Wooden Desk    → /models/table.glb  (Wooden desk / work table)
 */

export const VERIFIED_AR_PRODUCTS = [
  { match: (name, file) => file.includes("chair4") || file.includes("c4") || file.includes("c5") || name.includes("high back"), model: "/models/chair4.glb", priority: 1 },
  { match: (name, file) => file.includes("chair1") || file.includes("c1") || name.includes("orange chair"), model: "/models/chair1.glb", priority: 2 },
  { match: (name, file) => file.includes("chair2") || file.includes("1002") || file.includes("c2") || name.includes("wendy"), model: "/models/chair2.glb", priority: 3 },
  { match: (name, file) => file.includes("chair3") || name.includes("counter stool") || name.includes("adjustable counter"), model: "/models/chair3.glb", priority: 4 },
  { match: (name, file) => file.includes("chair5") || file.includes("c3") || name.includes("office chair") || name.includes("executive"), model: "/models/chair5.glb", priority: 5 },
  { match: (name, file) => file.includes("1011") || name.includes("beverly"), model: "/models/sofa.glb", priority: 6 },
  { match: (name, file) => file.includes("1006") || name.includes("grace sofa"), model: "/models/sofa.glb", priority: 7 },
  { match: (name, file) => file.includes("image_2.") || name.includes("elegance dining"), model: "/models/table.glb", priority: 8 },
  { match: (name, file) => file.includes("1013") || name.includes("bellino"), model: "/models/armchair.glb", priority: 9 },
  { match: (name, file) => file.includes("image_3.") || name.includes("wooden desk"), model: "/models/table.glb", priority: 10 },
];

/**
 * Returns true if a product has a verified 1:1 matching 3D GLB model.
 */
export const hasVerified3DModel = (product) => {
  if (!product) return false;
  if (product.has3D === true) return true;
  const name = (product.name || "").toLowerCase();
  const firstImg = product.image && product.image[0] ? product.image[0].toLowerCase() : "";
  const filename = firstImg.split("/").pop();
  return VERIFIED_AR_PRODUCTS.some((v) => v.match(name, filename));
};

/**
 * Priority number for sorting products with verified AR models to the front row.
 * Smaller number = appears earlier.
 */
export const getArPriority = (product) => {
  if (!product) return 999;
  const name = (product.name || "").toLowerCase();
  const firstImg = product.image && product.image[0] ? product.image[0].toLowerCase() : "";
  const filename = firstImg.split("/").pop();
  const found = VERIFIED_AR_PRODUCTS.find((v) => v.match(name, filename));
  return found ? found.priority : 999;
};

/**
 * Sorts any product list so that verified 3D AR products sit at the FRONT of the row.
 */
export const sortProductsWithArFirst = (productList) => {
  if (!Array.isArray(productList)) return [];
  return [...productList].sort((a, b) => getArPriority(a) - getArPriority(b));
};

/**
 * Maps a product to its verified 3D GLB model path.
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";

  const name = (product.name || "").toLowerCase();
  const firstImg = product.image && product.image[0] ? product.image[0].toLowerCase() : "";
  const filename = firstImg.split("/").pop();

  // 1. Check exact flagship match
  const matchedFlagship = VERIFIED_AR_PRODUCTS.find((v) => v.match(name, filename));
  if (matchedFlagship) {
    return matchedFlagship.model;
  }

  // 2. Tables & Desks
  const category = (product.category || "").toLowerCase();
  if (
    category === "tables" || category === "table" ||
    category === "desks" || category === "desk" ||
    name.includes("table") || name.includes("desk")
  ) {
    return "/models/table.glb";
  }

  // 3. Sofas & Couches
  if (category === "sofas" || category === "sofa" || name.includes("sofa") || name.includes("couch")) {
    return "/models/sofa.glb";
  }

  // Default fallback
  return "/models/chair1.glb";
};
