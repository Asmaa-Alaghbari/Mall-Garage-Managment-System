using System.ComponentModel.DataAnnotations;

namespace mgms_backend.Models
{
    // Represent the service entity in the database
    public class Service
    {
        [Key] // Data annotation for the primary key
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        // Navigation properties for related entities
        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<ReservationService> ReservationServices { get; set; }

    }
}
