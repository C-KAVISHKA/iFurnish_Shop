/**
 * Maps a product to its best-matching 3D GLB model path.
 *
 * Visually verified mapping of image filenames to 3D GLB models:
 *
 *   chair1.jpg  → Grey organic shell armchair, wooden legs      → chair1.glb (white shell chair) ✓ close match
 *   chair2.jpg  → BLACK high-back leather OFFICE chair on wheels → chair5.glb (black office chair) ✓ exact match
 *   chair3.jpg  → Blue tufted velvet wing armchair               → armchair.glb ✓
 *   chair4.jpg  → Natural wood & grey cushion dining chair       → chair4.glb ✓ (tan lounge chair, closest match)
 *   chair5.jpg  → Peach/tan low rounded bowl chair (metal legs)  → chair4.glb ✓ exact match
 *   chair6.jpg  → Grey modern 2-seater sofa                      → sofa.glb ✓ exact match
 *
 * Available 3D models (visually verified):
 *   chair1.glb        → White organic shell chair, wooden legs
 *   chair2.glb        → White egg/pod rounded armchair (no legs visible)
 *   chair3.glb        → Red Eames-style shell chair, wire/metal legs
 *   chair4.glb        → Peach/tan low rounded bowl lounge chair, metal legs
 *   chair5.glb        → Black high-back executive leather office chair on wheels
 *   chair6.glb        → Small compact side/accent chair
 *   sofa.glb          → Teal 2-seater sofa with cushions
 *   table.glb         → Wooden rectangular dining table
 *   armchair.glb      → Armchair (similar to chair2/egg shape)
 *   modernarmchair.glb→ Modern lounge armchair
 *
 * NOTE: The `product.model` field in MongoDB was scrambled and is NOT used.
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";

  const name     = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const firstImg = product.image && product.image[0]
    ? product.image[0].toLowerCase()
    : "";
  const filename = firstImg.split("/").pop();

  // ── 1. EXACT image-filename matches for the 6 original seeded products ──
  // These are physically verified: image filename vs what the image shows vs closest GLB.
  if (filename.startsWith("chair1"))  return "/models/chair1.glb";  // organic shell armchair → white shell chair ✓
  if (filename.startsWith("chair2"))  return "/models/chair5.glb";  // BLACK office chair → black office chair GLB ✓ (key fix!)
  if (filename.startsWith("chair3"))  return "/models/armchair.glb"; // blue tufted wing chair → armchair GLB ✓
  if (filename.startsWith("chair4"))  return "/models/chair1.glb";  // wood & grey dining chair → shell chair (closest)
  if (filename.startsWith("chair5"))  return "/models/chair4.glb";  // peach bowl chair → peach lounge GLB ✓ exact!
  if (filename.startsWith("chair6"))  return "/models/sofa.glb";    // grey sofa image → sofa GLB ✓

  // ── 2. Tables & Desks → table model ────────────────────────────────────
  if (
    category === "tables" || category === "table" ||
    category === "desks"  || category === "desk"  ||
    name.includes("table") || name.includes("desk") ||
    name.includes("bookshelf") || name.includes("bench")
  ) {
    return "/models/table.glb";
  }

  // ── 3. Sofas / Couches / Recliners / Sectionals ────────────────────────
  if (
    category === "sofas" || category === "sofa" ||
    name.includes("sofa")     || name.includes("couch")    ||
    name.includes("recliner") || name.includes("sectional") ||
    name.includes("lounger")  || name.includes("sun")
  ) {
    return "/models/sofa.glb";
  }

  // ── 4. Chair sub-types → best visual match ─────────────────────────────

  // Office / Executive / Ergonomic / Task / Drafting → black office chair (chair5)
  if (
    name.includes("office")    || name.includes("executive") ||
    name.includes("ergonomic") || name.includes("task")      ||
    name.includes("drafting")
  ) {
    return "/models/chair5.glb";
  }

  // Wing / Tufted / Accent armchairs → armchair
  if (
    name.includes("armchair") || name.includes("accent") ||
    name.includes("wing")     || name.includes("tufted")
  ) {
    return "/models/armchair.glb";
  }

  // Lounge / Modern chairs → modernarmchair
  if (name.includes("lounge") || name.includes("modern")) {
    return "/models/modernarmchair.glb";
  }

  // Stools / Bar stools → red Eames (chair3 — has tall wire legs, bar-height feel)
  if (name.includes("stool") || name.includes("bar")) {
    return "/models/chair3.glb";
  }

  // Poufs / Ottomans → low lounge bowl (chair4)
  if (name.includes("pouf") || name.includes("ottoman")) {
    return "/models/chair4.glb";
  }

  // Patio / Outdoor chairs → Eames-style (chair3, casual/lightweight)
  if (name.includes("patio") || name.includes("outdoor")) {
    return "/models/chair3.glb";
  }

  // Nordic / Oak / Bellino → shell chair (chair1)
  if (
    name.includes("nordic") || name.includes("oak") ||
    name.includes("bellino")
  ) {
    return "/models/chair1.glb";
  }

  // Velvet → lounge bowl chair (chair4, has upholstered feel)
  if (name.includes("velvet")) {
    return "/models/chair4.glb";
  }

  // ── 5. Generic "Chairs" fallback — distribute across chair models ───────
  //    Use a hash of the product name to ensure variety across chairs
  if (category === "chairs" || category === "chair") {
    const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const chairModels = [
      "/models/chair1.glb",        // white shell
      "/models/chair4.glb",        // peach bowl
      "/models/chair3.glb",        // Eames red
      "/models/armchair.glb",      // armchair
      "/models/modernarmchair.glb",// modern lounge
      "/models/chair5.glb",        // office chair
    ];
    return chairModels[hash % chairModels.length];
  }

  // ── 6. Absolute fallback ────────────────────────────────────────────────
  return "/models/chair1.glb";
};
