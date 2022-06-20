import axios from "axios";

axios.interceptors.request.use(
	(config) => {
		const token = JSON.parse(localStorage.getItem("auth"));
		config.headers["Authorization"] = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);
