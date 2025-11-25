import { Form } from "antd";
import { toast } from "react-toastify";

const useForm = (options = {}) => {
  const { onSuccess, onError, successMessage, errorMessage } = options;
  const [form] = Form.useForm();

  const handleSubmit = async (apiFunction, transformData) => {
    try {
      const values = await form.validateFields();
      const dataToSubmit = transformData ? transformData(values) : values;

      const res = await apiFunction(dataToSubmit);

      if (res && res.EC === 0) {
        toast.success(successMessage || res.EM || "Success", {
          autoClose: 2000,
        });
        form.resetFields();
        onSuccess?.(res);
        return { success: true, data: res.data };
      } else {
        toast.error(res?.EM || errorMessage || "Operation failed", {
          autoClose: 2000,
        });
        onError?.(res);
        return { success: false, error: res };
      }
    } catch (error) {
      console.error("Form submission error:", error);

      if (error.errorFields) {
        toast.error("Please check the form fields", {
          autoClose: 2000,
        });
      } else {
        const errorMsg =
          error?.response?.data?.EM ||
          error?.message ||
          errorMessage ||
          "Failed to submit form";
        toast.error(errorMsg, { autoClose: 2000 });
      }

      onError?.(error);
      return { success: false, error };
    }
  };

  const reset = () => {
    form.resetFields();
  };

  return {
    form,
    handleSubmit,
    reset,
  };
};

export default useForm;
