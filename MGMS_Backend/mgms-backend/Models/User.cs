using System;
using System.Collections.Generic;

namespace MGMSBackend.Models
{
    // Represent the user entity in the database
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public DateTime DateCreated { get; set; }

        // Navigation properties for related entities
        public Profile Profile { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<Notification> Notifications { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}
