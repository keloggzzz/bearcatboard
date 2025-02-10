import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // Change this to your backend URL
    withCredentials: true, // Allows sending cookies (for refresh token)
});

api.interceptors.response.use(
    (response) => response, // If the response is fine, just return it
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                // Call refresh endpoint
                const refreshResponse = await axios.post(
                    "http://localhost:5000/auth/refresh-token",
                    {},
                    { withCredentials: true }
                );

                // Update the access token
                api.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;

                // Retry the original request with the new token
                error.config.headers["Authorization"] = `Bearer ${refreshResponse.data.accessToken}`;
                return api.request(error.config);
            } catch (refreshError) {
				if (window.location.href === "http://localhost:5173/auth/login ") { 
					console.error("Refresh token failed" + window.location.href + " ", refreshError);
					window.location.href = "/auth/login"; // Redirect to login if refresh fails
					return Promise.reject(refreshError);
				}
            }
        }
        return Promise.reject(error);
    }
);

export default api;