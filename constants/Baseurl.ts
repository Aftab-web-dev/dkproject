export const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_API_URL;
export const AUTH = `${API_BASE_URL}/auth`;

export const API_ENDPOINTS = {
    Authentication: {
        login: () => `${AUTH}/login`,
        verify_otp: () => `${AUTH}/verify-otp`
    },
    Profile:{
        update_profile: () => `${API_BASE_URL}/customer/update-profile`,
        get_profile: () => `${API_BASE_URL}/customer/get-profile`,
    }
}