import {Link, useLocation} from "react-router-dom";
import "./header.css";

const links = [
    {name: "観光地を追加する", href: "/admin/admin-create-place", text: "3"},
    {name: "観光地のリスト", href: "/admin/admin-place-list", text: "N"},
]

export default function NavLinkAdmin() {
    const location = useLocation();
    const pathname = location.pathname;

    return(
        <>
            {links.map((link) => {
                return (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={`nav-link ${pathname === link.href ? "active" : ""} menu d-flex align-items-center`}
                    >
                        <div className="menu-item d-flex align-items-center">
                            <span className="menu-letter">{link.text}</span>
                            <span className="menu-text" style={{whiteSpace: 'nowrap'}}>{link.name}</span>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}