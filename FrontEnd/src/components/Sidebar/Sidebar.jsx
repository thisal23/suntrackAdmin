import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.scss';
import {
  Dashboard,
  People,
  DirectionsCar,
  Person,
  Settings,
  ExitToApp
} from '@mui/icons-material';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'Admin';

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="SunTrack Admin" />
      </div>

      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={styles.navItem}>
          <Dashboard /> Dashboard
        </NavLink>

        {isAdmin && (
          <NavLink to="/fleet-managers" className={styles.navItem}>
            <People /> Fleet Managers
          </NavLink>
        )}

        <NavLink to="/vehicles" className={styles.navItem}>
          <DirectionsCar /> Vehicles
        </NavLink>

        <NavLink to="/drivers" className={styles.navItem}>
          <Person /> Drivers
        </NavLink>

        <NavLink to="/settings" className={styles.navItem}>
          <Settings /> Settings
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <button onClick={logout} className={styles.logoutBtn}>
          <ExitToApp /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
