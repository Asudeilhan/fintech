import { thunk } from 'redux-thunk'

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, 
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // Firebase ve zaman damgaları için gerekli
    })
});