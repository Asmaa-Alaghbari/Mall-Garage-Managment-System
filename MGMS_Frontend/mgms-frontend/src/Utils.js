// Common utility functions

import React from "react";

// Format date and time
export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US");
};

// Highlight the search term in the text
export const highlightText = (text, highlight) => {
  if (!text || !highlight) {
    return text; // Return text as is if either text or highlight is undefined
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

// Paginate array
export const paginate = (items, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return items.slice(indexOfFirstItem, indexOfLastItem);
};
