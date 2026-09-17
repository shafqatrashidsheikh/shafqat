/**
 * Real OSM building footprints for Government Polytechnic for Women, Srinagar.
 * Source: OpenStreetMap Overpass (2026-09-13) around Nominatim match
 *   way/1533818132 "Government Polytechnic for Women"
 *   34.07905°N, 74.76309°E — Bemina Bypass, Srinagar 190018
 *
 * Only `building=college` ways in the verified cluster are included.
 * No invented departments, roads, trees, or facilities.
 * Coordinates: WGS84 [lng, lat] closed rings (last point repeats first where OSM closed).
 */

export const GPW_CAMPUS_ORIGIN = { lng: 74.763321, lat: 34.078943 } as const;

export type CampusFootprint = {
  id: string;
  osmId: string;
  /** Hover label — OSM name when present; otherwise a non-specific campus label. */
  label: string;
  /** Stylized massing only — OSM has no building:levels on these ways. */
  storeys: 1 | 2;
  ring: readonly (readonly [number, number])[];
};

/** Named main college building — OSM way 1533818132 */
const MAIN: CampusFootprint = {
  id: "osm-1533818132",
  osmId: "1533818132",
  label: "Government Polytechnic for Women",
  storeys: 2,
  ring: [
    [74.763117, 34.079200],
    [74.763278, 34.078909],
    [74.763478, 34.078966],
    [74.763323, 34.079286],
    [74.763478, 34.079333],
    [74.763698, 34.078969],
    [74.763607, 34.078918],
    [74.763591, 34.078874],
    [74.763530, 34.078802],
    [74.763340, 34.078753],
    [74.763320, 34.078787],
    [74.763243, 34.078756],
    [74.763230, 34.078773],
    [74.763198, 34.078758],
    [74.763182, 34.078781],
    [74.763129, 34.078773],
    [74.762928, 34.079130],
    [74.763117, 34.079200],
  ],
};

/** Unnamed OSM college building — way 1533818133 */
const COLLEGE_A: CampusFootprint = {
  id: "osm-1533818133",
  osmId: "1533818133",
  label: "Campus Building",
  storeys: 2,
  ring: [
    [74.762633, 34.077875],
    [74.762928, 34.077975],
    [74.762955, 34.077889],
    [74.762862, 34.077854],
    [74.763041, 34.077481],
    [74.763114, 34.077524],
    [74.763167, 34.077445],
    [74.763083, 34.077412],
    [74.763091, 34.077390],
    [74.762888, 34.077328],
    [74.762851, 34.077395],
    [74.762793, 34.077363],
    [74.762760, 34.077456],
    [74.762827, 34.077489],
    [74.762770, 34.077573],
    [74.762656, 34.077543],
    [74.762622, 34.077641],
    [74.762721, 34.077674],
    [74.762699, 34.077716],
    [74.762617, 34.077694],
    [74.762569, 34.077813],
    [74.762640, 34.077832],
    [74.762633, 34.077875],
  ],
};

/** Unnamed OSM college building — way 1533818138 */
const COLLEGE_B: CampusFootprint = {
  id: "osm-1533818138",
  osmId: "1533818138",
  label: "Campus Building",
  storeys: 2,
  ring: [
    [74.763938, 34.078806],
    [74.764118, 34.078865],
    [74.764197, 34.078701],
    [74.764253, 34.078728],
    [74.764283, 34.078683],
    [74.764221, 34.078660],
    [74.764300, 34.078513],
    [74.764131, 34.078472],
    [74.764080, 34.078593],
    [74.764054, 34.078591],
    [74.763938, 34.078806],
  ],
};

/** Unnamed OSM college building — way 1533818142 */
const COLLEGE_C: CampusFootprint = {
  id: "osm-1533818142",
  osmId: "1533818142",
  label: "Campus Building",
  storeys: 1,
  ring: [
    [74.763976, 34.078191],
    [74.763998, 34.078162],
    [74.764044, 34.078148],
    [74.764053, 34.078154],
    [74.764079, 34.078145],
    [74.764077, 34.078138],
    [74.764217, 34.078088],
    [74.764218, 34.078094],
    [74.764247, 34.078084],
    [74.764245, 34.078078],
    [74.764310, 34.078053],
    [74.764283, 34.077974],
    [74.764143, 34.078019],
    [74.764096, 34.077904],
    [74.764056, 34.077920],
    [74.764003, 34.077942],
    [74.764054, 34.078051],
    [74.763926, 34.078097],
    [74.763976, 34.078191],
  ],
};

export const GPW_CAMPUS_FOOTPRINTS: readonly CampusFootprint[] = [
  MAIN,
  COLLEGE_A,
  COLLEGE_B,
  COLLEGE_C,
] as const;

/** Soft precinct = padded axis-aligned bounds of the verified college cluster. */
export const GPW_CAMPUS_PRECINCT: readonly (readonly [number, number])[] = (() => {
  const pts = GPW_CAMPUS_FOOTPRINTS.flatMap((f) => f.ring);
  const lngs = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const padLng = 0.00035;
  const padLat = 0.00028;
  const minLng = Math.min(...lngs) - padLng;
  const maxLng = Math.max(...lngs) + padLng;
  const minLat = Math.min(...lats) - padLat;
  const maxLat = Math.max(...lats) + padLat;
  return [
    [minLng, minLat],
    [maxLng, minLat],
    [maxLng, maxLat],
    [minLng, maxLat],
    [minLng, minLat],
  ] as const;
})();

export const GPW_CAMPUS_META = {
  lat: 34.07905,
  lng: 74.76309,
  plusCode: "3QH7+G83",
  address: "Government Polytechnic for Women, Bemina, Srinagar, J&K 190018",
  name: "Government Polytechnic for Women, Srinagar",
  osmSource: "OpenStreetMap · ways 1533818132, 1533818133, 1533818138, 1533818142",
} as const;
