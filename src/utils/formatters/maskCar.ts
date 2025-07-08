export const maskCAR = (value: string) => {
  const alnum = value.replace(/[^A-Za-z0-9]/g, "");

  const part1 = alnum
    .slice(0, 2)
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();

  const rest = alnum.slice(2);

  const part2 = rest
    .slice(0, 7)
    .replace(/[^0-9]/g, "");

  const part3 = rest
    .slice(7, 7 + 33)
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();
  const segments = [];
  if (part1) segments.push(part1);
  if (part2) segments.push(part2);
  if (part3) segments.push(part3);

  return segments.join("-");
};
