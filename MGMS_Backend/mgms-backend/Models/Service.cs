using System.Collections.Generic;

namespace MGMSBackend.Models
{
    // Represent the service entity in the database
    public class Service
    {
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        // Navigation properties for related entities
        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<ReservationService> ReservationServices { get; set; }

    }
}
