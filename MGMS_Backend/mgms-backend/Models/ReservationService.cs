namespace MGMSBackend.Models
{
    // Represent the reservation service entity in the database 
    public class ReservationService
    {
        public int ReservationId { get; set; }
        public Reservation Reservation { get; set; }

        public int ServiceId { get; set; }
        public Service Service { get; set; }
    }
}
