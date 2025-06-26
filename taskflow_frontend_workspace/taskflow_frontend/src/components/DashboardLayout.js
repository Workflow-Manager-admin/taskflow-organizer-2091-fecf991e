import React from "react";
import styles from "./DashboardLayout.module.css";

/**
 * PUBLIC_INTERFACE
 * DashboardLayout component: Provides a responsive shell with header, sidebar (categories/filters), and main content area.
 * Props:
 *   headerContent: Rendered in the header bar (typically navigation or actions)
 *   sidebar: Rendered in the left sidebar (typically filters/categories)
 *   children: Main content (task list/views)
 * 
 * Applies the color theme (primary: #1976d2, secondary: #424242, accent: #ff9800) and a minimal/modern, mobile-friendly style.
 */
function DashboardLayout({ headerContent, sidebar, children }) {
  return (
    <div className={styles.dashboardRoot}>
      <header className={styles.header}>{headerContent}</header>
      <div className={styles.layoutGrid}>
        <aside className={styles.sidebar}>{sidebar}</aside>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
