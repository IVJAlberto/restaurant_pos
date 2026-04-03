// helpers/signoutUser.js
import { getAuth } from 'firebase/auth';

// Функция для деавторизации пользователя
export const SignOutUser = (navigate) => {
  const auth = getAuth(); // Получаем auth
  auth.signOut()
    .then(() => {
      navigate("/");
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
};
