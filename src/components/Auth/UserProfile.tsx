import { useState, useRef, useEffect } from "react";
import { User } from "@hooks/useAuth";
import styles from "./styles.module.css";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <div className={styles.userProfile} ref={dropdownRef}>
      <button
        className={styles.profileButton}
        onClick={toggleDropdown}
        aria-label={`User menu for ${user.username}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <img
          src={user.avatar}
          alt={`${user.username}'s avatar`}
          className={styles.profileAvatar}
        />
      </button>

      {isDropdownOpen && (
        <div
          className={styles.profileDropdown}
          role="menu"
          aria-label="User menu"
        >
          <div className={styles.dropdownItem}>
            <div className={styles.username}>{user.username}</div>
            {user.email && (
              <div style={{ fontSize: "0.85rem", color: "#b8c4ce" }}>
                {user.email}
              </div>
            )}
          </div>

          <a
            href={user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.dropdownLink}
            role="menuitem"
          >
            View GitHub Profile
          </a>

          <button
            onClick={handleLogout}
            className={`${styles.dropdownButton} ${styles.logoutButton}`}
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
