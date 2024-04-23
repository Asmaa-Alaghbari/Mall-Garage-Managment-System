using mgms_backend.DTO;
using mgms_backend.Models;
using mgms_backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Controllers
{
    [Route("api/settings")]
    [ApiController]
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

        // GET: api/settings/GetSettingsByUserId
        [HttpGet("GetSettingsByUserId")]
        [Authorize]
        public async Task<ActionResult<SettingsDTO>> GetSettingsByUserId(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("Invalid user ID");
            }

            var settings = await _settingsRepository.GetSettingsByUserIdAsync(userId);

            if (settings == null)
            {
                return NotFound("Settings not found");
            }

            var settingsDTO = new SettingsDTO
            {
                UserId = settings.UserId,
                ReceiveNotifications = settings.ReceiveNotifications,
                DarkMode = settings.DarkMode,
            };

            return Ok(settingsDTO);
        }

        // PUT: api/settings/UpdateSettings
        [HttpPut("UpdateSettings")]
        [Authorize]
        public async Task<IActionResult> UpdateSettings(int userId, SettingsDTO settingsDTO)
        {
            if (userId != settingsDTO.UserId)
            {
                return BadRequest("User ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var settings = new Settings
            {
                UserId = userId,
                ReceiveNotifications = settingsDTO.ReceiveNotifications,
                DarkMode = settingsDTO.DarkMode,
            };

            try
            {
                await _settingsRepository.UpdateSettingsAsync(settings);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await SettingsExists(userId))
                {
                    return NotFound("Settings not exists");
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Settings updated successfully" });
        }
    }
}
