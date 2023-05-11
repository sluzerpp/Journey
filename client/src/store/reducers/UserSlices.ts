import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IToken, IUser } from "../../types/IUser";

interface UserState {
  user: IUser,
  error: string
}

const userInitialState: UserState = {
  user: {
    nickname: '',
    email: '',
    role: 'USER',
    currentExperience: 0,
    experienceNextLevel: 100,
    level: 0,
    coins: 0,
    avatar: '',
    createdAt: ''
  },
  error: ''
}

export const UserSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    userFetchingSuccess(state, action: PayloadAction<IUser>) {
      state.error = '';
      state.user = action.payload;
    },
    userFetchingError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

export const UserReducer = UserSlice.reducer;

interface IUserTokenState {
  token: string,
  error: string,
  isLoading: boolean,
}

const userCheckInitialState: IUserTokenState = {
  token: '',
  error: '',
  isLoading: false,
}
 
export const UserTokenSlice = createSlice({
  name: 'userCheck',
  initialState: userCheckInitialState,
  reducers: {
    userTokenFetching(state) {
      state.isLoading = true;
    },
    userTokenFetchingSuccess(state, action: PayloadAction<IToken>) {
      state.isLoading = false;
      state.error = '';
      state.token = action.payload.token;
    },
    userTokenFetchingError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const UserTokenReducer = UserTokenSlice.reducer;

export interface SignState {
  isSingIn: boolean;
}

const SignInitialState: SignState = {
  isSingIn: false,
}

export const SignSlice = createSlice({
  name: 'login',
  initialState: SignInitialState,
  reducers: {
    setSign(state, action: PayloadAction<boolean>) {
      state.isSingIn = action.payload;
    },
  }
})

export const SignReducer = SignSlice.reducer;