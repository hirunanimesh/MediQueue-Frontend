import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { Role } from '@/constants/roles';

interface AuthState {
  token: string | null;
  role: Role | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearAuthState: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
