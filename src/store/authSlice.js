import { createSlice } from '@reduxjs/toolkit'
import { saveUserData, clearUserData, updateUserData, getUserData, getAccessToken, getRoleIdOverride } from '../utils/authStorage'

const ROLE_LABELS = {
  3: 'client',
  4: 'cleaner_or_provider',
  5: 'supervisor',
  6: 'guest',
}

const deriveRoleId = (user) => {
  const roleCandidate = user?.user_type ?? user?.role ?? user?.role_id ?? user?.user_role ?? user?.roleId ?? user?.data?.user_type
  const parsedRole = Number(roleCandidate)
  return Number.isNaN(parsedRole) ? null : parsedRole
}

const initialUser = getUserData()
// Check for roleId override first (for guest users), then derive from user data
const storedRoleOverride = getRoleIdOverride()
const initialRoleId = storedRoleOverride !== null ? storedRoleOverride : deriveRoleId(initialUser)

const initialState = {
  user: initialUser,
  token: getAccessToken(),
  roleId: initialRoleId,
  role: initialRoleId ? ROLE_LABELS[initialRoleId] ?? null : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload || {}
      const userData = payload.data || null
      // Check if this is a guest login attempt to override roleId
      let roleId = deriveRoleId(userData)
      
      if (payload.isGuest || (payload.message && payload.message.toLowerCase().includes('guest'))) {
        roleId = 6;
      }

      state.user = userData
      state.token = payload.access_token || null
      state.roleId = roleId
      state.role = roleId ? ROLE_LABELS[roleId] ?? null : null

      saveUserData({ ...payload, roleId }) // Save with corrected roleId
    },
    updateUserFromProfile: (state, action) => {
      const updates = action.payload || {}
      const mergedUser = state.user ? { ...state.user, ...updates } : updates

      state.user = mergedUser
      updateUserData(updates)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.roleId = null
      state.role = null
      clearUserData()
    },
  },
})

export const { setCredentials, logout, updateUserFromProfile } = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectCurrentUser = (state) => state.auth.user
export const selectAccessToken = (state) => state.auth.token
export const selectRoleId = (state) => state.auth.roleId
export const selectRoleLabel = (state) => state.auth.role

export default authSlice.reducer
