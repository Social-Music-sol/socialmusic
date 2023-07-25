import Cookies from 'js-cookie';

const handleLogout = () => {
  // Remove items from localStorage
  localStorage.clear();
  // Remove cookies
  Cookies.remove('cookie_name'); // replace 'cookie_name' with the name of your cookie
};
