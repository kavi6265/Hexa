import { auth } from "./firebase";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    if (auth.currentUser?.uid) {
      auth.signOut();
      navigate("/login");
    }
  }

  function getActiveClass(path) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <>
      <section id="header">
        <h2>Jasa Essential</h2>
        <div>
          <ul id="navbar">
            <li>
              <Link to="/admin/orders" className={getActiveClass("/admin/orders")}>
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/tempadmincontrol" className={getActiveClass("/admin/tempadmincontrol")}>
                Temp Admin Control
              </Link>
            </li>
            <li>
              <Link to="/admin/about" className={getActiveClass("/admin/about")}>
                About
              </Link>
            </li>
            <li>
              <Link to="/admin/contact" className={getActiveClass("/admin/contact")}>
                Contact
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </ul>
        </div>
      </section>

      {/* Nested Components will be rendered here */}
      <section id="admin-content">
        <Outlet />
      </section>
    </>
  );
}

export default Admin;
