export const getLocalStorage = (key, defaultValue = null) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
};
