import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import menuData from '../../../../common_data';
import MenuItem from "../../../../UI/MenuItem";

const Sidemenu = ({collapsed}) => {
    const location = useLocation();
    let linkStyle = 'inline-block md:flex lg:inline-block justify-normal md:justify-center lg:justify-normal rounded-l-3xl duration-100 p-3';

    const { rol } = useSelector(state => state.AuthSlice);
    const data = menuData.filter(([_, __, ___, roles]) => roles.includes(rol));
    
    return (
      <ul className="flex flex-col font-semibold ml-3 space-y-3">
        {data.map(([title, url, image]) => (
          <Link to={url} key={url} className={ location.pathname === url ? ( linkStyle + ' bg-background text-primary' ) : ( linkStyle + ' hover:bg-secondary text-white' ) }>
            <MenuItem image={image}>
              <p className={collapsed ? "hidden" : "inline"}>{title}</p>
            </MenuItem>
          </Link>
        ))}
      </ul>
    );
  };
  
  export default Sidemenu;