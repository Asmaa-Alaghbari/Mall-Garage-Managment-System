using System.ComponentModel.DataAnnotations;

namespace mgms_backend.Models
{
    // Represent the user entity in the database
    public class User
    {
        [Key] // Data annotation for the primary key
        public int UserId { get; set; } // Primary key
        [Required]
        public string FirstName { get; set; } = default!;
        [Required]
        public string LastName { get; set; } = default!;
        [Required]
        public string Username { get; set; } // Unique username
        [Required]
        public string Email { get; set; } = default!; // Unique email address
        [Required]
        public string Password { get; set; } = default!;  // Hashed password
        [Required]
        public string Phone { get; set; } = default!; // Phone number
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
