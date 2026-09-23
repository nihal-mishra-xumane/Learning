import { useEffect, useId, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import "./header.css";

function Header({
  appName = "Application",
  appLogo,
  appSubtitle = "",
  user = {},
  profileFields = [],
  notificationCount = 0,
  notificationsLabel = "Notifications",
  showNotifications = true,
  showProfile = true,
  showUserName = true,
  showLogout = true,
  showProfileAction = true,
  showMobileMenuButton = false,
  mobileMenuOpen = false,
  onMobileMenuToggle,
  onNotificationsClick,
  onProfileClick,
  onLogout,
  onLogoClick,
  isLoading = false,
  isLogoutLoading = false,
  disabled = false,
  className = "",
  children,
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profileMenuId = useId();

  const {
    name = "User",
    email = "",
    initials,
    avatarUrl,
  } = user;

  const displayInitials = getInitials(name, initials);

  const safeNotificationCount = Math.max(
    0,
    Number(notificationCount) || 0
  );

  const hasNotifications = safeNotificationCount > 0;

  const headerClasses = [
    "app-header",
    className,
    isLoading ? "app-header--loading" : "",
    disabled ? "app-header--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  /* Close profile menu when clicking outside */
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
        setIsProfileDetailsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* Close profile menu with Escape */
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
        setIsProfileDetailsOpen(false);
        profileButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleProfileToggle() {
    if (disabled || isLoading || !showProfile) {
      return;
    }

    setIsProfileMenuOpen((previous) => !previous);
    setIsProfileDetailsOpen(false);
  }

  function handleProfileAction() {
    setIsProfileDetailsOpen(true);
    onProfileClick?.(user);
  }

  function handleBackToProfileMenu() {
    setIsProfileDetailsOpen(false);
  }

  function handleLogout() {
    if (disabled || isLogoutLoading) {
      return;
    }

    setIsProfileMenuOpen(false);
    setIsProfileDetailsOpen(false);

    onLogout?.(user);
  }

  function handleNotificationsClick() {
    if (disabled || isLoading) {
      return;
    }

    onNotificationsClick?.();
  }

  function handleMobileMenuClick() {
    if (disabled || isLoading) {
      return;
    }

    onMobileMenuToggle?.(!mobileMenuOpen);
  }

  return (
    <header className={headerClasses}>
      <div className="app-header__inner">

        {/* Brand */}
        <div className="app-header__brand-section">
          <button
            type="button"
            className="app-header__brand"
            onClick={onLogoClick}
            disabled={disabled || isLoading || !onLogoClick}
            aria-label={`Go to ${appName} home`}
          >
            <span className="app-header__logo" aria-hidden="true">
              {appLogo || getAppInitials(appName)}
            </span>

            <span className="app-header__brand-text">
              <span className="app-header__app-name">
                {appName}
              </span>

              {appSubtitle && (
                <span className="app-header__app-subtitle">
                  {appSubtitle}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Optional custom content */}
        {children && (
          <div className="app-header__custom-content">
            {children}
          </div>
        )}

        {/* Right actions */}
        <div className="app-header__actions">

          {/* Notifications */}
          {showNotifications && (
            <button
              type="button"
              className="app-header__icon-button"
              onClick={handleNotificationsClick}
              disabled={disabled || isLoading || !onNotificationsClick}
              aria-label={
                hasNotifications
                  ? `${notificationsLabel}, ${safeNotificationCount} unread`
                  : notificationsLabel
              }
              title={notificationsLabel}
            >
              <Bell size={24} strokeWidth={1.8} />

              {hasNotifications && (
                <span
                  className="app-header__notification-badge"
                  aria-hidden="true"
                >
                  {safeNotificationCount > 99
                    ? "99+"
                    : safeNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* Profile */}
          {showProfile && (
            <div
              className="app-header__profile-wrapper"
              ref={profileMenuRef}
            >
              <button
                ref={profileButtonRef}
                type="button"
                className="app-header__profile-button"
                onClick={handleProfileToggle}
                disabled={disabled || isLoading}
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                aria-controls={profileMenuId}
                aria-label={`Open profile menu for ${name}`}
              >
                <span className="app-header__avatar" aria-hidden="true">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" />
                  ) : (
                    displayInitials
                  )}
                </span>

                {showUserName && (
                  <span className="app-header__user-info">
                    <span className="app-header__user-name">
                      {name}
                    </span>

                    {email && (
                      <span className="app-header__user-email">
                        {email}
                      </span>
                    )}
                  </span>
                )}

                <ChevronDown
                  size={18}
                  className={`app-header__chevron ${
                    isProfileMenuOpen
                      ? "app-header__chevron--open"
                      : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Profile dropdown */}
              {isProfileMenuOpen && (
                <div
                  id={profileMenuId}
                  className={
                    isProfileDetailsOpen
                      ? "app-header__profile-menu app-header__profile-menu--details"
                      : "app-header__profile-menu"
                  }
                  role="menu"
                  aria-label="Profile menu"
                >

                  {/* ================================
                      PROFILE DETAILS
                     ================================ */}
                  {isProfileDetailsOpen ? (
                    <div className="app-header__details-panel">

                      <div className="app-header__details-header">
                        <button
                          type="button"
                          className="app-header__details-back"
                          onClick={handleBackToProfileMenu}
                          aria-label="Back to profile menu"
                        >
                          <ArrowLeft size={18} />
                        </button>

                        <div>
                          <strong>Profile Details</strong>
                          <span>Your account information</span>
                        </div>
                      </div>

                      <div className="app-header__details-avatar">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" />
                        ) : (
                          displayInitials
                        )}
                      </div>

                      <div className="app-header__details-name">
                        {name}
                      </div>

                      <div className="app-header__details-email">
                        {email}
                      </div>

                      <div className="app-header__details-list">
                        {profileFields.map((field) => {
                          const value = user[field.key];

                          if (
                            value === undefined ||
                            value === null ||
                            value === ""
                          ) {
                            return null;
                          }

                          return (
                            <div
                              className="app-header__detail-row"
                              key={field.key}
                            >
                              <span className="app-header__detail-label">
                                {field.label}
                              </span>

                              <span className="app-header__detail-value">
                                {value}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ) : (
                    <>
                      {/* User summary */}
                      <div className="app-header__menu-user">
                        <span className="app-header__avatar app-header__avatar--menu">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" />
                          ) : (
                            displayInitials
                          )}
                        </span>

                        <div className="app-header__menu-user-text">
                          <strong>{name}</strong>

                          {email && (
                            <span>{email}</span>
                          )}
                        </div>
                      </div>

                      <div className="app-header__menu-divider" />

                      {/* Profile button */}
                      {showProfileAction && (
                        <button
                          type="button"
                          className="app-header__menu-item"
                          role="menuitem"
                          onClick={handleProfileAction}
                        >
                          <CircleUserRound size={18} />
                          <span>Profile</span>
                        </button>
                      )}

                      {/* Logout */}
                      {showLogout && (
                        <button
                          type="button"
                          className="app-header__menu-item app-header__menu-item--danger"
                          role="menuitem"
                          onClick={handleLogout}
                          disabled={
                            isLogoutLoading || disabled
                          }
                        >
                          {isLogoutLoading ? (
                            <span
                              className="app-header__spinner"
                              aria-hidden="true"
                            />
                          ) : (
                            <LogOut size={18} />
                          )}

                          <span>
                            {isLogoutLoading
                              ? "Logging out..."
                              : "Logout"}
                          </span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile menu */}
          {showMobileMenuButton && (
            <button
              type="button"
              className="app-header__mobile-menu-button"
              onClick={handleMobileMenuClick}
              disabled={disabled || isLoading}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Helper functions
   ========================================================= */

function getInitials(name, providedInitials) {
  if (providedInitials?.trim()) {
    return providedInitials
      .trim()
      .slice(0, 3)
      .toUpperCase();
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`
    .toUpperCase();
}

function getAppInitials(name) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "A";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default Header;