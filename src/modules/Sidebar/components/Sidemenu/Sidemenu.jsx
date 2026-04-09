import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import menuData from '../../../../common_data';
import MenuItem from "../../../../UI/MenuItem";

const Sidemenu = ({collapsed}) => {
    const location = useLocation();
    let linkStyle = 'inline-block md:flex lg:inline-block justify-normal md:justify-center lg:justify-normal rounded-xl duration-100 p-3';

    const { rol } = useSelector(state => state.AuthSlice);
    const data = menuData.filter(([_, __, ___, roles]) => roles.includes(rol));
    
    return (
      <ul className="flex flex-col text-zinc-950 dark:text-gray-300 font-semibold m-3 space-y-3">
        {data.map(([title, url, image]) => (
          <Link to={url} key={url} className={ location.pathname === url ? ( linkStyle + ' bg-zinc-300 dark:bg-zinc-800 ' ) : ( linkStyle + ' rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-800' ) }>
            <MenuItem image={image}>
              <p className={collapsed ? "hidden" : "inline"}>{title}</p>
            </MenuItem>
          </Link>
        ))}
      </ul>
    );
  };
  
  export default Sidemenu;