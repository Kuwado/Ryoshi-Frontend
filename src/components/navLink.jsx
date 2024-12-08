import {Link, useLocation} from "react-router-dom";
import "./header.css";

const links = [
    {name: "三地域の観光地", href: "/tourist-attractions-in-three-areas", text: "3"},
    {name: "北部の観光地", href: "/tourist-attractions-in-northern-area", text: "N"},
    {name: "中部の観光地", href: "/tourist-attractions-in-central-area", text: "C"},
    {name: "南部の観光地", href: "/tourist-attractions-in-southern-area", text: "S"},
]

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