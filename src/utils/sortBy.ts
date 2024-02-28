export type SortByObject = Record<string, -1 | 1>;

export default function stringToSortBy(
  sortBy: string | undefined
): SortByObject {
  const sortByObject: SortByObject = {};
  if (sortBy) {
    const [field, order] = sortBy.split(":");
    sortByObject[field] = order === "desc" ? -1 : 1;
  }

  return sortByObject;
}
