import { NavLink } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="main-nav">
      <h1 className="app-title">備品管理システム</h1>
      <ul className="nav-links">
        <li>
          <NavLink to="/categories" className={({ isActive}) => isActive ? 'active' : ''}>
            カテゴリ-
          </NavLink>
        </li>
        <li>
          <NavLink to="/locations" className={({ isActive}) => isActive ? 'active' : ''}>
            場所
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation