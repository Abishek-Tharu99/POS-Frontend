import axios from "axios";

const tokenapi = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
});

// -------------------------
// Attach Access Token
// -------------------------
tokenapi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// -------------------------
// Handle Token Expiry (Auto Refresh)
// -------------------------
tokenapi.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");

                if (!refreshToken) {
                    throw new Error("No refresh token found");
                }

                // Get new access token
                const res = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/",
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken = res.data.access;

                localStorage.setItem("access", newAccessToken);

                // Update header and retry request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (err) {
                // Refresh failed → logout user
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");

                window.location.href = "/";

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default tokenapi;