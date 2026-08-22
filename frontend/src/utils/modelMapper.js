/**
 * Maps a product to its best-matching 3D GLB model path.
 *
 * Available 3D models (visually verified):
 *   chair1.glb  → White modern shell chair, wooden legs
 *   chair2.glb  → White rounded egg/pod armchair
 *   chair3.glb  → Red Eames-style shell chair, wire legs
 *   chair4.glb  → Peach/tan low lounge chair, metal legs
 *   chair5.glb  → Black high-back executive office chair on wheels
 *   chair6.glb  → Small accent / side chair
 *   sofa.glb    → Teal 2-seater sofa with cushions
 *   table.glb   → Wooden dining table with tapered legs
 *   armchair.glb      → Armchair (similar to chair2)
 *   modernarmchair.glb → Modern lounge armchair
 *
 * NOTE: The `product.model` field in MongoDB is unreliable (scrambled).
 * We derive the correct model from image filename + category + name.
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";

  const name     = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const firstImg = product.image && product.image[0]
    ? product.image[0].toLowerCase()
    : "";
  const filename = firstImg.split("/").pop();

  // ── 1. Exact image-filename matches (original seeded products) ────────
  if (filename.startsWith("chair1"))  return "/models/chair1.glb";  // Bellino Wing Chair → white shell chair
  if (filename.startsWith("chair2"))  return "/models/chair2.glb";  // Wendy Chair → egg/pod chair
  if (filename.startsWith("chair3"))  return "/models/chair3.glb";  // Counter Stool → red Eames chair
  if (filename.startsWith("chair4"))  return "/models/chair4.glb";  // Euclid / High Back → low lounge
  if (filename.startsWith("chair5"))  return "/models/chair5.glb";  // Executive → black office chair
  if (filename.startsWith("chair6"))  return "/models/chair6.glb";  // Beverly Sofa card uses chair6 image

  // ── 2. Tables & Desks ─────────────────────────────────────────────────
  if (
    category === "tables" || category === "table" ||
    category === "desks"  || category === "desk"  ||
    name.includes("table") || name.includes("desk") ||
    name.includes("bookshelf")
  ) {
    return "/models/table.glb";
  }

  // ── 3. Sofas / Couches / Loungers / Recliners ─────────────────────────
  if (
    category === "sofas" || category === "sofa" ||
    name.includes("sofa")     || name.includes("couch") ||
    name.includes("recliner") || name.includes("sectional")
  ) {
    return "/models/sofa.glb";
  }

  // ── 4. Sun loungers (outdoor long chair, closest to sofa) ─────────────
  if (name.includes("lounger") || name.includes("sun")) {
    return "/models/sofa.glb";
  }

  // ── 5. Specific chair sub-types → best visual match ───────────────────

  // Office / Executive / Ergonomic / Task → black office chair (chair5)
  if (
    name.includes("office")    || name.includes("executive") ||
    name.includes("ergonomic") || name.includes("task")      ||
    name.includes("drafting")
  ) {
    return "/models/chair5.glb";
  }

  // Stools / Bar stools → red Eames-style chair (chair3, has tall wire legs)
  if (name.includes("stool") || name.includes("bar")) {
    return "/models/chair3.glb";
  }

  // Armchairs / Accent chairs → armchair model
  if (name.includes("armchair") || name.includes("accent")) {
    return "/models/armchair.glb";
  }

  // Lounge / Modern chairs → modernarmchair (low lounger look)
  if (name.includes("lounge") || name.includes("modern")) {
    return "/models/modernarmchair.glb";
  }

  // Pouf / Ottoman → low lounge chair (chair4, low profile)
  if (name.includes("pouf") || name.includes("ottoman")) {
    return "/models/chair4.glb";
  }

  // Patio / Outdoor chairs → Eames-style (chair3, casual look)
  if (name.includes("patio") || name.includes("outdoor")) {
    return "/models/chair3.glb";
  }

  // Nordic / Oak / Wing / Bellino → white shell chair (chair1)
  if (
    name.includes("nordic") || name.includes("oak") ||
    name.includes("wing")   || name.includes("bellino")
  ) {
    return "/models/chair1.glb";
  }

  // Work bench → table
  if (name.includes("bench")) {
    return "/models/table.glb";
  }

  // Velvet → lounge chair (chair4, has that upholstered look)
  if (name.includes("velvet")) {
    return "/models/chair4.glb";
  }

  // ── 6. Generic "Chairs" category fallback ─────────────────────────────
  //    Distribute across the 5 chair models using a name-based hash
  //    so different chair products get visually distinct 3D models.
  if (category === "chairs" || category === "chair") {
    const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const chairModels = [
      "/models/chair1.glb",       // white shell chair
      "/models/chair2.glb",       // egg/pod armchair
      "/models/chair3.glb",       // Eames-style
      "/models/chair4.glb",       // low lounge
      "/models/chair5.glb",       // office chair
      "/models/armchair.glb",     // armchair
      "/models/modernarmchair.glb" // modern armchair
    ];
    return chairModels[hash % chairModels.length];
  }

  // ── 7. Absolute fallback ──────────────────────────────────────────────
  return "/models/chair1.glb";
};
