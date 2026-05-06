export type CsvMenuNode = {
  id: string;
  title: string;
  type: string;
  url: string;
  level: number;
  children: CsvMenuNode[];
};

type CsvMenuRow = {
  menu_handle: string;
  item_title: string;
  item_type: string;
  item_url: string;
  level: number;
  parent_title: string;
};

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function buildMenuTree(csv: string): CsvMenuNode[] {
  const lines = csv.trim().split(/\r?\n/);
  const rows = lines.slice(1).map((line) => {
    const [menu_handle, item_title, item_type, item_url, level, parent_title = ''] = parseCsvLine(line);
    return {
      menu_handle,
      item_title,
      item_type,
      item_url,
      level: Number(level),
      parent_title,
    } satisfies CsvMenuRow;
  });

  const roots: CsvMenuNode[] = [];
  const stack = new Map<number, CsvMenuNode>();

  rows.forEach((row, index) => {
    const node: CsvMenuNode = {
      id: `${row.level}-${index}-${row.item_title}`,
      title: row.item_title,
      type: row.item_type,
      url: row.item_url || '/',
      level: row.level,
      children: [],
    };

    if (row.level <= 1) {
      roots.push(node);
    } else {
      const parent = stack.get(row.level - 1);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    stack.set(row.level, node);
    for (const key of Array.from(stack.keys())) {
      if (key > row.level) stack.delete(key);
    }
  });

  return roots;
}

const MENU_CSV = String.raw`menu_handle,item_title,item_type,item_url,level,parent_title
main-menu,Home,HTTP,/,1,
main-menu,Product,HTTP,/,1,
main-menu,Cooking Equipment,COLLECTION,/collections/cooking-equipment,2,Product
main-menu,Automatic Cooking Machines,COLLECTION,/collections/automatic-cooking-machines,3,Cooking Equipment
main-menu,Boiling Pans & Tilting Kettles,COLLECTION,/collections/boiling-pans-tilting-kettles,3,Cooking Equipment
main-menu,Cooking Ranges,COLLECTION,/collections/cooking-ranges,3,Cooking Equipment
main-menu,Commercial Grills,COLLECTION,/collections/commercial-grills,3,Cooking Equipment
main-menu,Charcoal Cooking Equipment,COLLECTION,/collections/charcoal-cooking-equipment,3,Cooking Equipment
main-menu,Commercial Exhaust Hood,COLLECTION,/collections/commercial-exhaust-hood,3,Cooking Equipment
main-menu,Commercial Fryers,COLLECTION,/collections/commercial-fryers,3,Cooking Equipment
main-menu,Egg Boilers,COLLECTION,/collections/egg-boilers,3,Cooking Equipment
main-menu,Kebab Machines,COLLECTION,/collections/kebab-machines,3,Cooking Equipment
main-menu,Roasters & Rotisseries,COLLECTION,/collections/roasters-rotisseries,3,Cooking Equipment
main-menu,Pasta & Noodle Cookers,COLLECTION,/collections/pasta-noodle-cookers,3,Cooking Equipment
main-menu,Sous Vide Circulators,COLLECTION,/collections/sous-vide-circulators,3,Cooking Equipment
main-menu,Rice Cookers,COLLECTION,/collections/rice-cookers,3,Cooking Equipment
main-menu,Steamers,COLLECTION,/collections/steamers,3,Cooking Equipment
main-menu,Outdoor Cooking Equipment,COLLECTION,/collections/outdoor-cooking-equipment,3,Cooking Equipment
main-menu,Smoke Machines,COLLECTION,/collections/smoke-machines,3,Cooking Equipment
main-menu,Oden Cooker,COLLECTION,/collections/oden-cooker,3,Cooking Equipment
main-menu,Food Preparation,COLLECTION,/collections/food-preparation,2,Product
main-menu,Automatic Sieve Machines,COLLECTION,/collections/automatic-sieve-machines,3,Food Preparation
main-menu,Commercial Food Processors,COLLECTION,/collections/commercial-food-processors,3,Food Preparation
main-menu,Can Openers & Can Crushers,COLLECTION,/collections/can-openers-can-crushers,3,Food Preparation
main-menu,Food Blenders,COLLECTION,/collections/food-blenders,3,Food Preparation
main-menu,Food Dehydrators,COLLECTION,/collections/food-dehydrators,3,Food Preparation
main-menu,Grinders & Graters,COLLECTION,/collections/grinders-graters,3,Food Preparation
main-menu,Immersion Blender,COLLECTION,/collections/immersion-blender,3,Food Preparation
main-menu,Meat Processing Equipment,COLLECTION,/collections/meat-processing-equipment,3,Food Preparation
main-menu,Milling Machines,COLLECTION,/collections/milling-machines,3,Food Preparation
main-menu,Pacojet,COLLECTION,/collections/pacojet,3,Food Preparation
main-menu,Pasta Machines,COLLECTION,/collections/pasta-machines,3,Food Preparation
main-menu,Vegetable Cutter Equipment,COLLECTION,/collections/vegetable-cutter-equipment,3,Food Preparation
main-menu,Vacuum Sealers,COLLECTION,/collections/vacuum-sealers,3,Food Preparation
main-menu,Refrigeration Equipment,COLLECTION,/collections/refrigeration-equipment,2,Product
main-menu,Undercounter Refrigeration,COLLECTION,/collections/undercounter-refrigeration,3,Refrigeration Equipment
main-menu,Upright Refrigeration,COLLECTION,/collections/upright-refrigeration,3,Refrigeration Equipment
main-menu,Drawer Refrigeration,COLLECTION,/collections/drawer-refrigeration,3,Refrigeration Equipment
main-menu,Preparation Refrigeration,COLLECTION,/collections/preparation-refrigeration,3,Refrigeration Equipment
main-menu,Chef Bases,COLLECTION,/collections/chef-bases,3,Refrigeration Equipment
main-menu,Chest Freezers,COLLECTION,/collections/chest-freezers,3,Refrigeration Equipment
main-menu,Display Refrigeration,COLLECTION,/collections/display-refrigeration,3,Refrigeration Equipment
main-menu,Blast Chillers & Freezers,COLLECTION,/collections/blast-chillers-freezers,3,Refrigeration Equipment
main-menu,Gelato & Ice Cream Showcases,COLLECTION,/collections/gelato-ice-cream-showcases,3,Refrigeration Equipment
main-menu,Ice Machines,COLLECTION,/collections/ice-machines,3,Refrigeration Equipment
main-menu,Walk-in Refrigeration,COLLECTION,/collections/walk-in-refrigeration,3,Refrigeration Equipment
main-menu,Drop-In Cold Wells,COLLECTION,/collections/drop-in-cold-wells,3,Refrigeration Equipment
main-menu,Drying Refrigeration,COLLECTION,/collections/drying-refrigeration,3,Refrigeration Equipment
main-menu,Wine Refrigeration,COLLECTION,/collections/wine-refrigeration,3,Refrigeration Equipment
main-menu,Cigar Refrigeration,COLLECTION,/collections/cigar-refrigeration,3,Refrigeration Equipment
main-menu,Commercial Ovens,COLLECTION,/collections/commercial-ovens,2,Product
main-menu,Combination Ovens,COLLECTION,/collections/combination-ovens,3,Commercial Ovens
main-menu,Conveyor Ovens,COLLECTION,/collections/conveyor-ovens,3,Commercial Ovens
main-menu,High Speed Ovens,COLLECTION,/collections/high-speed-ovens,3,Commercial Ovens
main-menu,Convection Ovens,COLLECTION,/collections/convection-ovens,3,Commercial Ovens
main-menu,Deck Ovens,COLLECTION,/collections/deck-ovens,3,Commercial Ovens
main-menu,Pizza Ovens,COLLECTION,/collections/pizza-ovens,3,Commercial Ovens
main-menu,Microwave Ovens,COLLECTION,/collections/microwave-ovens,3,Commercial Ovens
main-menu,Oven Accessories,COLLECTION,/collections/oven-accessories,3,Commercial Ovens
main-menu,Bakery Equipment,COLLECTION,/collections/bakery-equipment,2,Product
main-menu,Bread Slicers,COLLECTION,/collections/bread-slicers,3,Bakery Equipment
main-menu,Planetary Mixers,COLLECTION,/collections/planetary-mixers,3,Bakery Equipment
main-menu,Spiral Mixers,COLLECTION,/collections/spiral-mixers,3,Bakery Equipment
main-menu,Double Arm Mixers,COLLECTION,/collections/double-arm-mixers,3,Bakery Equipment
main-menu,Dough Sheeters,COLLECTION,/collections/dough-sheeters,3,Bakery Equipment
main-menu,Retarder Proofers,COLLECTION,/collections/retarder-proofers,3,Bakery Equipment
main-menu,Proofers,COLLECTION,/collections/proofers,3,Bakery Equipment
main-menu,Rolling Machines,COLLECTION,/collections/rolling-machines,3,Bakery Equipment
main-menu,Dough Dividers and Rounders,COLLECTION,/collections/dough-dividers-and-rounders,3,Bakery Equipment
main-menu,Commercial Toasters,COLLECTION,/collections/commercial-toasters,3,Bakery Equipment
main-menu,Crepe Machines,COLLECTION,/collections/crepe-machines,3,Bakery Equipment
main-menu,Waffle Machines,COLLECTION,/collections/waffle-machines,3,Bakery Equipment
main-menu,Popcorn Machines,COLLECTION,/collections/popcorn-machines,3,Bakery Equipment
main-menu,Caramelisers,COLLECTION,/collections/caramelisers,3,Bakery Equipment
main-menu,Warming Equipment,COLLECTION,/collections/warming-equipment,2,Product
main-menu,Countertop Warmers,COLLECTION,/collections/countertop-warmers,3,Warming Equipment
main-menu,Strip Warmers,COLLECTION,/collections/strip-warmers,3,Warming Equipment
main-menu,Heat Lamps,COLLECTION,/collections/heat-lamps,3,Warming Equipment
main-menu,Chocolate Warmers,COLLECTION,/collections/chocolate-warmers,3,Warming Equipment
main-menu,Plate Warmers,COLLECTION,/collections/plate-warmers,3,Warming Equipment
main-menu,Steam Warmers,COLLECTION,/collections/steam-warmers,3,Warming Equipment
main-menu,Rethermaliser,COLLECTION,/collections/rethermaliser,3,Warming Equipment
main-menu,Drawer Warmers,COLLECTION,/collections/drawer-warmers,3,Warming Equipment
main-menu,Towel Warmers,COLLECTION,/collections/towel-warmers,3,Warming Equipment
main-menu,Beverage Equipment,COLLECTION,/collections/beverage-equipment,2,Product
main-menu,Commercial Blender,COLLECTION,/collections/commercial-blender,3,Beverage Equipment
main-menu,Drink Mixers,COLLECTION,/collections/drink-mixers,3,Beverage Equipment
main-menu,Juice Machines,COLLECTION,/collections/juice-machines,3,Beverage Equipment
main-menu,Milk Tea Shop Equipment,COLLECTION,/collections/milk-tea-shop-equipment,3,Beverage Equipment
main-menu,Can Openers & Can Crushers,COLLECTION,/collections/can-openers-can-crushers,3,Beverage Equipment
main-menu,Coffee Urns,COLLECTION,/collections/coffee-urns,3,Beverage Equipment
main-menu,Coffee Brewers,COLLECTION,/collections/coffee-brewers,3,Beverage Equipment
main-menu,Coffee Warmers / Boilers,COLLECTION,/collections/coffee-warmers-boilers,3,Beverage Equipment
main-menu,Coffee Grinders,COLLECTION,/collections/coffee-grinders,3,Beverage Equipment
main-menu,Coffee Decanters,COLLECTION,/collections/coffee-decanters,3,Beverage Equipment
main-menu,Coffee Accessories,COLLECTION,/collections/coffee-accessories,3,Beverage Equipment
main-menu,Ice Crushers / Shavers,COLLECTION,/collections/ice-crushers-shavers,3,Beverage Equipment
main-menu,Water Boilers,COLLECTION,/collections/water-boilers,3,Beverage Equipment
main-menu,Beverage Dispensers,COLLECTION,/collections/beverage-dispensers,3,Beverage Equipment
main-menu,Water Coolers,COLLECTION,/collections/water-coolers,3,Beverage Equipment
main-menu,Slush Machines,COLLECTION,/collections/slush-machines,3,Beverage Equipment
main-menu,Water filter and softener,COLLECTION,/collections/water-filter-and-softener,3,Beverage Equipment
main-menu,Stainless Steel Fabrication,COLLECTION,/collections/stainless-steel-fabrication,2,Product
main-menu,Bain Marie,COLLECTION,/collections/bain-marie,3,Stainless Steel Fabrication
main-menu,Cabinet,COLLECTION,/collections/cabinet,3,Stainless Steel Fabrication
main-menu,Chinese Range,COLLECTION,/collections/chinese-range,3,Stainless Steel Fabrication
main-menu,Clean Dish Table,COLLECTION,/collections/clean-dish-table,3,Stainless Steel Fabrication
main-menu,Cocktail Unit,COLLECTION,/collections/cocktail-unit,3,Stainless Steel Fabrication
main-menu,Equipment Stand,COLLECTION,/collections/equipment-stand,3,Stainless Steel Fabrication
main-menu,Exhaust Hood,COLLECTION,/collections/exhaust-hood,3,Stainless Steel Fabrication
main-menu,Grease Trap,COLLECTION,/collections/grease-trap,3,Stainless Steel Fabrication
main-menu,Gutter,COLLECTION,/collections/gutter,3,Stainless Steel Fabrication
main-menu,Ice Bin Cabinet,COLLECTION,/collections/ice-bin-cabinet,3,Stainless Steel Fabrication
main-menu,Noodle Range,COLLECTION,/collections/noodle-range,3,Stainless Steel Fabrication
main-menu,Over Hi Shelf,COLLECTION,/collections/over-hi-shelf,3,Stainless Steel Fabrication
main-menu,Plate Warmer,COLLECTION,/collections/plate-warmer,3,Stainless Steel Fabrication
main-menu,Pot Rail,COLLECTION,/collections/pot-rail,3,Stainless Steel Fabrication
main-menu,Stainless Steel Shelving,COLLECTION,/collections/stainless-steel-shelving,3,Stainless Steel Fabrication
main-menu,Sinks,COLLECTION,/collections/sinks,3,Stainless Steel Fabrication
main-menu,Sink Tables,COLLECTION,/collections/sink-tables,3,Stainless Steel Fabrication
main-menu,Soiled Dish Table,COLLECTION,/collections/soiled-dish-table,3,Stainless Steel Fabrication
main-menu,Soup Range,COLLECTION,/collections/soup-range,3,Stainless Steel Fabrication
main-menu,Stock Pot Stove,COLLECTION,/collections/stock-pot-stove,3,Stainless Steel Fabrication
main-menu,Thai Range,COLLECTION,/collections/thai-range,3,Stainless Steel Fabrication
main-menu,Tray Slide,COLLECTION,/collections/tray-slide,3,Stainless Steel Fabrication
main-menu,Wall Cabinet,COLLECTION,/collections/wall-cabinet,3,Stainless Steel Fabrication
main-menu,Wall Shelf,COLLECTION,/collections/wall-shelf,3,Stainless Steel Fabrication
main-menu,Work Table,COLLECTION,/collections/work-table,3,Stainless Steel Fabrication
main-menu,Footings,COLLECTION,/collections/footings,3,Stainless Steel Fabrication
main-menu,Warewashing & Sanitisation,COLLECTION,/collections/warewashing-sanitisation,2,Product
main-menu,Dishwashers,COLLECTION,/collections/dishwashers,3,Warewashing & Sanitisation
main-menu,Pot & Pan Washers,COLLECTION,/collections/pot-pan-washers,3,Warewashing & Sanitisation
main-menu,Glasswashers,COLLECTION,/collections/glasswashers,3,Warewashing & Sanitisation
main-menu,Warewashing Racks,COLLECTION,/collections/warewashing-racks,3,Warewashing & Sanitisation
main-menu,Ozone Equipment,COLLECTION,/collections/ozone-equipment,3,Warewashing & Sanitisation
main-menu,Sanitising Equipment,COLLECTION,/collections/sanitising-equipment,3,Warewashing & Sanitisation
main-menu,Warewashing Chemicals,COLLECTION,/collections/warewashing-chemicals,3,Warewashing & Sanitisation
main-menu,Warewashing Chemical Dispenser,COLLECTION,/collections/warewashing-chemical-dispenser,3,Warewashing & Sanitisation
main-menu,Warewashing Sinks & Tables,COLLECTION,/collections/warewashing-sinks-tables,3,Warewashing & Sanitisation
main-menu,Commercial Faucets & Plumbing,COLLECTION,/collections/commercial-faucets-plumbing,3,Warewashing & Sanitisation
main-menu,Glass Rinsers,COLLECTION,/collections/glass-rinsers,3,Warewashing & Sanitisation
main-menu,Food Dehydrators,COLLECTION,/collections/food-dehydrators,3,Warewashing & Sanitisation
main-menu,Storage & Transport,COLLECTION,/collections/storage-transport,2,Product
main-menu,Shelving,COLLECTION,/collections/shelving,3,Storage & Transport
main-menu,Carts & Trolleys,COLLECTION,/collections/carts-trolleys,3,Storage & Transport
main-menu,Insulated Carriers,COLLECTION,/collections/insulated-carriers,3,Storage & Transport
main-menu,Dinnerware Storage & Transport,COLLECTION,/collections/dinnerware-storage-transport,3,Storage & Transport
main-menu,Dunnage Racks,COLLECTION,/collections/dunnage-racks,3,Storage & Transport
main-menu,Portable Bar,COLLECTION,/collections/portable-bar,3,Storage & Transport
main-menu,Smallwares,COLLECTION,/collections/smallwares,2,Product
main-menu,Food Storage Supplies,COLLECTION,/collections/food-storage-supplies,3,Smallwares
main-menu,Bar Supplies,COLLECTION,/collections/bar-supplies,3,Smallwares
main-menu,Cookware,COLLECTION,/collections/cookware,3,Smallwares
main-menu,Kitchen Utensils,COLLECTION,/collections/kitchen-utensils,3,Smallwares
main-menu,Kitchen Cutlery,COLLECTION,/collections/kitchen-cutlery,3,Smallwares
main-menu,Cutting Boards & Accessories,COLLECTION,/collections/cutting-boards-accessories,3,Smallwares
main-menu,Commercial Scales,COLLECTION,/collections/commercial-scales,3,Smallwares
main-menu,Thermometers,COLLECTION,/collections/thermometers,3,Smallwares
main-menu,Tongs,COLLECTION,/collections/tongs,3,Smallwares
main-menu,Trays & Tray Stands,COLLECTION,/collections/trays-tray-stands,3,Smallwares
main-menu,Kitchen Torches & Fuel,COLLECTION,/collections/kitchen-torches-fuel,3,Smallwares
main-menu,Chef Clothing,COLLECTION,/collections/chef-clothing,3,Smallwares
main-menu,Preparation Tools,COLLECTION,/collections/preparation-tools,3,Smallwares
main-menu,Server Supplies,COLLECTION,/collections/server-supplies,3,Smallwares
main-menu,Kitchen Timers,COLLECTION,/collections/kitchen-timers,3,Smallwares
main-menu,Bakery Utensils,COLLECTION,/collections/bakery-utensils,2,Product
main-menu,Baking Pans & Grids,COLLECTION,/collections/baking-pans-grids,3,Bakery Utensils
main-menu,Baking Molds,COLLECTION,/collections/baking-molds,3,Bakery Utensils
main-menu,Baking Tools & Utensils,COLLECTION,/collections/baking-tools-utensils,3,Bakery Utensils
main-menu,Decorating Tools,COLLECTION,/collections/decorating-tools,3,Bakery Utensils
main-menu,Proofing Baskets,COLLECTION,/collections/proofing-baskets,3,Bakery Utensils
main-menu,Loaf Pans,COLLECTION,/collections/loaf-pans,3,Bakery Utensils
main-menu,Pizza Pans & Tools,COLLECTION,/collections/pizza-pans-tools,3,Bakery Utensils
main-menu,Tableware & Buffetware,COLLECTION,/collections/tableware-buffetware,2,Product
main-menu,Dinnerware,COLLECTION,/collections/dinnerware,3,Tableware & Buffetware
main-menu,Insulated Dinnerware,COLLECTION,/collections/insulated-dinnerware,3,Tableware & Buffetware
main-menu,Flatware,COLLECTION,/collections/flatware,3,Tableware & Buffetware
main-menu,Servingware,COLLECTION,/collections/servingware,3,Tableware & Buffetware
main-menu,Plate Covers,COLLECTION,/collections/plate-covers,3,Tableware & Buffetware
main-menu,Display Covers,COLLECTION,/collections/display-covers,3,Tableware & Buffetware
main-menu,Condiment Servers,COLLECTION,/collections/condiment-servers,3,Tableware & Buffetware
main-menu,Beverageware,COLLECTION,/collections/beverageware,3,Tableware & Buffetware
main-menu,Beverage Service,COLLECTION,/collections/beverage-service,3,Tableware & Buffetware
main-menu,Tabletop Accessories,COLLECTION,/collections/tabletop-accessories,3,Tableware & Buffetware
main-menu,Buffetware,COLLECTION,/collections/buffetware,3,Tableware & Buffetware
main-menu,Janitorial Supplies,COLLECTION,/collections/janitorial-supplies,2,Product
main-menu,Trays & Tray Stands,COLLECTION,/collections/trays-tray-stands,3,Janitorial Supplies
main-menu,Janitorial Equipment,COLLECTION,/collections/janitorial-equipment,3,Janitorial Supplies
main-menu,Cleaning Tools,COLLECTION,/collections/cleaning-tools,3,Janitorial Supplies
main-menu,Janitorial Carts,COLLECTION,/collections/janitorial-carts,3,Janitorial Supplies
main-menu,Trash Bins,COLLECTION,/collections/trash-bins,3,Janitorial Supplies
main-menu,Mats,COLLECTION,/collections/mats,3,Janitorial Supplies
main-menu,Ladders,COLLECTION,/collections/ladders,3,Janitorial Supplies
main-menu,Cleaning Chemicals,COLLECTION,/collections/cleaning-chemicals,3,Janitorial Supplies
main-menu,Furniture & Seating,COLLECTION,/collections/furniture-seating,2,Product
main-menu,Baby Chairs,COLLECTION,/collections/baby-chairs,3,Furniture & Seating
main-menu,Disposables,COLLECTION,/collections/disposables,2,Product
main-menu,Food Label Stickers,COLLECTION,/collections/food-label-stickers,3,Disposables
main-menu,Spare Parts,PAGE,/pages/spare-parts,1,
main-menu,Consumables & Service Parts,COLLECTION,/collections/consumables-service-parts,2,Spare Parts
main-menu,Bag,COLLECTION,/collections/bag,3,Consumables & Service Parts
main-menu,Brush,COLLECTION,/collections/brush,3,Consumables & Service Parts
main-menu,Cable Tie,COLLECTION,/collections/cable-tie,3,Consumables & Service Parts
main-menu,Ceramic,COLLECTION,/collections/ceramic,3,Consumables & Service Parts
main-menu,Chemical,COLLECTION,/collections/chemical,3,Consumables & Service Parts
main-menu,Chopping Blade,COLLECTION,/collections/chopping-blade,3,Consumables & Service Parts
main-menu,Cleaner,COLLECTION,/collections/cleaner,3,Consumables & Service Parts
main-menu,Filter,COLLECTION,/collections/filter,3,Consumables & Service Parts
main-menu,Gasket,COLLECTION,/collections/gasket,3,Consumables & Service Parts
main-menu,Glue,COLLECTION,/collections/glue,3,Consumables & Service Parts
main-menu,Grease,COLLECTION,/collections/grease,3,Consumables & Service Parts
main-menu,Lubricant,COLLECTION,/collections/lubricant,3,Consumables & Service Parts
main-menu,Mop,COLLECTION,/collections/mop,3,Consumables & Service Parts
main-menu,Oil,COLLECTION,/collections/oil,3,Consumables & Service Parts
main-menu,O-Ring,COLLECTION,/collections/o-ring,3,Consumables & Service Parts
main-menu,Packing,COLLECTION,/collections/packing,3,Consumables & Service Parts
main-menu,Polish,COLLECTION,/collections/polish,3,Consumables & Service Parts
main-menu,Rubber,COLLECTION,/collections/rubber,3,Consumables & Service Parts
main-menu,Scouring Pad,COLLECTION,/collections/scouring-pad,3,Consumables & Service Parts
main-menu,Scraper,COLLECTION,/collections/scraper,3,Consumables & Service Parts
main-menu,Seal,COLLECTION,/collections/seal,3,Consumables & Service Parts
main-menu,Service Parts,COLLECTION,/collections/service-parts,3,Consumables & Service Parts
main-menu,Softener,COLLECTION,/collections/softener,3,Consumables & Service Parts
main-menu,Spoon,COLLECTION,/collections/spoon,3,Consumables & Service Parts
main-menu,Sticker,COLLECTION,/collections/sticker,3,Consumables & Service Parts
main-menu,Stone,COLLECTION,/collections/stone,3,Consumables & Service Parts
main-menu,Tape,COLLECTION,/collections/tape,3,Consumables & Service Parts
main-menu,Teflon,COLLECTION,/collections/teflon,3,Consumables & Service Parts
main-menu,Whip,COLLECTION,/collections/whip,3,Consumables & Service Parts
main-menu,Wipe,COLLECTION,/collections/wipe,3,Consumables & Service Parts
main-menu,Control Boards & Sensors,COLLECTION,/collections/control-boards-sensors,2,Spare Parts
main-menu,Control Panel,COLLECTION,/collections/control-panel,3,Control Boards & Sensors
main-menu,Controller,COLLECTION,/collections/controller,3,Control Boards & Sensors
main-menu,Converter,COLLECTION,/collections/converter,3,Control Boards & Sensors
main-menu,Display PCB,COLLECTION,/collections/display-pcb,3,Control Boards & Sensors
main-menu,Encoder,COLLECTION,/collections/encoder,3,Control Boards & Sensors
main-menu,Float Switch,COLLECTION,/collections/float-switch,3,Control Boards & Sensors
main-menu,Flow Meter,COLLECTION,/collections/flow-meter,3,Control Boards & Sensors
main-menu,Gauge,COLLECTION,/collections/gauge,3,Control Boards & Sensors
main-menu,Infrared Sensor,COLLECTION,/collections/infrared-sensor,3,Control Boards & Sensors
main-menu,Inverter,COLLECTION,/collections/inverter,3,Control Boards & Sensors
main-menu,Level Switch,COLLECTION,/collections/level-switch,3,Control Boards & Sensors
main-menu,Limit Switch,COLLECTION,/collections/limit-switch,3,Control Boards & Sensors
main-menu,Magnetic Sensor,COLLECTION,/collections/magnetic-sensor,3,Control Boards & Sensors
main-menu,Main Board,COLLECTION,/collections/main-board,3,Control Boards & Sensors
main-menu,Module,COLLECTION,/collections/module,3,Control Boards & Sensors
main-menu,PCB,COLLECTION,/collections/pcb,3,Control Boards & Sensors
main-menu,Photo Sensor,COLLECTION,/collections/photo-sensor,3,Control Boards & Sensors
main-menu,Position Sensor,COLLECTION,/collections/position-sensor,3,Control Boards & Sensors
main-menu,Pressure Switch,COLLECTION,/collections/pressure-switch,3,Control Boards & Sensors
main-menu,Probe,COLLECTION,/collections/probe,3,Control Boards & Sensors
main-menu,Proximity Sensor,COLLECTION,/collections/proximity-sensor,3,Control Boards & Sensors
main-menu,Sensor,COLLECTION,/collections/sensor,3,Control Boards & Sensors
main-menu,Speed Control,COLLECTION,/collections/speed-control,3,Control Boards & Sensors
main-menu,Temp Control,COLLECTION,/collections/temp-control,3,Control Boards & Sensors
main-menu,Thermocouple,COLLECTION,/collections/thermocouple,3,Control Boards & Sensors
main-menu,Thermometers,COLLECTION,/collections/thermometers,3,Control Boards & Sensors
main-menu,Thermopile,COLLECTION,/collections/thermopile,3,Control Boards & Sensors
main-menu,Thermostat,COLLECTION,/collections/thermostat,3,Control Boards & Sensors
main-menu,Timer,COLLECTION,/collections/timer,3,Control Boards & Sensors
main-menu,Transducer,COLLECTION,/collections/transducer,3,Control Boards & Sensors
main-menu,Electrical & Electronic Components,COLLECTION,/collections/electrical-electronic-components,2,Spare Parts
main-menu,Ballast,COLLECTION,/collections/ballast,3,Electrical & Electronic Components
main-menu,Buzzer,COLLECTION,/collections/buzzer,3,Electrical & Electronic Components
main-menu,Cable,COLLECTION,/collections/cable,3,Electrical & Electronic Components
main-menu,Capacitor,COLLECTION,/collections/capacitor,3,Electrical & Electronic Components
main-menu,Coil,COLLECTION,/collections/coil,3,Electrical & Electronic Components
main-menu,Connector,COLLECTION,/collections/connector,3,Electrical & Electronic Components
main-menu,Contactor,COLLECTION,/collections/contactor,3,Electrical & Electronic Components
main-menu,Diode,COLLECTION,/collections/diode,3,Electrical & Electronic Components
main-menu,Display,COLLECTION,/collections/display,3,Electrical & Electronic Components
main-menu,Door Switch,COLLECTION,/collections/door-switch,3,Electrical & Electronic Components
main-menu,Fuse,COLLECTION,/collections/fuse,3,Electrical & Electronic Components
main-menu,Indicator,COLLECTION,/collections/indicator,3,Electrical & Electronic Components
main-menu,Inductor,COLLECTION,/collections/inductor,3,Electrical & Electronic Components
main-menu,Lamp,COLLECTION,/collections/lamp,3,Electrical & Electronic Components
main-menu,Lamp Holder,COLLECTION,/collections/lamp-holder,3,Electrical & Electronic Components
main-menu,Light,COLLECTION,/collections/light,3,Electrical & Electronic Components
main-menu,Magnet Switch,COLLECTION,/collections/magnet-switch,3,Electrical & Electronic Components
main-menu,Magnetron,COLLECTION,/collections/magnetron,3,Electrical & Electronic Components
main-menu,Plug,COLLECTION,/collections/plug,3,Electrical & Electronic Components
main-menu,Potentiometer,COLLECTION,/collections/potentiometer,3,Electrical & Electronic Components
main-menu,Power Cord,COLLECTION,/collections/power-cord,3,Electrical & Electronic Components
main-menu,Relay,COLLECTION,/collections/relay,3,Electrical & Electronic Components
main-menu,Resistor,COLLECTION,/collections/resistor,3,Electrical & Electronic Components
main-menu,Rocker Switch,COLLECTION,/collections/rocker-switch,3,Electrical & Electronic Components
main-menu,Socket,COLLECTION,/collections/socket,3,Electrical & Electronic Components
main-menu,Speaker,COLLECTION,/collections/speaker,3,Electrical & Electronic Components
main-menu,Switch,COLLECTION,/collections/switch,3,Electrical & Electronic Components
main-menu,Terminal,COLLECTION,/collections/terminal,3,Electrical & Electronic Components
main-menu,Transformer,COLLECTION,/collections/transformer,3,Electrical & Electronic Components
main-menu,Wire,COLLECTION,/collections/wire,3,Electrical & Electronic Components
main-menu,Mechanical & Mounting Hardware,COLLECTION,/collections/mechanical-mounting-hardware,2,Spare Parts
main-menu,Adapter,COLLECTION,/collections/adapter,3,Mechanical & Mounting Hardware
main-menu,Adjuster,COLLECTION,/collections/adjuster,3,Mechanical & Mounting Hardware
main-menu,Bearing Housing,COLLECTION,/collections/bearing-housing,3,Mechanical & Mounting Hardware
main-menu,Bolt,COLLECTION,/collections/bolt,3,Mechanical & Mounting Hardware
main-menu,Bracket,COLLECTION,/collections/bracket,3,Mechanical & Mounting Hardware
main-menu,Bushing,COLLECTION,/collections/bushing,3,Mechanical & Mounting Hardware
main-menu,Clamp,COLLECTION,/collections/clamp,3,Mechanical & Mounting Hardware
main-menu,Clip,COLLECTION,/collections/clip,3,Mechanical & Mounting Hardware
main-menu,Coupler Shaft,COLLECTION,/collections/coupler-shaft,3,Mechanical & Mounting Hardware
main-menu,Fastener,COLLECTION,/collections/fastener,3,Mechanical & Mounting Hardware
main-menu,Frame,COLLECTION,/collections/frame,3,Mechanical & Mounting Hardware
main-menu,Guide Rail,COLLECTION,/collections/guide-rail,3,Mechanical & Mounting Hardware
main-menu,Hinge,COLLECTION,/collections/hinge,3,Mechanical & Mounting Hardware
main-menu,Holder,COLLECTION,/collections/holder,3,Mechanical & Mounting Hardware
main-menu,Hook,COLLECTION,/collections/hook,3,Mechanical & Mounting Hardware
main-menu,Joint,COLLECTION,/collections/joint,3,Mechanical & Mounting Hardware
main-menu,Lever,COLLECTION,/collections/lever,3,Mechanical & Mounting Hardware
main-menu,Lock Nut,COLLECTION,/collections/lock-nut,3,Mechanical & Mounting Hardware
main-menu,Mount,COLLECTION,/collections/mount,3,Mechanical & Mounting Hardware
main-menu,Nut,COLLECTION,/collections/nut,3,Mechanical & Mounting Hardware
main-menu,Pin,COLLECTION,/collections/pin,3,Mechanical & Mounting Hardware
main-menu,Plate,COLLECTION,/collections/plate,3,Mechanical & Mounting Hardware
main-menu,Retainer,COLLECTION,/collections/retainer,3,Mechanical & Mounting Hardware
main-menu,Ring,COLLECTION,/collections/ring,3,Mechanical & Mounting Hardware
main-menu,Screw,COLLECTION,/collections/screw,3,Mechanical & Mounting Hardware
main-menu,Spacer,COLLECTION,/collections/spacer,3,Mechanical & Mounting Hardware
main-menu,Spring Mount,COLLECTION,/collections/spring-mount,3,Mechanical & Mounting Hardware
main-menu,Stopper,COLLECTION,/collections/stopper,3,Mechanical & Mounting Hardware
main-menu,Support,COLLECTION,/collections/support,3,Mechanical & Mounting Hardware
main-menu,Washer,COLLECTION,/collections/washer,3,Mechanical & Mounting Hardware
main-menu,Safety & Protection Devices,COLLECTION,/collections/safety-protection-devices,2,Spare Parts
main-menu,Alarm,COLLECTION,/collections/alarm,3,Safety & Protection Devices
main-menu,Barrier,COLLECTION,/collections/barrier,3,Safety & Protection Devices
main-menu,Breaker,COLLECTION,/collections/breaker,3,Safety & Protection Devices
main-menu,Circuit Protector,COLLECTION,/collections/circuit-protector,3,Safety & Protection Devices
main-menu,Cover Plate,COLLECTION,/collections/cover-plate,3,Safety & Protection Devices
main-menu,Earth Leakage,COLLECTION,/collections/earth-leakage,3,Safety & Protection Devices
main-menu,Emergency Stop Button,COLLECTION,/collections/emergency-stop-button,3,Safety & Protection Devices
main-menu,Emergency Switch,COLLECTION,/collections/emergency-switch,3,Safety & Protection Devices
main-menu,Fuse Box,COLLECTION,/collections/fuse-box,3,Safety & Protection Devices
main-menu,Fuse Holder,COLLECTION,/collections/fuse-holder,3,Safety & Protection Devices
main-menu,Fuse Link,COLLECTION,/collections/fuse-link,3,Safety & Protection Devices
main-menu,Guard Plate,COLLECTION,/collections/guard-plate,3,Safety & Protection Devices
main-menu,Heat Shield,COLLECTION,/collections/heat-shield,3,Safety & Protection Devices
main-menu,Indicator Lamp,COLLECTION,/collections/indicator-lamp,3,Safety & Protection Devices
main-menu,Isolation Switch,COLLECTION,/collections/isolation-switch,3,Safety & Protection Devices
main-menu,Lockout Device,COLLECTION,/collections/lockout-device,3,Safety & Protection Devices
main-menu,Overload,COLLECTION,/collections/overload,3,Safety & Protection Devices
main-menu,Protective Cap,COLLECTION,/collections/protective-cap,3,Safety & Protection Devices
main-menu,Relay Socket,COLLECTION,/collections/relay-socket,3,Safety & Protection Devices
main-menu,Reset Switch,COLLECTION,/collections/reset-switch,3,Safety & Protection Devices
main-menu,Safety Barrier,COLLECTION,/collections/safety-barrier,3,Safety & Protection Devices
main-menu,Safety Cover,COLLECTION,/collections/safety-cover,3,Safety & Protection Devices
main-menu,Safety Switch,COLLECTION,/collections/safety-switch,3,Safety & Protection Devices
main-menu,Sensor Alarm,COLLECTION,/collections/sensor-alarm,3,Safety & Protection Devices
main-menu,Shield,COLLECTION,/collections/shield,3,Safety & Protection Devices
main-menu,Surge Protector,COLLECTION,/collections/surge-protector,3,Safety & Protection Devices
main-menu,Switch Guard,COLLECTION,/collections/switch-guard,3,Safety & Protection Devices
main-menu,Thermal Cutoff,COLLECTION,/collections/thermal-cutoff,3,Safety & Protection Devices
main-menu,Thermal Relay,COLLECTION,/collections/thermal-relay,3,Safety & Protection Devices
main-menu,Structural & Access Components,COLLECTION,/collections/structural-access-components,2,Spare Parts
main-menu,Access Handle,COLLECTION,/collections/access-handle,3,Structural & Access Components
main-menu,Access Hinge,COLLECTION,/collections/access-hinge,3,Structural & Access Components
main-menu,Access Panel,COLLECTION,/collections/access-panel,3,Structural & Access Components
main-menu,Access Plate,COLLECTION,/collections/access-plate,3,Structural & Access Components
main-menu,Body,COLLECTION,/collections/body,3,Structural & Access Components
main-menu,Case,COLLECTION,/collections/case,3,Structural & Access Components
main-menu,Cover,COLLECTION,/collections/cover,3,Structural & Access Components
main-menu,Divider Bar,COLLECTION,/collections/divider-bar,3,Structural & Access Components
main-menu,Door,COLLECTION,/collections/door,3,Structural & Access Components
main-menu,Door Lock,COLLECTION,/collections/door-lock,3,Structural & Access Components
main-menu,Door Seal,COLLECTION,/collections/door-seal,3,Structural & Access Components
main-menu,Door Spring,COLLECTION,/collections/door-spring,3,Structural & Access Components
main-menu,Enclosure,COLLECTION,/collections/enclosure,3,Structural & Access Components
main-menu,Frame Guard,COLLECTION,/collections/frame-guard,3,Structural & Access Components
main-menu,Grill Cover,COLLECTION,/collections/grill-cover,3,Structural & Access Components
main-menu,Grille,COLLECTION,/collections/grille,3,Structural & Access Components
main-menu,Guard,COLLECTION,/collections/guard,3,Structural & Access Components
main-menu,Hatch,COLLECTION,/collections/hatch,3,Structural & Access Components
main-menu,Housing,COLLECTION,/collections/housing,3,Structural & Access Components
main-menu,Insulator,COLLECTION,/collections/insulator,3,Structural & Access Components
main-menu,Latch,COLLECTION,/collections/latch,3,Structural & Access Components
main-menu,Lid,COLLECTION,/collections/lid,3,Structural & Access Components
main-menu,Panel,COLLECTION,/collections/panel,3,Structural & Access Components
main-menu,Partition,COLLECTION,/collections/partition,3,Structural & Access Components
main-menu,Protection,COLLECTION,/collections/protection,3,Structural & Access Components
main-menu,Seal Frame,COLLECTION,/collections/seal-frame,3,Structural & Access Components
main-menu,Trim,COLLECTION,/collections/trim,3,Structural & Access Components
main-menu,Vent Panel,COLLECTION,/collections/vent-panel,3,Structural & Access Components
main-menu,Window,COLLECTION,/collections/window,3,Structural & Access Components
main-menu,"Heating, Ignition & Gas Parts",COLLECTION,/collections/heating-ignition-gas-parts,2,Spare Parts
main-menu,Boiler,COLLECTION,/collections/boiler,3,"Heating, Ignition & Gas Parts"
main-menu,Burner,COLLECTION,/collections/burner,3,"Heating, Ignition & Gas Parts"
main-menu,Ceramic Heater,COLLECTION,/collections/ceramic-heater,3,"Heating, Ignition & Gas Parts"
main-menu,Electrode,COLLECTION,/collections/electrode,3,"Heating, Ignition & Gas Parts"
main-menu,Flame Rod,COLLECTION,/collections/flame-rod,3,"Heating, Ignition & Gas Parts"
main-menu,Flame Sensor,COLLECTION,/collections/flame-sensor,3,"Heating, Ignition & Gas Parts"
main-menu,Gas Regulator,COLLECTION,/collections/gas-regulator,3,"Heating, Ignition & Gas Parts"
main-menu,Gas Tube,COLLECTION,/collections/gas-tube,3,"Heating, Ignition & Gas Parts"
main-menu,Gas Valve,COLLECTION,/collections/gas-valve,3,"Heating, Ignition & Gas Parts"
main-menu,Heat Exchanger,COLLECTION,/collections/heat-exchanger,3,"Heating, Ignition & Gas Parts"
main-menu,Heater,COLLECTION,/collections/heater,3,"Heating, Ignition & Gas Parts"
main-menu,Heater Element,COLLECTION,/collections/heater-element,3,"Heating, Ignition & Gas Parts"
main-menu,Heating Plate,COLLECTION,/collections/heating-plate,3,"Heating, Ignition & Gas Parts"
main-menu,Ignitor,COLLECTION,/collections/ignitor,3,"Heating, Ignition & Gas Parts"
main-menu,Infrared Heater,COLLECTION,/collections/infrared-heater,3,"Heating, Ignition & Gas Parts"
main-menu,Main Gas,COLLECTION,/collections/main-gas,3,"Heating, Ignition & Gas Parts"
main-menu,Oven Burner,COLLECTION,/collections/oven-burner,3,"Heating, Ignition & Gas Parts"
main-menu,Piezo,COLLECTION,/collections/piezo,3,"Heating, Ignition & Gas Parts"
main-menu,Pilot,COLLECTION,/collections/pilot,3,"Heating, Ignition & Gas Parts"
main-menu,Pilot Assembly,COLLECTION,/collections/pilot-assembly,3,"Heating, Ignition & Gas Parts"
main-menu,Pilot Burner,COLLECTION,/collections/pilot-burner,3,"Heating, Ignition & Gas Parts"
main-menu,Pilot Injector,COLLECTION,/collections/pilot-injector,3,"Heating, Ignition & Gas Parts"
main-menu,Pilot Valve,COLLECTION,/collections/pilot-valve,3,"Heating, Ignition & Gas Parts"
main-menu,Quartz Tube,COLLECTION,/collections/quartz-tube,3,"Heating, Ignition & Gas Parts"
main-menu,Quartz Tube Heater,COLLECTION,/collections/quartz-tube-heater,3,"Heating, Ignition & Gas Parts"
main-menu,Spark Plug,COLLECTION,/collections/spark-plug,3,"Heating, Ignition & Gas Parts"
main-menu,Temperature Sensor,COLLECTION,/collections/temperature-sensor,3,"Heating, Ignition & Gas Parts"
main-menu,Thermal Fuse,COLLECTION,/collections/thermal-fuse,3,"Heating, Ignition & Gas Parts"
main-menu,Thermo Fuse,COLLECTION,/collections/thermo-fuse,3,"Heating, Ignition & Gas Parts"
main-menu,Thermostat Rod,COLLECTION,/collections/thermostat-rod,3,"Heating, Ignition & Gas Parts"
main-menu,"Motors, Fans & Actuators",COLLECTION,/collections/motors-fans-actuators,2,Spare Parts
main-menu,Actuator,COLLECTION,/collections/actuator,3,"Motors, Fans & Actuators"
main-menu,Armature,COLLECTION,/collections/armature,3,"Motors, Fans & Actuators"
main-menu,Bearing,COLLECTION,/collections/bearing,3,"Motors, Fans & Actuators"
main-menu,Blower,COLLECTION,/collections/blower,3,"Motors, Fans & Actuators"
main-menu,Clutch,COLLECTION,/collections/clutch,3,"Motors, Fans & Actuators"
main-menu,Coupling,COLLECTION,/collections/coupling,3,"Motors, Fans & Actuators"
main-menu,Drive Belt,COLLECTION,/collections/drive-belt,3,"Motors, Fans & Actuators"
main-menu,Drive Unit,COLLECTION,/collections/drive-unit,3,"Motors, Fans & Actuators"
main-menu,Fan,COLLECTION,/collections/fan,3,"Motors, Fans & Actuators"
main-menu,Gear,COLLECTION,/collections/gear,3,"Motors, Fans & Actuators"
main-menu,Gearbox,COLLECTION,/collections/gearbox,3,"Motors, Fans & Actuators"
main-menu,Linear Actuator,COLLECTION,/collections/linear-actuator,3,"Motors, Fans & Actuators"
main-menu,Motor,COLLECTION,/collections/motor,3,"Motors, Fans & Actuators"
main-menu,Motor Bracket,COLLECTION,/collections/motor-bracket,3,"Motors, Fans & Actuators"
main-menu,Motor Bushing,COLLECTION,/collections/motor-bushing,3,"Motors, Fans & Actuators"
main-menu,Motor Frame,COLLECTION,/collections/motor-frame,3,"Motors, Fans & Actuators"
main-menu,Motor Mount,COLLECTION,/collections/motor-mount,3,"Motors, Fans & Actuators"
main-menu,Motor Pin,COLLECTION,/collections/motor-pin,3,"Motors, Fans & Actuators"
main-menu,Motor Plate,COLLECTION,/collections/motor-plate,3,"Motors, Fans & Actuators"
main-menu,Motor Ring,COLLECTION,/collections/motor-ring,3,"Motors, Fans & Actuators"
main-menu,Motor Spacer,COLLECTION,/collections/motor-spacer,3,"Motors, Fans & Actuators"
main-menu,Motor Stopper,COLLECTION,/collections/motor-stopper,3,"Motors, Fans & Actuators"
main-menu,Motor Support,COLLECTION,/collections/motor-support,3,"Motors, Fans & Actuators"
main-menu,Pulley,COLLECTION,/collections/pulley,3,"Motors, Fans & Actuators"
main-menu,Rotor,COLLECTION,/collections/rotor,3,"Motors, Fans & Actuators"
main-menu,Servo Motor,COLLECTION,/collections/servo-motor,3,"Motors, Fans & Actuators"
main-menu,Shaft,COLLECTION,/collections/shaft,3,"Motors, Fans & Actuators"
main-menu,Spring,COLLECTION,/collections/spring,3,"Motors, Fans & Actuators"
main-menu,Startor,COLLECTION,/collections/startor,3,"Motors, Fans & Actuators"
main-menu,Stator,COLLECTION,/collections/stator,3,"Motors, Fans & Actuators"
main-menu,"Pumps, Compressors & Fluid Systems",COLLECTION,/collections/pumps-compressors-fluid-systems,2,Spare Parts
main-menu,Check Valve,COLLECTION,/collections/check-valve,3,"Pumps, Compressors & Fluid Systems"
main-menu,Compressor,COLLECTION,/collections/compressor,3,"Pumps, Compressors & Fluid Systems"
main-menu,Condenser,COLLECTION,/collections/condenser,3,"Pumps, Compressors & Fluid Systems"
main-menu,Coupler,COLLECTION,/collections/coupler,3,"Pumps, Compressors & Fluid Systems"
main-menu,Drain,COLLECTION,/collections/drain,3,"Pumps, Compressors & Fluid Systems"
main-menu,Drain Plug,COLLECTION,/collections/drain-plug,3,"Pumps, Compressors & Fluid Systems"
main-menu,Evaporator,COLLECTION,/collections/evaporator,3,"Pumps, Compressors & Fluid Systems"
main-menu,Expansion Valve,COLLECTION,/collections/expansion-valve,3,"Pumps, Compressors & Fluid Systems"
main-menu,Faucet,COLLECTION,/collections/faucet,3,"Pumps, Compressors & Fluid Systems"
main-menu,Fitting,COLLECTION,/collections/fitting,3,"Pumps, Compressors & Fluid Systems"
main-menu,Float Valve,COLLECTION,/collections/float-valve,3,"Pumps, Compressors & Fluid Systems"
main-menu,Flow Regulator,COLLECTION,/collections/flow-regulator,3,"Pumps, Compressors & Fluid Systems"
main-menu,Fluid Filter,COLLECTION,/collections/fluid-filter,3,"Pumps, Compressors & Fluid Systems"
main-menu,Hose,COLLECTION,/collections/hose,3,"Pumps, Compressors & Fluid Systems"
main-menu,Hydraulic Pump,COLLECTION,/collections/hydraulic-pump,3,"Pumps, Compressors & Fluid Systems"
main-menu,Manifold,COLLECTION,/collections/manifold,3,"Pumps, Compressors & Fluid Systems"
main-menu,Nozzle,COLLECTION,/collections/nozzle,3,"Pumps, Compressors & Fluid Systems"
main-menu,Pipe,COLLECTION,/collections/pipe,3,"Pumps, Compressors & Fluid Systems"
main-menu,Pipe Clamp,COLLECTION,/collections/pipe-clamp,3,"Pumps, Compressors & Fluid Systems"
main-menu,Pipe Connector,COLLECTION,/collections/pipe-connector,3,"Pumps, Compressors & Fluid Systems"
main-menu,Pressure Gauge,COLLECTION,/collections/pressure-gauge,3,"Pumps, Compressors & Fluid Systems"
main-menu,Pump,COLLECTION,/collections/pump,3,"Pumps, Compressors & Fluid Systems"
main-menu,Regulator,COLLECTION,/collections/regulator,3,"Pumps, Compressors & Fluid Systems"
main-menu,Solenoid,COLLECTION,/collections/solenoid,3,"Pumps, Compressors & Fluid Systems"
main-menu,Spray Nozzle,COLLECTION,/collections/spray-nozzle,3,"Pumps, Compressors & Fluid Systems"
main-menu,Tank,COLLECTION,/collections/tank,3,"Pumps, Compressors & Fluid Systems"
main-menu,Tap,COLLECTION,/collections/tap,3,"Pumps, Compressors & Fluid Systems"
main-menu,Union Joint,COLLECTION,/collections/union-joint,3,"Pumps, Compressors & Fluid Systems"
main-menu,Vacuum Pump,COLLECTION,/collections/vacuum-pump,3,"Pumps, Compressors & Fluid Systems"
main-menu,Valve,COLLECTION,/collections/valve,3,"Pumps, Compressors & Fluid Systems"
main-menu,"Storage, Handling & Mobility",COLLECTION,/collections/storage-handling-mobility,2,Spare Parts
main-menu,Basket,COLLECTION,/collections/basket,3,"Storage, Handling & Mobility"
main-menu,Bin,COLLECTION,/collections/bin,3,"Storage, Handling & Mobility"
main-menu,Bowl,COLLECTION,/collections/bowl,3,"Storage, Handling & Mobility"
main-menu,Caddy,COLLECTION,/collections/caddy,3,"Storage, Handling & Mobility"
main-menu,Cart,COLLECTION,/collections/cart,3,"Storage, Handling & Mobility"
main-menu,Caster Wheel,COLLECTION,/collections/caster-wheel,3,"Storage, Handling & Mobility"
main-menu,Container,COLLECTION,/collections/container,3,"Storage, Handling & Mobility"
main-menu,Drawer,COLLECTION,/collections/drawer,3,"Storage, Handling & Mobility"
main-menu,Drawer Rail,COLLECTION,/collections/drawer-rail,3,"Storage, Handling & Mobility"
main-menu,Foot,COLLECTION,/collections/foot,3,"Storage, Handling & Mobility"
main-menu,Frame Base,COLLECTION,/collections/frame-base,3,"Storage, Handling & Mobility"
main-menu,Frame Support,COLLECTION,/collections/frame-support,3,"Storage, Handling & Mobility"
main-menu,Handle Grip,COLLECTION,/collections/handle-grip,3,"Storage, Handling & Mobility"
main-menu,Leg,COLLECTION,/collections/leg,3,"Storage, Handling & Mobility"
main-menu,Pan,COLLECTION,/collections/pan,3,"Storage, Handling & Mobility"
main-menu,Platform,COLLECTION,/collections/platform,3,"Storage, Handling & Mobility"
main-menu,Rack,COLLECTION,/collections/rack,3,"Storage, Handling & Mobility"
main-menu,Roller,COLLECTION,/collections/roller,3,"Storage, Handling & Mobility"
main-menu,Shelf,COLLECTION,/collections/shelf,3,"Storage, Handling & Mobility"
main-menu,Stand,COLLECTION,/collections/stand,3,"Storage, Handling & Mobility"
main-menu,Storage Box,COLLECTION,/collections/storage-box,3,"Storage, Handling & Mobility"
main-menu,Table Stand,COLLECTION,/collections/table-stand,3,"Storage, Handling & Mobility"
main-menu,Tool Holder,COLLECTION,/collections/tool-holder,3,"Storage, Handling & Mobility"
main-menu,Tray,COLLECTION,/collections/tray,3,"Storage, Handling & Mobility"
main-menu,Tray Holder,COLLECTION,/collections/tray-holder,3,"Storage, Handling & Mobility"
main-menu,Trolley,COLLECTION,/collections/trolley,3,"Storage, Handling & Mobility"
main-menu,Utensil Holder,COLLECTION,/collections/utensil-holder,3,"Storage, Handling & Mobility"
main-menu,Wheel,COLLECTION,/collections/wheel,3,"Storage, Handling & Mobility"
main-menu,Wheel Stopper,COLLECTION,/collections/wheel-stopper,3,"Storage, Handling & Mobility"
main-menu,Table,COLLECTION,/collections/table,3,"Storage, Handling & Mobility"
main-menu,Hotel Supplies,COLLECTION,/collections/hotel-supplies,1,
main-menu,Refrigeration,COLLECTION,/collections/refrigeration,2,Hotel Supplies
main-menu,Safe Boxes,COLLECTION,/collections/safe-boxes,2,Hotel Supplies
main-menu,Electric Kettles,COLLECTION,/collections/electric-kettles,2,Hotel Supplies
main-menu,Bath Mats,COLLECTION,/collections/bath-mats,2,Hotel Supplies
main-menu,Luggage Racks,COLLECTION,/collections/luggage-racks,2,Hotel Supplies
main-menu,Torches,COLLECTION,/collections/torches,2,Hotel Supplies
main-menu,Bed & Bath Linens,COLLECTION,/collections/bed-bath-linens,2,Hotel Supplies
main-menu,Lobby Supplies,COLLECTION,/collections/lobby-supplies,2,Hotel Supplies
main-menu,Bathroom Accessories,COLLECTION,/collections/bathroom-accessories,2,Hotel Supplies
main-menu,Telephone,COLLECTION,/collections/telephone,2,Hotel Supplies
main-menu,Services,FRONTPAGE,/,1,
main-menu,Brand,PAGE,/pages/brand,1,
main-menu,Catalogue,PAGE,/pages/catalog,1,
main-menu,Blog,BLOG,/blogs/news,1,`;

export const NTS_MENU_TREE = buildMenuTree(MENU_CSV);
