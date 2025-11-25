import { useState, useRef, useEffect } from "react";
import { Card, Typography, Input, Button } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOtpApi, forgotPasswordApi } from "../utils/Api/accountApi.js";
import companyImage from "../assets/images/infopicture5.jpg";
import "../styles/login.css";

const { Title, Text } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EnterOtpPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get("email") || "";

  // six separate inputs
  const [values, setValues] = useState(new Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(10 * 60); // default 10 minutes
  const inputsRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...values];
    next[index] = val;
    setValues(next);
    if (val && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(paste)) {
      setValues(paste.split(""));
      // focus last
      inputsRef.current[5]?.focus();
    }
    e.preventDefault();
  };

  const resendCode = async () => {
    if (!email) return toast.error("Missing email");
    try {
      const frontendUrl = window.location.origin;
      const res = await forgotPasswordApi(email, frontendUrl);
      if (res && res.EC === 0) {
        toast.success(res.EM || "Verification code resent", {
          autoClose: 2000,
        });
        setSecondsLeft(10 * 60);
        setValues(new Array(6).fill(""));
        inputsRef.current[0]?.focus();
      } else {
        toast.error(res.EM || "Could not resend code");
      }
    } catch (err) {
      console.error(err);
      toast.error("Resend failed");
    }
  };

  const submitOtp = async () => {
    const code = values.join("");
    if (code.length !== 6) return toast.error("Please enter the 6-digit code");
    try {
      const res = await verifyOtpApi(email, code);
      if (res && res.EC === 0) {
        toast.success(res.EM || "Code verified", { autoClose: 1500 });
        // navigate to reset password page with email and otp in query
        navigate(
          `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(code)}`,
        );
      } else {
        toast.error(res.EM || "Invalid or expired code");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-branding">
        <img src={companyImage} alt="Company" className="branding-background" />
        <div className="branding-content">
          <div className="brand-logo">
            <img
              src="/logoWhite.svg"
              alt="Logo"
              className="header-logo-image"
            />
          </div>
          <Title level={1} className="brand-title">
            HRM System
          </Title>
          <Text className="brand-subtitle">Enter verification code</Text>
        </div>
      </div>

      <div className="login-form-section">
        <Card className="login-card" bordered={false}>
          <div className="form-header">
            <Title level={2} className="form-title">
              Enter the 6-digit code
            </Title>
            <Text className="form-subtitle">
              We sent a verification code to <strong>{email}</strong>
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 14,
            }}
            onPaste={handlePaste}
          >
            {values.map((v, i) => (
              <Input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={v}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 72,
                  height: 72,
                  textAlign: "center",
                  fontSize: 26,
                  fontWeight: 800,
                  margin: "0 8px",
                  borderRadius: 10,
                }}
              />
            ))}
          </div>

          <Button
            type="primary"
            block
            size="large"
            className="login-button"
            onClick={submitOtp}
          >
            Verify code
          </Button>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: secondsLeft === 0 ? "#ff4d4f" : "#666",
              }}
            >
              {secondsLeft > 0
                ? `Expires in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
                : "OTP expired"}
            </div>
            <div>
              <Button
                type="link"
                onClick={resendCode}
                disabled={secondsLeft > 0}
              >
                Resend code
              </Button>
              <Link to="/forgot-password" style={{ marginLeft: 8 }}>
                Change email
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnterOtpPage;
