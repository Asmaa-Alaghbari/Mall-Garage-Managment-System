# Backend (.Net 8)
## Folder Controllers:
- AuthController.cs: Manages user authentication and login in the application. It includes functionalities for user registration, processes the registration data, and handles the registration state.
- FeedbackController.cs: Manages user feedback for the parking spots application. It includes functionalities for adding, retrieving, searching, and deleting feedback entries.
- NotificationController.cs: Manages notifications within the parking management system. It provides functionalities for adding, retrieving, searching, updating, and deleting notifications.
- ParkingSpotController.cs: Manages parking spots within the parking management system. It provides functionalities for adding, retrieving, updating, deleting, and searching parking spots.
- PaymentController.cs: Manages payment-related operations within the parking management system. It provides functionalities for adding, retrieving, updating, deleting, and searching payments.
- ReservationController.cs: Manages reservation-related operations within the parking management system. It provides functionalities for adding, retrieving, updating, deleting, and searching reservations.
- ServicesController.cs: Manages service-related operations within the parking management system. It provides functionalities for adding, retrieving, updating, deleting, and searching services.
- SettingsContoller.cs: Manages user settings within the parking management system. It provides functionalities for retrieving and updating user-specific settings.

## Data:
- ApplicationDbContext.cs: Defines the database context for the parking management system. It includes the configuration of entity models and their relationships.

## DTO:
### FeedbackDTO:
- FeedbackDto.cs: Encapsulates feedback data that is exchanged between the client and the server.
- FeedbackSearchCriteriaDto.cs: Transfers search criteria for feedback data between the client and server.

### NotificationDTO:
- NotificationDto.cs: Encapsulates the data related to notifications.
- NotificationSearchCriteriaDto.cs: Encapsulates the criteria for searching notifications.

### ParkingSpotDTO:
- ParkingSpotDto.cs: Provides a structured way to represent parking spot data.
- ParkingSpotSearchCriteriaDto.cs: Provides a structured way to represent the criteria used for searching parking spots.

### PaymentDTO:
- PaymentDto.cs: Provides a structured way to represent payment data.
- PaymentSearchCriteriaDto.cs: Provides a structured way to specify search criteria for filtering payments.

### ReservationDTO:
- ReservationDto.cs: Serves as a data transfer object for the Reservation entity.
- ReservationSearchCriteriaDto.cs: Provides a structured way to specify search criteria for filtering reservations.

### ServicesDTO:
- ServiceDto.cs: Serves as a data transfer object for the Service entity.
- ServiceSearchCriteriaDto.cs: Serves as a data transfer object for specifying search criteria when querying services.

### SettingsDTO:
- SettingsDto.cs: Serves as a data transfer object for managing user-specific settings.

### UserDTO:
- LoginDto.cs: Serves as a data transfer object for handling user login information.
- ProfileDto.cs: Serves as a data transfer object for handling user profile information.
- RegisterDto.cs: Transfers user registration information from the client to the server during the registration process.
- UserDto.cs: Transfers user information between the client and server.
- UserRoleDto.cs: Transfers user role information between the client and server.
- UserSearchCriteriaDto.cs: Ensures that all the necessary details for searching users are provided in a structured manner.

## Folder Entities:
### Feedbacks:
- Feedbacks.cs: Represents the Feedbacks table in the database, containing properties that map to the columns in the table and navigation properties to define relationships with other entities.
- FeedbackSearchCriteria.cs: Encapsulates the various criteria that can be used to filter and sort feedback entries.

### Notifications:
- Notification.cs: Defines the structure of a notification record in the database, including necessary properties and data annotations for mapping to the database table.
- NotificationSearchCriteria.cs: Defines the criteria used for searching and filtering notification records.

### ParkingSpots:
- ParkingSpot.cs: Defines a model for parking spots in the database, including properties for the unique ID, number, section, size, and occupancy status of each parking spot.
- ParkingSpotSearchCriteria.cs: Defines a model for specifying the search criteria when querying parking spots in the database.

### Payments
- Payment.cs: Defines the schema for the payment entity, including its properties, data annotations, and relationships with other entities such as Reservation and User.
- PaymentSearchCriteria.cs: Defines the parameters for searching and filtering payments in the database.

### Reservations:
- Reservation.cs: Represents a reservation record in the database, including details about the user making the reservation, the parking spot being reserved, and the timeframe of the reservation.
- ReservationSearchCriteria.cs: Encapsulates the various criteria that can be used to search and filter reservations in the system.
- ReservationService.cs: Establishes the many-to-many relationship between the Reservation and Service entities.

### Settings:
- Settings.cs: Defines user-specific settings in the system, including preferences such as whether the user wants to receive notifications and whether they prefer dark mode.

### Services:
- Service.cs: Defines a service that can be associated with multiple reservations.
- ServiceSearchCriteria.cs: Defines the search and sorting parameters used to query the Service entities in the database.

### Users:
- Profile.cs: Encapsulates detailed profile information for a user, including address-related information and an optional profile picture URL.
- User.cs: Encapsulates detailed information about a user, including the user's personal details, authentication credentials, role, and the date the account was created.
- UserSearchCriteria.cs: Encapsulates the search and sorting parameters used to query user data.

## Exceptions:
- EntityNotFoundException.cs: A custom exception used to indicate that a specific entity was not found in the database.
- ExceptionMiddleware.cs: Intercepts exceptions that occur during the processing of HTTP requests, providing a consistent and centralized error handling mechanism.
- ServerValidationException.cs: A custom exception used to indicate that a server-side validation has failed.

## Extensions:
- QueryableExtensions.cs: Provides a static extension method OrderByDynamic that can be used to sort an IQueryable collection based on a property name specified at runtime.

## Helper:
- IUserHelper.cs: Provides a method to assist with user-related operations, specifically focusing on retrieving the user ID based on search criteria.
- UserHelper.cs: Provides common user-related operations, primarily focusing on retrieving the user ID based on the provided identity.

## Folder Mappers:
### Implementation:
- FeedbackMapper.cs: Handles the conversion between Feedback entities and FeedbackDto objects, ensuring data consistency across the application.
- NotificationMapper.cs: Manages the transformation between Notification entities and NotificationDto objects, including collections and search criteria.
- ParkingSpotMapper.cs: Handles the conversion between ParkingSpot entities and ParkingSpotDto objects, including collections and search criteria.
- PaymentMapper.cs: Manages the mapping between Payment entities and PaymentDto objects, including handling search criteria and collections of these objects.
- ReservationMapper.cs: Handles the conversion between Reservation entities and ReservationDto objects, including individual objects, collections, and search criteria.
- ServiceMapper.cs: Manages the conversion between Service entities and ServiceDto objects, including individual objects, collections, and search criteria.
- UserMapper.cs: Handles the conversion between User entities and UserDto objects, including individual objects, collections, and search criteria.

### Interface: 
- IFeedbackMapper.cs: Provides a structured and consistent way to handle conversions between Feedback entities and FeedbackDto objects.
- INotificationMapper.cs: Defines methods for mapping between Notification entities and NotificationDto objects.
- IParkingSpotMapper.cs: Defines methods for mapping between ParkingSpot entities and ParkingSpotDto objects.
- IPaymentMapper.cs: Defines methods for mapping between Payment entities and PaymentDto objects.
- IReservationMapper.cs: Defines methods for mapping between Reservation entities and ReservationDto objects.
- IServiceMapper.cs: Defines methods for mapping between Service entities and ServiceDto objects.
- IUserMapper.cs: Defines methods for mapping between User entities and UserDto objects, as well as between search criteria DTOs and their corresponding model objects.

## Folder Repositories:
### Implementation:
- FeedbackReopsitory.cs: Implements the IFeedbackRepository interface, providing methods to interact with the Feedback entity in the database.
- NotificationReopsitory.cs: Implements the INotificationRepository interface, providing methods to interact with the Notification entity in the database.
- ParkingSpotReopsitory.cs: Implements the IParkingSpotRepository interface, providing methods to interact with the ParkingSpot entity in the database.
- PaymentReopsitory.cs: Implements the IPaymentRepository interface, providing methods to interact with the Payment entity in the database.
- ProfileReopsitory.cs: Implements the IProfileRepository interface, providing methods to interact with the Profile entity in the database.
- ReservationReopsitory.cs: Implements the IReservationRepository interface, providing methods to interact with the Reservation entity in the database.
- ServiceReopsitory.cs: Implements the IServiceRepository interface, providing methods to interact with the Service entity in the database.
- SettingsReopsitory.cs: Implements the ISettingsRepository interface, providing methods to interact with the Settings entity in the database.
- UserReopsitory.cs: Implements the IUserRepository interface, providing methods to interact with the User entity in the database.

### Interface: 
- IFeedbackReopsitory.cs: Defines the contract for a repository that manages Feedback entities.
- INotificationReopsitory.cs: Defines the contract for a repository that manages Notification entities.
- IParkingSpotReopsitory.cs: Defines the contract for a repository that manages ParkingSpot entities.
- IPaymentReopsitory.cs: Defines the contract for a repository that manages Payment entities.
- IProfileReopsitory.cs: Defines the contract for a repository that manages Profile entities.
- IReservationReopsitory.cs: Defines the contract for a repository that manages Reservation entities.
- IServiceReopsitory.cs: Defines the contract for a repository that manages Service entities.
- ISettingsReopsitory.cs: Defines the contract for a repository that manages Settings entities.
- IUserReopsitory.cs: Defines the contract for a repository that manages User entities.
