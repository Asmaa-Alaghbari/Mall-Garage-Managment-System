using System;
using System.Collections.Generic;

namespace MGMSBackend.Models
{
    // Represent the user entity in the database
    public class User
    {
        public int UserId { get; set; } // Primary key
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty; 
        public string Username { get; set; } // Unique username
        public string Email { get; set; } = string.Empty; // Unique email address
        public string Password { get; set; } = string.Empty;  // Hashed password
        public string Phone { get; set; } = string.Empty; // Phone number
        public string Role { get; set; } // Role of the user (Admin, User) 
        public DateTime DateCreated { get; set; } // Date the user account was created

        // Navigation properties for related entities
        public Profile Profile { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<Notification> Notifications { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}
