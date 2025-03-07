export type ZoneFeature = {
  id: string;
  type: "Feature";
  properties: ZoneProperties;
};

export type ZoneProperties = {
  id: string;
  type: "land" | "marine";
  name: string;
};
