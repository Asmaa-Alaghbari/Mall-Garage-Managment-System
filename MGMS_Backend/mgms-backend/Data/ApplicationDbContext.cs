using Microsoft.EntityFrameworkCore; // For DbContext (ORM)
using mgms_backend.Models;

namespace mgms_backend.Data
{
    // Interact with the database using the entity models and the database context
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Define the database tables using the entity models as DbSet properties
        public DbSet<User> Users { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<ParkingSpot> ParkingSpots { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ReservationService> ReservationServices { get; set; }
        public DbSet<Settings> Settings { get; set; }

        // Define the relationships between the entities in the database using the Fluent API
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define the one-to-one relationship between User and Profile
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<Profile>(p => p.UserId);

            // Define the one-to-many relationship between User and Reservation
            modelBuilder.Entity<User>()
                .HasMany(u => u.Reservations)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId);

            // Define the one-to-many relationship between User and Notification
            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId);

            // Define the one-to-many relationship between User and Feedback
            modelBuilder.Entity<User>()
                .HasMany(u => u.Feedbacks)
                .WithOne(f => f.User)
                .HasForeignKey(f => f.UserId);

            // Define the one-to-many relationship between User and Settings
            modelBuilder.Entity<User>()
                .HasOne(u => u.Settings)
                .WithOne(s => s.User)
                .HasForeignKey<Settings>(s => s.UserId);

            // Define the one-to-many relationship between ParkingSpot and Reservation
            modelBuilder.Entity<ParkingSpot>()
                .HasMany(p => p.Reservations)
                .WithOne(r => r.ParkingSpot)
                .HasForeignKey(r => r.ParkingSpotId);

            // Define the one-to-many relationship between Reservation and Service
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.Services)
                .WithMany(s => s.Reservations)
                .UsingEntity<ReservationService>(
                    rs => rs.HasOne(r => r.Service)
                        .WithMany(s => s.ReservationServices)
                        .HasForeignKey(rs => rs.ServiceId),
                    rs => rs.HasOne(r => r.Reservation)
                        .WithMany(r => r.ReservationServices)
                        .HasForeignKey(rs => rs.ReservationId)
                );

            // Define the one-to-many relationship between Reservation and Payment
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.Payments)
                .WithOne(p => p.Reservation)
                .HasForeignKey(p => p.ReservationId);

            // Define the one-to-many relationship between User and Payment
            modelBuilder.Entity<User>()
                .HasMany(u => u.Payments)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            // Define the one-to-many relationship between Service and ReservationService
            modelBuilder.Entity<Service>()
                .HasMany(s => s.ReservationServices)
                .WithOne(rs => rs.Service)
                .HasForeignKey(rs => rs.ServiceId);

            // Define the one-to-many relationship between ReservationService and Reservation
            modelBuilder.Entity<ReservationService>()
                .HasOne(rs => rs.Reservation)
                .WithMany(r => r.ReservationServices)
                .HasForeignKey(rs => rs.ReservationId);

            // Define the one-to-many relationship between ReservationService and Service
            modelBuilder.Entity<ReservationService>()
                .HasOne(rs => rs.Service)
                .WithMany(s => s.ReservationServices)
                .HasForeignKey(rs => rs.ServiceId);

        }
    }
}
