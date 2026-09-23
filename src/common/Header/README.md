The header created for the CRM and Procurement application contains reusable features such as:
1.	Application logo
2.	Application name
3.	Notifications icon
4.	Notification count badge
5.	Notifications dropdown
6.	User profile section
7.	User details popup
8.	Logout option
9.	Responsive mobile layout
header.jsx
This file contains:
•	Header layout
•	Logo rendering
•	Application name
•	Notifications button
•	Notification dropdown
•	Profile button
•	User details popup
•	Logout button
•	Event handlers
Header.css
This file contains:
•	Header colors
•	Header spacing
•	Logo styling
•	Notification styling
•	Profile styling
•	Popup styling
•	Responsive design
•	Hover and focus effects
Reusing the Application Logo
Example
The logo identifies the application or organization.
The Header supports:
•	Text-based logo/ Image based logo
•	Initials such as CA, HR, or CRM
•	An image logo
Reusing the Notifications Icon
Examples
The notification icon allows users to view alerts, updates, reminders, and system messages.
Notifications can be used for:
•	New procurement requests
•	New tasks
•	Approval requests
•	Profile updates
•	System alerts
•	Pending invoices
•	New employee requests
The parent application can control what happens when the notification icon is clicked. The parent component can mark all notifications as read. The Header component displays the notification data, while the parent application manages the notification state.
Reusing the User Profile Section
Examples
The profile section displays the currently logged-in user.
The profile area can show:
•	User avatar
•	User initials
•	User name
•	User email
•	Profile dropdown
•	User details option
•	Logout option
The Header component automatically uses the provided user information.
Reusing the User Details Popup
Examples
The user details popup displays complete information about the logged-in user.
The popup can contain:
•	Full name
•	Email address
•	Role
•	Department
•	Phone number
•	Location
Reusing the Logout Option
Example
The logout option allows the user to leave the current session.
The Header should not directly implement application-specific logout logic. Instead, the parent application should provide an onLogout callback.

Steps to Reuse the Common Header Component in Another React Project

1. Copy the Header Component Folder
Copy the complete Header folder from the existing project.
Existing project structure:
src/
└── common/
    └── Components/
        └── Header/
            ├── header.jsx
            └── Header.css
Copy the Header folder into the new project.
New project structure:
my-new-project/
├── public/
├── src/
│   ├── common/
│   │   └── Components/
│   │       └── Header/
│   │           ├── header.jsx
│   │           └── Header.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── package.json
└── vite.config.js
Both files should be copied:
header.jsx
Header.css
Do not copy only the JSX file because the CSS file contains the complete Header styling.
________________________________________
2. Check the File Name and Import Path
The file name and import path must have the same letter casing.
If the file is named:
header.jsx
Use:
import Header from "./common/Components/Header/header";
If the file is named:
Header.jsx
Use:
import Header from "./common/Components/Header/Header";
The following two file names may be treated as different by some systems:
header.jsx
Header.jsx
To avoid errors, use only one Header file and keep the naming consistent.
Recommended structure:
Header/
├── header.jsx
└── Header.css
Recommended import:
import Header from "./common/Components/Header/header";
________________________________________
3. Import the Header into the New Project
Open the App.jsx file of the new project.
Import the Header component:
import Header from "./common/Components/Header/header";
If the Header component imports its own CSS file, no additional CSS import may be required in App.jsx.
If the Header CSS is not imported inside header.jsx, add the following import:
import "./Header.css";
The import should normally be placed inside header.jsx:
import "./Header.css";
________________________________________
4. Prepare Dynamic User Information
The Header receives user information from the parent application through the user prop.
Different applications may have different user fields. Therefore, the parent application should provide the fields required by that project.
const user = {
  name: "Rahul Sharma",
  email: "rahul.sharma@company.com",
  role: "HR Manager",
  department: "Human Resources",
  phone: "+91 91234 56789",
  location: "Bengaluru",
};
For another application, the user object may be different:
const user = {
  name: "Ananya Mehta",
  email: "ananya.mehta@company.com",
  employeeId: "EMP1024",
  designation: "Software Developer",
  team: "Engineering",
  office: "Hyderabad",
};
The reusable Header should not depend on a fixed list of user fields. Instead, the parent application should provide a dynamic profileFields configuration.
Example: HR Application
const profileFields = [
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Role",
    key: "role",
  },
  {
    label: "Department",
    key: "department",
  },
  {
    label: "Phone",
    key: "phone",
  },
  {
    label: "Location",
    key: "location",
  },
];
Example: Engineering Application
const profileFields = [
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Employee ID",
    key: "employeeId",
  },
  {
    label: "Designation",
    key: "designation",
  },
  {
    label: "Team",
    key: "team",
  },
  {
    label: "Office",
    key: "office",
  },
];
The Header can then be used in both applications without modifying the reusable component:
<Header
  user={user}
  profileFields={profileFields}
/>
Supported Profile Field Properties
Property	Description
label	Text displayed beside the value
key	Field name inside the user object
getValue	Optional function for calculating or formatting a value
Example using getValue:
const profileFields = [
  {
    label: "Department",
    getValue: (user) => user.department?.name || "Not assigned",
  },
  {
    label: "Full Name",
    getValue: (user) =>
      `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  },
];
The field names do not need to be identical between applications. Each application can define its own profileFields configuration.
________________________________________
5. Prepare Dynamic Notifications Data
Notifications should also be provided by the parent application through the notifications prop.
const notifications = [
  {
    id: 1,
    title: "New employee request",
    message: "A new employee onboarding request has been received.",
    time: "5 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    title: "Leave request pending",
    message: "A leave request is waiting for your approval.",
    time: "15 minutes ago",
    isRead: false,
  },
];
Another application may use completely different notifications:
const notifications = [
  {
    id: "ticket-101",
    title: "New support ticket",
    message: "A new customer support ticket has been assigned to you.",
    time: "2 minutes ago",
    isRead: false,
  },
  {
    id: "build-202",
    title: "Build completed",
    message: "The latest application build has completed successfully.",
    time: "10 minutes ago",
    isRead: true,
  },
];
The reusable Header does not need to know what each notification means. It only displays the data received from the parent application.
Notification Data Structure
Property	Description
id	Unique notification identifier
title	Notification heading
message	Notification description
time	Display time or formatted timestamp
isRead	Indicates whether the notification has been read
Calculate the unread count dynamically:
const unreadNotificationCount = notifications.filter(
  (notification) => !notification.isRead
).length;
If notifications are loaded from an API, the same calculation can be used after the API response is received.
________________________________________
6. Create Reusable Event Handlers
The Header should display the interface, while the parent application controls what happens when the user interacts with it.
The logout implementation may be different for each application. For example, an application may need to:
•	Clear authentication tokens.
•	Clear cached user information.
•	Call a logout API.
•	Clear application state.
•	Redirect the user to a login page.
•	Use a different authentication provider.
The reusable Header should only call the onLogout callback. It should not contain application-specific logout logic.
________________________________________
7. Use the Header Component Dynamically in App.jsx
The parent application passes the user data, profile fields, notifications, and event handlers to the reusable Header.
import Header from "./components/Header";

function App() {
  const user = {
    name: "Rahul Sharma",
    email: "rahul.sharma@company.com",
    role: "HR Manager",
    department: "Human Resources",
    phone: "+91 91234 56789",
    location: "Bengaluru",
  };

  const profileFields = [
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Role",
      key: "role",
    },
    {
      label: "Department",
      key: "department",
    },
    {
      label: "Phone",
      key: "phone",
    },
    {
      label: "Location",
      key: "location",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New employee request",
      message: "A new employee onboarding request has been received.",
      time: "5 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      title: "Leave request pending",
      message: "A leave request is waiting for your approval.",
      time: "15 minutes ago",
      isRead: false,
    },
  ];

  const handleNotificationsClick = () => {
    console.log("Notifications opened");
  };

  const handleNotificationClick = (selectedNotification) => {
    console.log("Notification selected:", selectedNotification);
  };

  const handleProfileClick = () => {
    console.log("Profile selected");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    window.location.href = "/login";
  };

  return (
    <div className="app">
      <Header
        user={user}
        profileFields={profileFields}
        notifications={notifications}
        onNotificationsClick={handleNotificationsClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />

      <main className="app-content">
        {/* Application-specific page content */}
      </main>
    </div>
  );
}

export default App;
Reusability Across Different Applications
Another application can use the same Header component with different data:
const user = {
  name: "Ananya Mehta",
  email: "ananya.mehta@company.com",
  employeeId: "EMP1024",
  designation: "Software Developer",
  team: "Engineering",
  office: "Hyderabad",
};

const profileFields = [
  {
    label: "Employee ID",
    key: "employeeId",
  },
  {
    label: "Designation",
    key: "designation",
  },
  {
    label: "Team",
    key: "team",
  },
  {
    label: "Office",
    key: "office",
  },
];
The same component can be used:
<Header
  user={user}
  profileFields={profileFields}
  notifications={notifications}
  onNotificationsClick={handleNotificationsClick}
  onNotificationClick={handleNotificationClick}
  onProfileClick={handleProfileClick}
  onLogout={handleLogout}
/>
The Header.jsx file remains unchanged.
Only the following values change from application to application:
•	user
•	profileFields
•	notifications
•	Event handler implementations
•	Application-specific navigation
•	Authentication and logout logic
This makes the Header component reusable across applications with different user structures, profile fields, notification types, and business requirements.
8. Change the Application Name and Logo
The Header can be customized for the new project by changing the appName and appLogo props.
Procurement Project
<Header
  appName="Procurement Portal"
  appLogo="PR"
  user={user}
/>
The Header component remains unchanged. Only the values passed through props are changed.
________________________________________


8. Add the Header to Multiple Pages
The Header can be placed in the main application layout so that it appears on multiple pages.
Example:
export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Header
        appName="Procurement Portal"
        appLogo="PR"
        user={user}
        notifications={notifications}
        notificationCount={unreadNotificationCount}
        onLogout={handleLogout}
      />

      <main className="content">
        {children}
      </main>
    </div>
  );
}
Pages can then be rendered inside the layout:
<AppLayout>
  <Dashboard />
</AppLayout>
This avoids adding the Header separately to every page.
________________________________________
9. Run the New Project
After copying the Header and configuring the props, run the application:
npm run dev
Open the local URL displayed in the terminal.
Check the following features:
•	Application logo is displayed
•	Application name is displayed
•	Notifications icon is visible
•	Notification badge shows the unread count
•	Notifications dropdown opens
•	User profile button opens
•	User details popup opens
•	User information is displayed correctly
•	Logout option is visible
•	Logout callback works
•	Header is responsive on smaller screens
________________________________________



