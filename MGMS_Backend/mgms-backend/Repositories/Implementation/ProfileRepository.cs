﻿using mgms_backend.Data;
using mgms_backend.Entities.Users;
using mgms_backend.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories.Implementation
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public ProfileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get the profile of a user by their ID
        public async Task<Profile> GetProfileByUserIdAsync(int userId)
        {
            return await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        }

        // Add a new profile to the database
        public async Task AddProfileAsync(Profile newProfile)
        {
            await _context.Profiles.AddAsync(newProfile);
        }

        // Update the profile of a user
        public async Task UpdateProfileAsync(Profile profile)
        {
            _context.Entry(profile).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        // Save changes to the database
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
