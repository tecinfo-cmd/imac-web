export async function convertShapefileToWkt(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("https://shp2wkt-api.agrotools.com.br/convert-shapefile", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data?.features?.[0]?.geometry_wkt ?? null;
}