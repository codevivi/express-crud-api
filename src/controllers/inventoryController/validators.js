import CustomError from "../../utils/CustomError.js";
import { defaultItemsPerPage, minItemsPerPage, maxItemsPerPage } from "../../config/perPageConfig.js";

export const validatePageReqParams = (req, totalItemsCount) => {
  let page = req?.params.page;
  let size = req?.params.size;
  if (typeof page === "undefined") {
    page = 1;
  } else {
    page = Number(page);
    if (!Number.isInteger(page) || isNaN(page)) {
      throw new CustomError(400, "failure", "Bad request parameters, please provide page as integer");
    }
  }
  if (typeof size === "undefined") {
    size = defaultItemsPerPage;
  } else {
    size = Number(size);
    if (!Number.isInteger(size) || isNaN(size)) {
      throw new CustomError(400, "failure", "Bad request parameters, please provide size (items per page) as integer");
    }
    if (size < minItemsPerPage || size > maxItemsPerPage) {
      throw new CustomError(400, "failure", `Bad request, please provide size (items per page) as integer between ${minItemsPerPage}-${maxItemsPerPage}`);
    }
  }
  if (page !== 1 && totalItemsCount - (page - 1) * size <= 0) {
    throw new CustomError(404, "failure", "Not found");
  }
  return [page, size];
};
