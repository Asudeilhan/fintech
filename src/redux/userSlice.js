import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig';


export const login = createAsyncThunk('user/login', async ({ email, password }) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = user.stsTokenManager.accessToken;

    // Kullanıcı verisini Firestore'dan çekme
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      await AsyncStorage.setItem('userToken', token);
      return { token, user: { ...userData, uid: user.uid } };
    } else {
      throw new Error('Kullanıcı bulunamadı.');
    }
  } catch (error) {
    console.log("Giriş Hatası:", error.message);
    throw error;
  }
});

// Kullanıcı çıkış işlemi
export const logout = createAsyncThunk('user/logout', async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    await AsyncStorage.removeItem('userToken');
    return null;
  } catch (error) {
    console.log("Çıkış Hatası:", error.message);
    throw error;
  }
});
export const register = createAsyncThunk(
  'user/register',
  async ({ email, password, firstName, lastName, tcNo, phoneNumber, balance, branch, cardInfo }, thunkAPI) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = user.stsTokenManager.accessToken;
      const cardsRef = collection(db, 'cards');
      const q = query(cardsRef, where('isUsed', '==', false));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Kullanılabilir kart kalmadı.');
      }

      const cardDoc = snapshot.docs[0];
      const cardData = cardDoc.data();

      // 🔁 Sadece kart koleksiyonunu güncelle, kullanıcıya isUsed verme
      await updateDoc(doc(db, 'cards', cardDoc.id), { isUsed: true });

      const userData = {
        firstName,
        lastName,
        tcNo,
        phoneNumber,
        email,
        balance: 5000,
        branch,
        cardInfo: {
          cardNumber: cardData.cardNumber,
          cardPassword: cardData.cardPassword,
          cvv: cardData.cvv,
          expiryDate: cardData.expiryDate,
          iban: cardData.iban
        },
        role: 'user',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      await sendEmailVerification(user);
      await AsyncStorage.setItem('userToken', token);

      return { token, user: { ...userData, uid: user.uid } };
    } catch (error) {
      console.log("Kayıt Hatası:", error.message);
      throw error;
    }
  }
);


const initialState = {
  email: null,
  password: null,
  isLoading: false,
  isAuth: false,
  token: null,
  user: null,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Giriş işlemi
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.error = "Giriş yapılamadı";
      })
      // Kayıt işlemi
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuth = false;
        state.error = "Kullanıcı kaydı başarısız";
      })
      // Çıkış işlemi
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.error = "Çıkış yapılamadı";
      });
  },
});

export const { setEmail, setPassword, setIsLoading } = userSlice.actions;
export default userSlice.reducer;
