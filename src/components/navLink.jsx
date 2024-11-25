import {Link, useLocation} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import {
    fa3,
    faN,
    faC,
    faS
}from "@fortawesome/free-solid-svg-icons";

const links = [
    {name: "三地域の観光地", href: "/tourist-attractions-in-three-areas", icon: fa3},
    {name: "北部の観光地", href: "/tourist-attractions-in-northern-area", icon: faN},
    {name: "中部の観光地", href: "/tourist-attractions-in-central-area", icon: faC},
    {name: "南部の観光地", href: "/tourist-attractions-in-southern-area", icon: faS},
]

export default function NavLink() {
    const location = useLocation();
    const pathname = location.pathname;

    return(
        <>
            {links.map((link) => {
                const Icon = link.icon;
                return (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={`nav-link ${pathname === link.href ? "active" : ""} menu d-flex align-items-center`}
                    >
                        <div className="menu-item d-flex align-items-center">
                            <FontAwesomeIcon icon={Icon} className="menu-icon" />
                            {link.name}
                        </div>
                    </Link>
                );
            })}
        </>
    );
}