using mgms_backend.DTO.UserDTO;
using mgms_backend.Entities.Users;
using mgms_backend.Mappers.Interface;
using Riok.Mapperly.Abstractions;

namespace mgms_backend.Mappers.Implementation
{
    // Maps User entities to User DTOs and vice versa 
    [Mapper]
    public partial class UserMapper : IUserMapper
    {
        public partial User? ToModel(UserDto? dto); // Maps User DTO to User entity
        public partial UserDto? ToDto(User? model); // Maps User entity to User DTO
        public partial UserSearchCriteria? ToSearchCriteriaModel(UserSearchCriteriaDto? dto); // Maps UserSearchCriteria DTO to UserSearchCriteria entity
        public partial IList<UserDto>? ToCollectionDto(IList<User>? model); // Maps a collection of User entities to a collection of User DTOs
        public partial IList<User>? ToCollectionModel(IList<UserDto>? dto); // Maps a collection of User DTOs to a collection of User entities
    }
}
