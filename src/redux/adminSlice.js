import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// 🔥 Admin Giriş İşlemi
export const adminLogin = createAsyncThunk('admin/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.role !== 'admin') {
        throw new Error('Bu kullanıcı admin değil.');
      }
      return { user };
    } else {
      throw new Error('Kullanıcı bulunamadı.');
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 🔥 Kullanıcıları Çekme
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    return rejectWithValue('Kullanıcıları çekme hatası');
  }
});

// 🔥 Fatura Ekleme
export const addBill = createAsyncThunk('admin/addBill', async ({ bill }, { rejectWithValue }) => {
  try {
    const billsCollectionRef = collection(db, 'bills');
    await addDoc(billsCollectionRef, bill);
    return bill;
  } catch (error) {
    return rejectWithValue('Fatura ekleme hatası');
  }
});

// 🔥 Admin Kullanıcı Oluşturma
export const createAdminUser = createAsyncThunk('admin/createAdminUser', async (_, { rejectWithValue }) => {
  try {
    const auth = getAuth();
    let user;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, "admin@example.com", "123456");
      user = userCredential.user;
      console.log("Authentication'da yeni admin oluşturuldu:", user.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        const signInCredential = await signInWithEmailAndPassword(auth, "admin@example.com", "123456");
        user = signInCredential.user;
        console.log("Authentication'da admin kullanıcı bulundu:", user.uid);
      } else {
        throw error;
      }
    }

    if (!user) {
      throw new Error('Admin kullanıcısı alınamadı.');
    }

    const adminDocRef = doc(db, "users", user.uid);
    const adminSnap = await getDoc(adminDocRef);

    if (!adminSnap.exists()) {
      await setDoc(adminDocRef, {
        createdAt: serverTimestamp(),
        email: user.email,
        firstName: "admin",
        lastName: "User",
        phoneNumber: "12548754215",
        role: "admin",
        tcNo: "12548754215"
      });
      console.log("Firestore'da admin kaydı başarıyla eklendi!");
    } else {
      console.log("Admin zaten Firestore'da kayıtlı.");
    }

    return "Admin başarıyla Authentication ve Firestore'a kaydedildi!";
  } catch (error) {
    console.error("Admin oluşturulurken hata:", error.message);
    return rejectWithValue(error.message);
  }
});

// 🔥 Slice Başlangıç Durumu
const initialState = {
  adminUser: null,
  isAdmin: false,
  users: [],
  loading: false,
  error: null,
  createAdminStatus: 'idle', // idle | loading | succeeded | failed
};

// 🔥 Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.adminUser = action.payload;
      state.isAdmin = true;
    },
    clearAdmin: (state) => {
      state.adminUser = null;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUser = action.payload.user;
        state.isAdmin = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAdmin = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(addBill.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAdminUser.pending, (state) => {
        state.createAdminStatus = 'loading';
      })
      .addCase(createAdminUser.fulfilled, (state) => {
        state.createAdminStatus = 'succeeded';
      })
      .addCase(createAdminUser.rejected, (state, action) => {
        state.createAdminStatus = 'failed';
        state.error = action.payload;
      });
  },
});

// 🔥 Exportlar
export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
