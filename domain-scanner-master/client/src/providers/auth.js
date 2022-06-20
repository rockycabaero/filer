const authProvider = {
    // authentication
    login: ({ username, password }) => {
        const request = new Request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: new Headers({ "Content-Type": "application/json" }),
        });
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((auth) => {
                localStorage.setItem("auth", JSON.stringify(auth));
                return Promise.resolve();
            })
            .catch(() => {
                // throw new Error('Network error')
                return Promise.reject();
            });

        // if(username === 'admin' && password === '1234') {
        //  localStorage.setItem('auth', JSON.stringify({ id: 1, fullname: 'Admin', avatar: '' }));
        //  return Promise.resolve()
        // }else{
        //  return Promise.reject()
        // }
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("auth");
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    checkAuth: () =>
        localStorage.getItem("auth") ? Promise.resolve() : Promise.reject(),
    logout: () => {
        localStorage.removeItem("auth");
        return Promise.resolve();
    },
    getIdentity: () => Promise.resolve(),
    // authorization
    getPermissions: (params) => Promise.resolve(),
};

export default authProvider;
