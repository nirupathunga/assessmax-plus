import { DEFAULT_CORE_RATES, DEFAULT_MATERIAL_RATES, DEFAULT_LABOUR_RATES } from './components/ExtraViews';

// Generate standard quantity takeoff rows based on selected modules & floors count
export function generateDefaultQuantities(selectedCategories, floorsCount) {
  const baseFactor = 1.0 + (floorsCount - 1) * 0.15;
  const round2 = (num) => Math.round(num * 100) / 100;

  const allPossibleRows = [
    { item: 'Excavation', quantity: round2(59.87 * baseFactor), unit: 'cum', category: 'foundation' },
    { item: 'PCC(1:4:8)', quantity: round2(5.43 * baseFactor), unit: 'cum', category: 'foundation' },
    { item: 'FDN RCC(M25)', quantity: round2(12.1 * baseFactor), unit: 'cum', category: 'foundation' },
    { item: 'Pedestal RCC(M25)', quantity: round2(0.8 * baseFactor), unit: 'cum', category: 'foundation' },
    { item: 'FDNColumn RCC(M25)', quantity: round2(0.87 * baseFactor), unit: 'cum', category: 'foundation' },
    { item: 'Pedestal Stirrups', quantity: round2(68.94 * baseFactor), unit: 'kg', category: 'foundation' },
    { item: 'FDNColumn Main Bars', quantity: round2(293.79 * baseFactor), unit: 'kg', category: 'foundation' },
    { item: 'FDNColumn Stirrups', quantity: round2(70.04 * baseFactor), unit: 'kg', category: 'foundation' },
    { item: 'Footing Formwork', quantity: round2(22.56 * baseFactor), unit: 'm²', category: 'foundation' },
    { item: 'Pedestal Formwork', quantity: round2(9.41 * baseFactor), unit: 'm²', category: 'foundation' },
    { item: 'FDNColumn Formwork', quantity: round2(11.08 * baseFactor), unit: 'm²', category: 'foundation' },
    { item: 'RFR (Returning and Filling)', quantity: round2(44.74 * baseFactor), unit: 'm³', category: 'foundation' },
    { item: 'Removal', quantity: round2(19.2 * baseFactor), unit: 'm³', category: 'foundation' },
    
    { item: 'Plinth Beam Concrete (M25)', quantity: round2(8.52 * baseFactor), unit: 'cum', category: 'plinth-beam' },
    { item: 'Plinth Beam Main Reinforcement', quantity: round2(148.2 * baseFactor), unit: 'kg', category: 'plinth-beam' },
    { item: 'Plinth Beam Stirrups', quantity: round2(45.1 * baseFactor), unit: 'kg', category: 'plinth-beam' },
    { item: 'Plinth Beam Shuttering', quantity: round2(18.4 * baseFactor), unit: 'm²', category: 'plinth-beam' },

    { item: 'Floor Beam Concrete (M25)', quantity: round2(11.35 * baseFactor), unit: 'cum', category: 'floor-beam' },
    { item: 'Floor Beam Main Reinforcement', quantity: round2(210.8 * baseFactor), unit: 'kg', category: 'floor-beam' },
    { item: 'Floor Beam Shuttering / Formwork', quantity: round2(24.6 * baseFactor), unit: 'm²', category: 'floor-beam' },

    { item: 'Floor Slab Concrete (M20/25)', quantity: round2(18.6 * baseFactor), unit: 'cum', category: 'floor-slab' },
    { item: 'Slab Rebar Mesh Main (10mm)', quantity: round2(340.5 * baseFactor), unit: 'kg', category: 'floor-slab' },
    { item: 'Slab Distribution Steel (8mm)', quantity: round2(180.2 * baseFactor), unit: 'kg', category: 'floor-slab' },
    { item: 'Slab Formwork / Centering', quantity: round2(120.0 * baseFactor), unit: 'm²', category: 'floor-slab' },

    { item: 'Column concrete (M25)', quantity: round2(9.4 * baseFactor), unit: 'cum', category: 'columns' },
    { item: 'Column Main Longitudinal Bars', quantity: round2(450.2 * baseFactor), unit: 'kg', category: 'columns' },
    { item: 'Column Stirrup Ties (8mm)', quantity: round2(110.6 * baseFactor), unit: 'kg', category: 'columns' },
    
    { item: 'Internal Partitions & Superstructure Brickwork', quantity: round2(120.4 * baseFactor), unit: 'sqm', category: 'superstructure' },
    { item: 'Plastering works (1:6)', quantity: round2(240.8 * baseFactor), unit: 'sqm', category: 'superstructure' },
    { item: 'Exterior Wall Painting / Texture', quantity: round2(310.2 * baseFactor), unit: 'sqm', category: 'superstructure' },
    { item: 'Structural Architectural Projections', quantity: round2(2.5 * baseFactor), unit: 'cum', category: 'superstructure' },

    { item: 'Elevation Facade Cladding / Finish', quantity: round2(45.6 * baseFactor), unit: 'sqm', category: 'elevation' },
    { item: 'Glass Partitioning & Exterior Glazing', quantity: round2(32.8 * baseFactor), unit: 'sqm', category: 'elevation' },
    { item: 'Exterior Decorative Plastering', quantity: round2(112.5 * baseFactor), unit: 'sqm', category: 'elevation' },

    { item: 'Lintel Beam Concrete (M20/M25)', quantity: round2(3.15 * baseFactor), unit: 'cum', category: 'lintel-beam' },
    { item: 'Lintel Beam Main Steel reinforcement', quantity: round2(110.4 * baseFactor), unit: 'kg', category: 'lintel-beam' },
    { item: 'Lintel Beam Shuttering / Formwork', quantity: round2(12.8 * baseFactor), unit: 'm²', category: 'lintel-beam' },

    { item: 'Staircase Waist Slab Concrete (M25)', quantity: round2(4.8 * baseFactor), unit: 'cum', category: 'staircase' },
    { item: 'Staircase Rebar reinforcement (12mm)', quantity: round2(120.5 * baseFactor), unit: 'kg', category: 'staircase' },
    { item: 'Staircase Shuttering / Formwork', quantity: round2(15.2 * baseFactor), unit: 'sqm', category: 'staircase' }
  ];

  // Convert categories to lowercase is-code standard keys
  const normalizedCats = selectedCategories.map(c => {
    const lowered = c.toLowerCase();
    if (lowered.includes('foundation')) return 'foundation';
    if (lowered.includes('plinth')) return 'plinth-beam';
    if (lowered.includes('floor beam')) return 'floor-beam';
    if (lowered.includes('slab')) return 'floor-slab';
    if (lowered.includes('column')) return 'columns';
    if (lowered.includes('plan')) return 'superstructure';
    if (lowered.includes('superstructure')) return 'superstructure';
    if (lowered.includes('elevation')) return 'elevation';
    if (lowered.includes('lintel')) return 'lintel-beam';
    if (lowered.includes('staircase')) return 'staircase';
    return lowered;
  });

  return allPossibleRows.filter(r => normalizedCats.includes(r.category));
}

// Find the rate for a given specific item name in project's custom rates
export function getRateForItem(itemName, coreRates) {
  const exact = coreRates.find(r => r.item.toLowerCase() === itemName.toLowerCase());
  if (exact && exact.rate !== null) {
    return exact.rate;
  }

  // Fallbacks and smart mappings
  const itemLower = itemName.toLowerCase();
  
  const getFromCore = (keyWord, fallback) => {
    const found = coreRates.find(r => r.item.toLowerCase().includes(keyWord));
    return (found && found.rate !== null) ? found.rate : fallback;
  };

  if (itemLower.includes("excavation")) {
    return getFromCore("excavation", 300);
  }
  if (itemLower.includes("pcc(1:4:8)")) {
    return getFromCore("pcc(1:4:8)", 6000);
  }
  if (itemLower.includes("pcc(1:3:6)")) {
    return getFromCore("pcc(1:3:6)", 6500);
  }
  if (itemLower.includes("fdn rcc")) {
    return getFromCore("fdn rcc", 7200);
  }
  if (itemLower.includes("pedestal rcc")) {
    return getFromCore("pedestal rcc", 7200);
  }
  if (itemLower.includes("fdncolumn rcc")) {
    return getFromCore("fdncolumn rcc", 7500);
  }
  if (itemLower.includes("plinth beam concrete")) {
    return getFromCore("beam rcc(m25)", 7700);
  }
  if (itemLower.includes("floor beam concrete")) {
    return getFromCore("beam rcc(m25)", 7700);
  }
  if (itemLower.includes("floor slab concrete") || itemLower.includes("waist slab concrete") || itemLower.includes("lintel beam concrete")) {
    return getFromCore("slab rcc(m25)", 7700);
  }
  if (itemLower.includes("concrete") || itemLower.includes("rcc")) {
    return getFromCore("beam rcc", 7700);
  }
  if (itemLower.includes("shuttering") || itemLower.includes("formwork") || itemLower.includes("centrin") || itemLower.includes("shutter")) {
    if (itemLower.includes("beam")) return getFromCore("beam formwork", 950);
    if (itemLower.includes("column")) return getFromCore("column formwork", 920);
    return getFromCore("slab formwork", 950);
  }
  if (itemLower.includes("brickwork") || itemLower.includes("brick")) {
    return getFromCore("half brick wall", 6100);
  }
  if (itemLower.includes("plastering") || itemLower.includes("plaster")) {
    if (itemLower.includes("exterior")) return getFromCore("external plaster", 300);
    return getFromCore("internal plaster", 350);
  }
  if (itemLower.includes("painting") || itemLower.includes("paint") || itemLower.includes("cladding") || itemLower.includes("facade")) {
    if (itemLower.includes("exterior")) return getFromCore("external painting", 220);
    return getFromCore("internal painting", 200);
  }
  if (itemLower.includes("rebar") || itemLower.includes("reinforcement") || itemLower.includes("bars") || itemLower.includes("stirrups") || itemLower.includes("steel")) {
    if (itemLower.includes("beam") && itemLower.includes("stirrups")) return getFromCore("beam stirrups", 80);
    if (itemLower.includes("beam")) return getFromCore("beam main bars", 80);
    if (itemLower.includes("column") && itemLower.includes("stirrup")) return getFromCore("column stirrups", 78);
    if (itemLower.includes("column")) return getFromCore("column main bars", 78);
    if (itemLower.includes("slab") && itemLower.includes("distribution")) return getFromCore("slab cross bars", 78);
    if (itemLower.includes("slab")) return getFromCore("slab main bars", 78);
    return getFromCore("footing main bars", 78);
  }

  return 1000; // default absolute fallback rate in INR
}

// Dynamically compute the valuation cost of a project using its custom quantities and rates
export function calculateProjectValuation(quantities, coreRates) {
  if (!quantities || quantities.length === 0) return 0;
  return quantities.reduce((total, row) => {
    const rate = getRateForItem(row.item, coreRates);
    return total + (row.quantity * rate);
  }, 0);
}
