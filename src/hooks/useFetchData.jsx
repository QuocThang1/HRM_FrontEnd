import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useFetchData = (apiFunction, options = {}) => {
    const {
        dependencies = [],
        onSuccess,
        onError,
        showErrorToast = true,
        initialData = [],
        enabled = true,
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!enabled) return;

        try {
            setLoading(true);
            setError(null);
            const res = await apiFunction();

            if (res && res.EC === 0) {
                const responseData = Array.isArray(res.data)
                    ? res.data
                    : (res.data || []);

                setData(responseData);
                onSuccess?.(responseData);

            } else {

                const errorMsg = res?.EM || "Failed to fetch data";
                setError(errorMsg);
                onError?.(errorMsg);

                if (showErrorToast) {
                    toast.error(errorMsg, { autoClose: 2000 });
                }
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            const errorMsg = err?.response?.data?.EM || err?.message || "Failed to fetch data";

            setError(errorMsg);
            onError?.(err);

            if (showErrorToast) {
                toast.error(errorMsg, { autoClose: 2000 });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, dependencies);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        setData,
    };
};

export default useFetchData;