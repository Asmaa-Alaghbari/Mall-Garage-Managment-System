namespace mgms_backend.Utilities
{
    public class PaginationList<T>
    {
        public int PageNumber { get; private set; } // Current page number (1-indexed) 
        public int PageSize { get; private set; } // Number of items per page 
        public int TotalCount { get; private set; } // Total number of items 
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize); // Total number of pages 
        public bool HasPreviousPage => PageNumber > 1; // True if there is a previous page 
        public bool HasNextPage => PageNumber < TotalPages; // True if there is a next page

        public List<T> Items { get; private set; } // List of items on the current page

        public PaginationList(List<T> items, int count, int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalCount = count;
            Items = items;
        }

        // Create a new Pagination object from a source IQueryable with the given page number and page size
        public static PaginationList<T> Create(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = source.Count();
            var items = source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            return new PaginationList<T>(items, count, pageNumber, pageSize);
        }
    }
}
