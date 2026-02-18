import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const DynamicPagination = ({
  itemsCount,
  pageSize,
  onPageChange,
  currentPage
}) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);
  return (
    <Pagination>
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink
          previous
          tag="button"
          className="page-link clickable"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </PaginationLink>
      </PaginationItem>
      {pages.map(page => (
        <PaginationItem
          key={page}
          className={page === currentPage ? "page-item active" : "page_item"}
        >
          <PaginationLink
            tag="button"
            className="page-link clickable"
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={currentPage >= pagesCount}>
        <PaginationLink
          next
          tag="button"
          className="page-link clickable"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};
DynamicPagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};
export default DynamicPagination;
