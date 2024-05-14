using mgms_backend.DTO.UserDTO;
using mgms_backend.Entities.Users;

namespace mgms_backend.Mappers.Interface
{
    // Maps User entities to User DTOs and vice versa 
    public interface IUserMapper
    {
        public User? ToModel(UserDto? dto); // Maps User DTO to User model
        public UserDto? ToDto(User? model); // Maps User model to User DTO
        public UserSearchCriteria? ToSearchCriteriaModel(UserSearchCriteriaDto? dto); // Maps UserSearchCriteria DTO to UserSearchCriteria model
        public IList<UserDto>? ToCollectionDto(IList<User>? model); // Maps a collection of User models to a collection of User DTOs
        public IList<User>? ToCollectionModel(IList<UserDto>? dto); // Maps a collection of User DTOs to a collection of User models
    }
}
