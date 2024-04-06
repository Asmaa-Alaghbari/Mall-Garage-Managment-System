using System.ComponentModel.DataAnnotations.Schema;

namespace mgms_backend.Models
{
    // Represent the reservation service entity in the database 
    public class ReservationService
    {
        [ForeignKey("Reservation")] // Data annotation for the foreign key 
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; }

        [ForeignKey("Service")] // Data annotation for the foreign key
        public int ServiceId { get; set; }
        public Service Service { get; set; }
    }
}
