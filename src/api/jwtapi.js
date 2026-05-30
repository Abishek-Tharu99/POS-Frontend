import axios from "axios";

const tokenapi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// -------------------------
// Refresh state (GLOBAL LOCK)
// -------------------------
let isRefreshing = false;
let failedQueue = [];

// resolve queued requests
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// -------------------------
// REQUEST INTERCEPTOR
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
// RESPONSE INTERCEPTOR
// -------------------------
tokenapi.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // prevent retry loop
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // refresh endpoint protection
        if (originalRequest.url === "/api/token/refresh/") {
            logout();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // -------------------------
        // If already refreshing → queue request
        // -------------------------
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({
                    resolve: (token) => {
                        originalRequest.headers.Authorization =
                            "Bearer " + token;
                        resolve(tokenapi(originalRequest));
                    },
                    reject: (err) => {
                        reject(err);
                    },
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                throw new Error("No refresh token");
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
                {
                    refresh: refreshToken,
                }
            );

            const newToken = res.data.access;

            localStorage.setItem("access", newToken);

            // update header for future requests
            tokenapi.defaults.headers.common.Authorization =
                "Bearer " + newToken;

            processQueue(null, newToken);

            // retry original request
            originalRequest.headers.Authorization =
                "Bearer " + newToken;

            return tokenapi(originalRequest);
        } catch (err) {
            processQueue(err, null);
            logout();
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

// -------------------------
// GLOBAL LOGOUT
// -------------------------
function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    window.location.href = "/";
}

export default tokenapi;