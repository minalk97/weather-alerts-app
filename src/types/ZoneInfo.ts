// export type ZoneInfo = {
//   type: "FeatureCollection";
//   features: ZoneFeature[];
// };

export type ZoneFeature = {
  id: string;
  type: "Feature";
  properties: ZoneProperties;
};

export type ZoneProperties = {
  id: string;
  type: "land" | "marine"; // Assuming it could be either
  name: string;
};
