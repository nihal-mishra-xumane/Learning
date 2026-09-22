import { useMemo, useState } from "react";
import Header from "./common/Header/header";
import "./styles.css";

/* =========================================================
   Application Configuration
   Change these values when using this layout in another app
   ========================================================= */

const appConfig = {
  name: "Airtecture",

  /*
    Logo options:

    Text logo:
    logo: "CA"

    Image logo:
    logo: "/assets/logo.png"

    Object logo:
    logo: {
      type: "image",
      value: "/assets/logo.png",
      alt: "Airtecture logo",
    }

    Object text logo:
    logo: {
      type: "text",
      value: "CA",
    }
  */
  logo: "CA",

 

  theme: "light",

  showNotifications: true,
  showProfile: true,
  showUserName: true,
  showLogout: true,
  showProfileAction: true,
  showMobileMenuButton: false,
};

/* =========================================================
   Dynamic User Configuration
   Add or remove user properties as required
   ========================================================= */

const initialUser = {
  name: "Madhurima Dutta",
  email: "madhurima.dutta@example.com",
  employeeId: "EMP-001",
  role: "Administrator",
  designation: "Application Administrator",
  department: "Procurement and CRM",
  phone: "+91 98765 43210",
  location: "India",
};

/* =========================================================
   Dynamic Profile Field Configuration
   These fields are displayed in the Header profile popup
   ========================================================= */

const profileFields = [
  {
    key: "name",
    label: "Full name",
  },
  {
    key: "email",
    label: "Email address",
  },
  {
    key: "employeeId",
    label: "Employee ID",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "designation",
    label: "Designation",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "location",
    label: "Location",
  },
];

/* =========================================================
   Dynamic Page Configuration
   Add, remove, or rename pages here
   ========================================================= */

const pageConfig = [
  {
    id: "login",
    label: "Login",
    description: "Manage login and authentication screens.",
  },
  {
    id: "header",
    label: "Header",
    description: "Reusable application header component.",
  },
  {
    id: "sidebar",
    label: "Sidebar",
    description: "Reusable sidebar and navigation component.",
  },
  {
    id: "theme",
    label: "Theme",
    description: "Application colors, typography, and themes.",
  },
  {
    id: "buttons",
    label: "Buttons",
    description: "Reusable buttons and action controls.",
  },
  {
    id: "tables",
    label: "Tables",
    description: "Reusable data table components.",
  },
  {
    id: "forms",
    label: "Forms",
    description: "Reusable form fields and validation patterns.",
  },
  {
    id: "filters",
    label: "Filters",
    description: "Reusable filter controls.",
  },
  {
    id: "search",
    label: "Search",
    description: "Reusable search components.",
  },
  {
    id: "tabs",
    label: "Tabs",
    description: "Reusable tab navigation components.",
  },
  {
    id: "status-badges",
    label: "Status badges",
    description: "Reusable status and label components.",
  },
];

/* =========================================================
   Dynamic Notification Configuration
   ========================================================= */

const initialNotifications = [
  {
    id: 1,
    title: "New procurement request",
    message: "A new procurement request has been received.",
    time: "5 minutes ago",
    isRead: false,
    type: "procurement",
  },
  {
    id: 2,
    title: "Profile updated",
    message: "Your profile was updated successfully.",
    time: "10 minutes ago",
    isRead: false,
    type: "profile",
  },
  {
    id: 3,
    title: "New CRM task assigned",
    message: "A new task has been assigned to you.",
    time: "15 minutes ago",
    isRead: false,
    type: "crm",
  },
];

/* =========================================================
   Main Application
   ========================================================= */

export default function App() {
  /*
    The first page in pageConfig becomes the fallback page.
    Change initialPageId to control the first selected page.
  */
  const initialPageId = "theme";

  const [activePage, setActivePage] = useState(
    pageConfig.some((page) => page.id === initialPageId)
      ? initialPageId
      : pageConfig[0]?.id || ""
  );

  /*
    User state is kept dynamic so it can later be updated
    from an API, login response, or profile form.
  */
  const [user, setUser] = useState(initialUser);

  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const [isApplicationLoading, setIsApplicationLoading] =
    useState(false);

  /* =======================================================
     Derived Application Values
     ======================================================= */

  /*
    Find the currently selected page from pageConfig.
  */
  const selectedPage = useMemo(() => {
    return (
      pageConfig.find((page) => page.id === activePage) ||
      pageConfig[0] ||
      {
        id: "",
        label: "Page",
        description: "No page has been configured.",
      }
    );
  }, [activePage]);

  /*
    Calculate unread notifications dynamically.
  */
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.isRead
    ).length;
  }, [notifications]);

  /* =======================================================
     Header Event Handlers
     ======================================================= */

  const handleNotificationsClick = () => {
    console.log("Notifications clicked");

    /*
      Mark all notifications as read when the notification
      panel or notification button is opened.
    */
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);

    /*
      Mark only the selected notification as read.
    */
    setNotifications((previousNotifications) =>
      previousNotifications.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              isRead: true,
            }
          : item
      )
    );

    /*
      Optional notification-based navigation.

      Uncomment or customize this logic according
      to your application's page configuration.

      Example:

      if (notification.type === "procurement") {
        setActivePage("tables");
      }

      if (notification.type === "crm") {
        setActivePage("forms");
      }
    */
  };

  const handleProfileClick = (selectedUser) => {
    console.log("Profile clicked:", selectedUser);

    /*
      Add extra profile logic here if required.

      Example:
      - Open a separate profile page
      - Load profile information
      - Track profile interaction
    */
  };

  const handleLogout = (selectedUser) => {
    console.log("Logout clicked for:", selectedUser);

    /*
      Add your logout API call or authentication logic here.

      Example:

      setIsApplicationLoading(true);

      logoutUser()
        .finally(() => {
          setIsApplicationLoading(false);
        });
    */
  };

  const handleLogoClick = () => {
    console.log("Application logo clicked");

    /*
      Clicking the logo navigates to the first configured page.
    */
    setActivePage(pageConfig[0]?.id || "");
  };

  const handleMobileMenuToggle = (isOpen) => {
    console.log("Mobile menu state:", isOpen);

    /*
      Add mobile navigation logic here if required.
    */
  };

  /* =======================================================
     Navigation Handlers
     ======================================================= */

  const handlePageChange = (pageId) => {
    /*
      Prevent navigation to a page that does not exist
      in the page configuration.
    */
    const pageExists = pageConfig.some(
      (page) => page.id === pageId
    );

    if (!pageExists) {
      return;
    }

    setActivePage(pageId);
  };

  /* =======================================================
     Optional Dynamic User Update Example
     ======================================================= */

  const updateUser = (updatedUserValues) => {
    setUser((previousUser) => ({
      ...previousUser,
      ...updatedUserValues,
    }));
  };

  /*
    Example usage:

    updateUser({
      name: "New User",
      role: "Manager",
    });
  */

  /* =======================================================
     Render
     ======================================================= */

  return (
    <div
      className={`app-shell app-shell--${appConfig.theme}`}
    >
      {/* ===================================================
          Top Header
      =================================================== */}

      <Header
        appName={appConfig.name}
        appLogo={appConfig.logo}
        appSubtitle={appConfig.subtitle}
        appLogoImage={appConfig.logoImage}
        profileFields={profileFields}
        user={user}
        notificationCount={unreadNotificationCount}
        notifications={notifications}
        notificationsLabel="Notifications"
        showNotifications={appConfig.showNotifications}
        showProfile={appConfig.showProfile}
        showUserName={appConfig.showUserName}
        showLogout={appConfig.showLogout}
        showProfileAction={appConfig.showProfileAction}
        showMobileMenuButton={
          appConfig.showMobileMenuButton
        }
        isLoading={isApplicationLoading}
        onNotificationsClick={handleNotificationsClick}
        onNotificationClick={handleNotificationClick}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        onLogoClick={handleLogoClick}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      {/* ===================================================
          Application Body
      =================================================== */}

      <div className="app-body">
        {/* =================================================
            Dynamic Navigation
        ================================================= */}

        <nav
          className="navigation"
          aria-label="Application pages"
        >
          <div className="navigation__header">
            <strong>Pages</strong>

            <span className="navigation__count">
              {pageConfig.length}
            </span>
          </div>

          <div className="navigation-list">
            {pageConfig.map((page) => {
              const isActive = activePage === page.id;

              return (
                <button
                  key={page.id}
                  type="button"
                  className={
                    isActive
                      ? "navigation__item navigation__item--active"
                      : "navigation__item"
                  }
                  onClick={() => handlePageChange(page.id)}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                >
                  {page.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            Dynamic Page Content
        ================================================= */}

        <main className="content">
          <div className="content__header">
            <div>
              <p className="content__eyebrow">
                {appConfig.subtitle}
              </p>

              <h1 className="content__title">
                {selectedPage.label}
              </h1>

              <p className="content__description">
                {selectedPage.description}
              </p>
            </div>

            <span className="content__status">
              Active
            </span>
          </div>

          <div className="content__card">
            <p>
              Page content for{" "}
              <strong>{selectedPage.label}</strong> will be
              displayed here.
            </p>

            <small>
              Selected page ID: {selectedPage.id}
            </small>
          </div>
        </main>
      </div>
    </div>
  );
}