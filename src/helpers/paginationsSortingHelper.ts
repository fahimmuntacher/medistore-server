type IOptions = {
  page?: number | string;
  limit?: number | string;
  sortOrder?: "asc" | "desc" | string;
  sortBy?: string;
};

type IOptionsResults = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export const paginationsSortingHelper = (
  options: IOptions
): IOptionsResults => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";

  const sortOrder =
    options.sortOrder === "asc" ? "asc" : "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
