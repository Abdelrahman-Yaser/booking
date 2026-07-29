import Link from "next/link";
import { servicesItems } from "../../data/mainMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import { 
  MdFlightTakeoff, 
  MdHotel, 
  MdDirectionsCar, 
  MdExplore, 
  MdDirectionsBoat, 
  MdSurfing 
} from 'react-icons/md';

const MainMenu = ({ style = "" }) => {
  const pathname = usePathname();

  // Modern and elegant icon mapping
  const iconMap = {
    "icon-airplane": <MdFlightTakeoff />,
    "icon-living-room": <MdHotel />,
    "icon-jeep": <MdDirectionsCar />,
    "icon-globe": <MdExplore />,
    "icon-yatch": <MdDirectionsBoat />,
    "icon-beach-umbrella": <MdSurfing />
  };

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        {/* Services - Direct Links (No Dropdowns) */}
        {servicesItems.map((service, i) => (
          <li
            key={i}
            className={isActiveLink(service.routePath, pathname) ? "current" : ""}
          >
            <Link href={service.routePath}>
              <span style={{
                fontSize: '20px', 
                fontWeight: 'normal',
                color: 'inherit',
                marginRight: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                verticalAlign: 'middle',
                transition: 'all 0.3s ease'
              }}>
                {iconMap[service.icon]}
              </span>
              {service.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainMenu; 