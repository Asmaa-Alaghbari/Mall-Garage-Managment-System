using System.ComponentModel.DataAnnotations;
using mgms_backend.Entities.Reservations;

namespace mgms_backend.Entities.Services
{
    // Represent the service entity in the database
    public class Service
    {
        [Key] // Data annotation for the primary key
        public int ServiceId { get; set; }
        public decimal Price { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation properties for related entities
        public virtual ICollection<ReservationService> Reservations { get; set; } = new List<ReservationService>();
    }
}
