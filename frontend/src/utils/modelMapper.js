/**
 * Maps a product object from MongoDB to its corresponding 3D GLB model path.
 *
 * IMPORTANT: The `product.model` field stored in MongoDB is unreliable
 * (many entries have scrambled/wrong values, e.g. tables pointing to
 * chair models). We therefore derive the correct 3D model entirely from
 * the product's image filename, category and name.
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";

  const name     = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const firstImage = product.image && product.image[0]
    ? product.image[0].toLowerCase()
    : "";
  const filename = firstImage.split("/").pop();

  // ── 1. Exact image-filename matches (original 6 seeded products) ──────
  //    These filenames come from the product images uploaded with the seed
  //    data and each one maps to a specific GLB that was modelled for it.
  if (filename.startsWith("chair1"))  return "/models/chair1.glb";  // Bellino Wing Chair
  if (filename.startsWith("chair2"))  return "/models/chair2.glb";  // Wendy Chair
  if (filename.startsWith("chair3"))  return "/models/chair3.glb";  // Adjustable Counter Stool
  if (filename.startsWith("chair4"))  return "/models/chair4.glb";  // High Back Chair / Euclid
  if (filename.startsWith("chair5"))  return "/models/chair5.glb";  // Executive / Office Chair
  if (filename.startsWith("chair6"))  return "/models/chair6.glb";  // Beverly Sofa (image is chair6)

  // ── 2. Category-based mapping (most reliable for bulk products) ───────

  // Tables & Desks → table model
  if (
    category === "tables" ||
    category === "table"  ||
    category === "desks"  ||
    category === "desk"   ||
    name.includes("table") ||
    name.includes("desk")  ||
    name.includes("bench") // work bench = table category
  ) {
    return "/models/table.glb";
  }

  // Sofas, Couches, Loungers, Recliners → sofa model
  if (
    category === "sofas"  ||
    category === "sofa"   ||
    name.includes("sofa")     ||
    name.includes("couch")    ||
    name.includes("lounger")  ||
    name.includes("recliner")
  ) {
    return "/models/sofa.glb";
  }

  // ── 3. Name-keyword matching for chairs sub-types ─────────────────────

  // Stools, Poufs, Ottomans → stool model
  if (
    name.includes("stool")   ||
    name.includes("pouf")    ||
    name.includes("ottoman")
  ) {
    return "/models/chair3.glb";
  }

  // Armchairs → armchair model
  if (name.includes("armchair")) return "/models/armchair.glb";

  // Lounge chairs → modernarmchair model
  if (name.includes("lounge")) return "/models/modernarmchair.glb";

  // Patio / Outdoor chairs → chair4 model
  if (name.includes("patio") || name.includes("outdoor")) {
    return "/models/chair4.glb";
  }

  // Ergonomic / Task / Office chairs → chair5 (office chair model)
  if (
    name.includes("ergonomic") ||
    name.includes("task")      ||
    name.includes("office")    ||
    name.includes("executive")
  ) {
    return "/models/chair5.glb";
  }

  // Nordic / Oak / Wing chairs → chair1
  if (
    name.includes("nordic") ||
    name.includes("oak")    ||
    name.includes("wing")   ||
    name.includes("bellino")
  ) {
    return "/models/chair1.glb";
  }

  // ── 4. Generic "Chairs" category fallback ─────────────────────────────
  //    Cycle through the 5 numbered chair models based on product name
  //    hash so that different chairs get visually distinct models.
  if (category === "chairs" || category === "chair") {
    const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const chairModels = [
      "/models/chair1.glb",
      "/models/chair2.glb",
      "/models/chair3.glb",
      "/models/chair4.glb",
      "/models/chair5.glb",
    ];
    return chairModels[hash % chairModels.length];
  }

  // ── 5. Absolute fallback ──────────────────────────────────────────────
  return "/models/chair1.glb";
};
