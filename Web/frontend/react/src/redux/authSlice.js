import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance"; // Axios 인스턴스 가져오기

// ✅ 로그인 요청 (비동기 Thunk)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ employeeNumber, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/accounts/login/", // Django 로그인 API 엔드포인트
        {
          employee_number: employeeNumber,
          password,
        }
      );

      // 로그인 성공 시 반환된 데이터 처리
      const userData = response.data;
      console.log("로그인 성공! 반환된 사용자 정보:", userData); // 여기에 console.log 추가

      return userData; // 유저 정보 (부서명, 직급 등 포함)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// ✅ 로그아웃 요청 (비동기 Thunk)
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await axiosInstance.post("/accounts/logout/"); // Django 로그아웃 API 엔드포인트
  localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 삭제
});

// ✅ 로그인 유지 (세션 정보 가져오기)
export const loadUser = createAsyncThunk("auth/loadUser", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/accounts/user/");
    return response.data; // 현재 로그인된 유저 정보 반환
  } catch (error) {
    return thunkAPI.rejectWithValue(null); // 로그인 정보 없으면 null 반환
  }
});

// ✅ 초기 상태 정의
const initialState = {
  user: null, // 현재 로그인한 사용자 정보 (부서명, 직급 포함)
  isAuthenticated: false, // 로그인 여부
  isLoading: false, // 로딩 상태
  error: null, // 에러 메시지 저장
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그아웃 후 상태 초기화하는 액션
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ 로그인 요청 처리
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload; // 로그인 시 받은 사용자 정보 저장
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ 로그아웃 처리
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })

      // ✅ 로그인 유지 (세션 체크)
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload; // 로그인된 유저 정보
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
