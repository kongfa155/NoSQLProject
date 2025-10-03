import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem, FaGithub } from 'react-icons/fa';
import { Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { DiReact } from 'react-icons/di';
import styles from './SideBar.module.css'; // CSS Module

const SideBar = (props) => {
  const { collapsed, toggled, handleToggleSidebar } = props;

  return (
    <Sidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      {/* Header */}
      <div
        style={{
          padding: '24px',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          fontSize: 14,
          letterSpacing: '1px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <DiReact size={'3em'} color={"#00bfff"} />
        <span>Quizzes</span>
      </div>

      {/* Content */}
      <Menu iconShape="circle">
        <MenuItem icon={<FaTachometerAlt />} component={<Link to="/admins" />}>
          Trang chủ
        </MenuItem>
        <SubMenu icon={<FaGem />} label="Chức năng">
          <MenuItem>Chức năng 1</MenuItem>
          <MenuItem>Chức năng 2</MenuItem>
          <MenuItem>Chức năng 3</MenuItem>
        </SubMenu>
      </Menu>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 'auto', padding: '20px 24px' }} className={styles.sidebarBtnWrapper}>
        <a
        //   href="https://github.com/azouaoui-med/react-pro-sidebar"
          target="_blank"
          className={styles.sidebarBtn}
        //   rel="noopener noreferrer"
        >
          <FaGithub />
          <span>page</span>
        </a>
      </div>
      <Button
          variant="secondary"
          onClick={() => setCollapsed((prev) => !prev)}
          style={{ marginBottom: 20 }}
        >
          {collapsed ? "Mở Sidebar" : "Thu gọn Sidebar"}
        </Button>
    </Sidebar>
  );
};

export default SideBar;
