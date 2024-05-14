using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.DTO.SettingsDTO;
using mgms_backend.Repositories.Interface;
using mgms_backend.Exceptions;
using mgms_backend.Entities;

namespace mgms_backend.Controllers
{
    [Route("api/settings")]
    [ApiController]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsRepository _settingsRepository;

        public SettingsController(ISettingsRepository settingsRepository)
        {
            _settingsRepository = settingsRepository;
        }

        // Check if the settings exist in the database
        private async Task<bool> SettingsExists(int userId)
        {
            var settings = await _settingsRepository.GetSettingsByUserIdAsync(userId);
            return settings != null;
        }

        // GET: api/settings/GetSettingsByUserId: Get the settings by user ID
        [HttpGet("GetSettingsByUserId")]
        [Authorize]
        public async Task<ActionResult<SettingsDTO>> GetSettingsByUserId(int userId)
        {
            // Check if the user ID is valid
            if (userId <= 0)
            {
                throw new ServerValidationException("Invalid user ID");
            }

            var settings = await _settingsRepository.GetSettingsByUserIdAsync(userId);

            // Check if the settings exist
            if (settings == null)
            {
                return Ok(new SettingsDTO
                {
                    UserId = 0,
                    ReceiveNotifications = false,
                    DarkMode = false,
                });
            }

            return Ok(new SettingsDTO
            {
                UserId = userId,
                ReceiveNotifications = settings.ReceiveNotifications,
                DarkMode = settings.DarkMode,
            });
        }

        // PUT: api/settings/UpdateSettings: Update the settings
        [HttpPut("UpdateSettings")]
        [Authorize]
        public async Task<IActionResult> UpdateSettings([FromQuery] int userId, [FromBody] SettingsDTO settingsDTO)
        {
            var existingSettings = await _settingsRepository.GetSettingsByUserIdAsync(userId) ?? new Settings();

            if (userId != settingsDTO.UserId)
            {
                throw new ServerValidationException("User ID mismatch");
            }

            existingSettings.UserId = userId;
            existingSettings.ReceiveNotifications = settingsDTO.ReceiveNotifications;
            existingSettings.DarkMode = settingsDTO.DarkMode;

            await _settingsRepository.UpdateSettingsAsync(existingSettings);

            return Ok(new { message = "Settings updated successfully" });
        }
    }
}
