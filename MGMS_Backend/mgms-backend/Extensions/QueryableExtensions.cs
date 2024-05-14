using System.Linq.Dynamic.Core;

namespace mgms_backend.Extensions
{
    // Allows to order by a property name dynamically 
    public static class QueryableExtensions
    {
        public static IQueryable<T> OrderByDynamic<T>(this IQueryable<T> source, string propertyName)
        {
            return ReferenceEquals(null, propertyName) ? source : source.OrderBy(propertyName);
        }
    }
}
