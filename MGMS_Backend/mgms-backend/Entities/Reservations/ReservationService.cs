using System.ComponentModel.DataAnnotations.Schema;
using mgms_backend.Entities.Services;

namespace mgms_backend.Entities.Reservations
{
    // Represent the reservation service entity in the database 
    public class ReservationService
    {
        [ForeignKey("Reservation")] // Data annotation for the foreign key 
        public int ReservationId { get; set; }
        public virtual Reservation Reservation { get; set; }

        [ForeignKey("Service")] // Data annotation for the foreign key
        public int ServiceId { get; set; }
        public virtual Service Service { get; set; }
    }
}
