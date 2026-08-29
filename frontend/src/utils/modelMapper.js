/**
 * Maps a product to its best-matching 3D GLB model path for Three.js WebXR and AR QuickLook.
 *
 * Available 3D models in /models/:
 *   chair1.glb        → White organic shell chair, wooden legs (Dining / Nordic / Patio / General)
 *   chair2.glb        → White egg/pod rounded armchair (Wendy Chair)
 *   chair3.glb        → Red Eames-style stool, wire/metal legs (Stool / Bar stool / Ottoman)
 *   chair4.glb        → Peach/tan low rounded bowl lounge chair, metal legs (Poufs / Velvet / Bowl)
 *   chair5.glb        → Black high-back executive ergonomic office chair on wheels (Office / Task / Drafting)
 *   chair6.glb        → Compact side/accent chair
 *   sofa.glb          → Modern 2-seater sofa with cushions (Sofas / Couches / Recliners / Loungers)
 *   table.glb         → Wooden rectangular dining table / desk (Tables / Desks / Benches)
 *   armchair.glb      → Classic upholstered wing/tufted armchair (Armchairs / Accent)
 *   modernarmchair.glb→ Modern lounge armchair (Lounge / Modern)
 */
export const getModelForProduct = (product) => {
  if (!product) return "/models/chair1.glb";

  // ── 0. Authoritative Model from Database (if specified) ─────────────────
  if (product.model) {
    const customModel = Array.isArray(product.model) ? product.model[0] : product.model;
    if (typeof customModel === "string" && customModel.trim().endsWith(".glb")) {
      return customModel.trim();
    }
  }

  const name     = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const firstImg = product.image && product.image[0]
    ? product.image[0].toLowerCase()
    : "";
  const filename = firstImg.split("/").pop();

  // ── 1. EXACT image-filename matches for seeded products ─────────────────
  if (filename.startsWith("chair1") || filename.startsWith("c1"))  return "/models/chair1.glb";  // Shell armchair
  if (filename.startsWith("chair2") || filename.startsWith("c2"))  return "/models/chair2.glb";  // Wendy egg/pod chair
  if (filename.startsWith("chair3") || filename.startsWith("c4"))  return "/models/chair3.glb";  // Counter stool
  if (filename.startsWith("chair4") || filename.startsWith("c5"))  return "/models/chair4.glb";  // High back / bowl lounge
  if (filename.startsWith("chair5") || filename.startsWith("c3"))  return "/models/chair5.glb";  // Black executive office chair
  if (filename.startsWith("chair6") || filename.startsWith("s2") || filename.startsWith("s6"))  return "/models/sofa.glb"; // Sofa

  // ── 2. Tables & Desks → table model ────────────────────────────────────
  if (
    category === "tables" || category === "table" ||
    category === "desks"  || category === "desk"  ||
    name.includes("table") || name.includes("desk") ||
    name.includes("bookshelf") || name.includes("bench")
  ) {
    return "/models/table.glb";
  }

  // ── 3. Sofas / Couches / Recliners / Sectionals / Loungers ─────────────
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

  // Stools / Bar stools / Ottomans → stool model (chair3)
  if (
    name.includes("stool") || name.includes("bar") ||
    name.includes("counter") || name.includes("ottoman")
  ) {
    return "/models/chair3.glb";
  }

  // Poufs / Velvet chairs → low lounge bowl chair (chair4)
  if (name.includes("pouf") || name.includes("velvet")) {
    return "/models/chair4.glb";
  }

  // Wing / Tufted / Accent armchairs → classic armchair
  if (
    name.includes("armchair") || name.includes("accent") ||
    name.includes("wing")     || name.includes("tufted")
  ) {
    return "/models/armchair.glb";
  }

  // Lounge / Modern chairs → modern lounge armchair
  if (name.includes("lounge") || name.includes("modern")) {
    return "/models/modernarmchair.glb";
  }

  // Nordic / Oak / Bellino / Dining / Patio / Outdoor chairs → clean shell chair (chair1)
  if (
    name.includes("nordic") || name.includes("oak") ||
    name.includes("bellino") || name.includes("patio") ||
    name.includes("outdoor") || name.includes("dining")
  ) {
    return "/models/chair1.glb";
  }

  // ── 5. Default Fallback ─────────────────────────────────────────────────
  return "/models/chair1.glb";
};

