import React, { useEffect } from 'react'
import RootNavigation from './src/navigation/RootNavigation';
import { Provider, useDispatch } from 'react-redux'
import { store } from './src/redux/store'
import { createAdminUser } from './src/redux/adminSlice'; // ✅ adminSlice'tan import ediyoruz

// Yeni bir iç component yazıyoruz
const MainApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createAdminUser()); // 🔥 App açılır açılmaz admin oluştur
  }, []);

  return <RootNavigation />;
};

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}

export default App;
