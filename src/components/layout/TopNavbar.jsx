import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser, selectCurrentUser } from "../../store/slices/authSlice";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Avatar } from "../ui/Avatar";
import { notificationService } from "../../services/notification.service";
import "./TopNavbar.css";

export function TopNavbar({ collapsed, onToggleMobile }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationService.list();
        setNotifications(res?.data || []);
        setUnreadCount(res?.unreadCount || 0);
      } catch {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile search on escape
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [searchOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className={`top-navbar ${collapsed ? "collapsed" : ""}`}>
      <div className="top-navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobile}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div
          className={`top-navbar-search ${searchOpen ? "search-expanded" : ""}`}
        >
          <Search size={18} className="search-icon" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search tickets, contacts, articles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>

        <button
          className="mobile-search-toggle"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Toggle search"
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      <div className="top-navbar-actions">
        <ThemeToggle />

        <div className="navbar-notif-container" ref={notifRef}>
          <button
            className="navbar-icon-btn notification-btn"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          {isNotifOpen && (
            <div className="navbar-notif-dropdown">
              <div className="notif-dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="notif-mark-read"
                    onClick={async () => {
                      await notificationService.markAllRead();
                      setUnreadCount(0);
                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, isRead: true })),
                      );
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-dropdown-body">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications</div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n._id}
                      className={`notif-item ${n.isRead ? "" : "unread"}`}
                    >
                      <div className="notif-item-content">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-message">{n.message}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="navbar-user-container" ref={dropdownRef}>
          <div
            className={`navbar-user ${isDropdownOpen ? "active" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar
              name={user ? `${user.first_name} ${user.last_name}` : "User"}
              size="sm"
              status="online"
            />
            <div className="navbar-user-info">
              <span className="navbar-user-name">
                {user ? `${user.first_name} ${user.last_name}` : "User"}
              </span>
              <span className="navbar-user-role">{user?.role || "User"}</span>
            </div>
            <ChevronDown
              size={16}
              className={`navbar-user-chevron ${isDropdownOpen ? "rotate" : ""}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="navbar-user-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-user-name">
                  {user ? `${user.first_name} ${user.last_name}` : "User"}
                </span>
                <span className="dropdown-user-email">{user?.email || ""}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => navigate("/profile")}
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => navigate("/settings")}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
