# Frontend:
## Folder components:
### Auth 
- Login.js: Handles user login functionality, including form handling and authentication state management.
- SignUp.js: Manages user registration, including form handling and sign-up state management.
- UserList.js: Displays a list of users and provides user management functionalities.
- AddUser.js: Handles the addition of new users to the system.
- AuthForms.css: Provides styling for the authentication forms.

### Feedback:
- Feedback.js: Manages and displays user feedback, including functionalities for adding and deleting feedback.
- AddFeddback.js: Handles the addition of new feedback to the system.

### Home:
- Home.js: Displays the home page of the application, including various statistics and quick access links.
- Home.css: Provides styling for the home page.

### Info:
- Info.js: Displays information about the company, including an "About Us" section and FAQs.
- Info.css: Provides styling for the information page.

### Navbar:
- Navbar.js: Provides a navigation bar for the application, including routing and logout functionality.
- Navbar.css: Provides styling for the navigation bar.

### Notification:
- Notification.js: Manages and displays user notifications, including functionalities for marking as read/unread and deleting notifications.

### ParkingSpot: 
- ParkingSpot.js: Manages and displays parking spots, including functionalities for adding, updating, and deleting spots.
- AddParkingSpot.js: Handles the addition of new parking spots to the system.
- ParkingSpotMap.css: Provides styling for the parking spot map.
- ParkingSpotMap.svg: Represents a map of the parking lot.

### Payment:
- Payment.js: Manages and displays payments, including functionalities for adding, updating, and deleting payments.
- AddPayment.js: Handles the addition of new payments to the system.

### Profile:
- Profile.js: Allows users to view and update their profile information.
- Profile.css: Provides styling for the profile page.

### Reservation:
- Reservation.js: Manages and displays reservations, including functionalities for adding, updating, and deleting reservations.
- AddReservation.js: Handles the addition of new reservations to the system.

### Services:
- Service.js: Manages and displays services, including functionalities for adding, updating, and deleting services.
- AddService.js: Handles the addition of new services to the system.

### Settings:
- Settings.js: Allows users to toggle settings such as dark mode and notifications.
- Settings.css: Provides styling for the settings page.

### Utiles:
- Utiles.js: Contains utility functions used across the application.
- style.css: Provides general styling for the application.
- AddStyle.css: Provides additional styling for various components in the application.

# Libraries Used:
- @mui/icons-material: For Material-UI icons used in the navigation items.
- @mui/material: For Material-UI components like AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, and Typography.
- @mui/system: For Material-UI system utilities.
- axios: For making HTTP requests to fetch the quote of the day.
- chart.js: For creating the charts used in the application.
- react: For building the user interface and managing state.
- react-chartjs-2: For displaying charts (Bar, Pie, Doughnut, Line).
- react-icons/fa: For displaying FontAwesome icons.
- react-router-dom: For navigation and routing within the application.
- react-select: For providing a multi-select dropdown for selecting services.
- react-spinners/BeatLoader: For displaying a loading spinner.
- react-toastify: For showing notifications.
- react-tooltip: For displaying tooltips.
- react-zoom-pan-pinch: For zoom and pan functionality on the parking spot map.

# Functions Used:
## React Functions and Hooks:
    - useState: Manages state within the component.
    - useEffect: Handles side effects in functional components.
    - useNavigate: Provides navigation capabilities within the application.
    - useLocation: Gets the current location.
