using Microsoft.EntityFrameworkCore; // For DbContext (ORM)
using mgms_backend.Entities;
using mgms_backend.Entities.Feedbacks;
using mgms_backend.Entities.Notifications;
using mgms_backend.Entities.ParkingSpots;
using mgms_backend.Entities.Payments;
using mgms_backend.Entities.Reservations;
using mgms_backend.Entities.Services;
using mgms_backend.Entities.Users;

namespace mgms_backend.Data
{
    // Interact with the database using the entity models and the database context
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Define the database tables using the entity models as DbSet properties
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<ParkingSpot> ParkingSpots { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<ReservationService> ReservationServices { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<User> Users { get; set; }

        // Define the relationships between the entities in the database using the Fluent API
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define the one-to-many relationship between Reservation and Payment
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.Payments)
                .WithOne(p => p.Reservation)
                .HasForeignKey(p => p.ReservationId);

            // Define the many-to-many relationship between Reservation and Services
            modelBuilder.Entity<ReservationService>()
                .HasKey(e => new { e.ReservationId, e.ServiceId });

            modelBuilder.Entity<ReservationService>()
                .HasOne<Reservation>(e => e.Reservation)
                .WithMany(t => t.Services)
                .HasForeignKey(e => e.ReservationId);

            modelBuilder.Entity<ReservationService>()
                .HasOne<Service>(e => e.Service)
                .WithMany(q => q.Reservations)
                .HasForeignKey(e => e.ServiceId);
        }
    }
}
