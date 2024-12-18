import {Link, useLocation} from "react-router-dom";
import "./header.css";

const links = [
    { name: "三地域の観光地", href: "/user/travel-list/all", text: "3"},
    { name: "北部の観光地", href: "/user/travel-list/north", text: "N"},
    { name: "中部の観光地", href: "/user/travel-list/central", text: "C"},
    { name: "南部の観光地", href: "/user/travel-list/south", text: "S"},
];

export default function NavLink() {
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
                            <span className="menu-text">{link.name}</span>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}