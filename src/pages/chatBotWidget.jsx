import { useState, useEffect, useRef, useContext } from "react";
import { MessageOutlined, CloseOutlined, SendOutlined, DeleteOutlined } from "@ant-design/icons";
import { Input, Spin, Avatar, Typography, Popconfirm } from "antd";
import { chatWithBotApi } from "../utils/Api/chatbotApi";
import { toast } from "react-toastify";
import { AuthContext } from "../context/auth.context";
import "../styles/chatBotWidget.css";

const { Text } = Typography;

const ChatBotWidget = () => {
    const { auth } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const initialMessage = {
        id: 1,
        text: "Xin chào! Tôi là trợ lý HR của công ty. Tôi có thể giúp gì cho bạn về các chính sách công ty?",
        sender: "bot",
        timestamp: new Date(),
    };
    const [messages, setMessages] = useState([initialMessage]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages([initialMessage]);
        setIsOpen(false);
    }, [auth.isAuthenticated]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setLoading(true);

        try {
            const response = await chatWithBotApi(inputValue);

            const botMessage = {
                id: Date.now() + 1,
                text: response?.data?.message || "Xin lỗi, tôi không thể trả lời câu hỏi này.",
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([initialMessage]);
        toast.success("Chat history deleted", { autoClose: 2000 });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            {/* Chat Button */}
            <div
                className={`chatbot-button ${isOpen ? "hidden" : ""}`}
                onClick={toggleChat}
            >
                <MessageOutlined style={{ fontSize: "24px" }} />
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-content">
                            <Avatar
                                size={40}
                                style={{
                                    backgroundColor: "#1890ff",
                                }}
                            >
                                HR
                            </Avatar>
                            <div className="chatbot-header-info">
                                <Text strong style={{ color: "#fff" }}>
                                    HR Assistant
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "12px",
                                        color: "rgba(255,255,255,0.85)",
                                    }}
                                >
                                    Online
                                </Text>
                            </div>
                        </div>
                        <CloseOutlined
                            className="chatbot-close-btn"
                            onClick={toggleChat}
                        />
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.sender === "user" ? "user-message" : "bot-message"
                                    }`}
                            >
                                {message.sender === "bot" && (
                                    <Avatar
                                        size={32}
                                        style={{
                                            backgroundColor: "#1890ff",
                                            flexShrink: 0,
                                        }}
                                    >
                                        HR
                                    </Avatar>
                                )}
                                <div className="message-content">
                                    <div className="message-bubble">
                                        <Text style={{ whiteSpace: "pre-wrap" }}>
                                            {message.text}
                                        </Text>
                                    </div>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: "11px", marginTop: "4px" }}
                                    >
                                        {formatTime(message.timestamp)}
                                    </Text>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message bot-message">
                                <Avatar
                                    size={32}
                                    style={{
                                        backgroundColor: "#1890ff",
                                        flexShrink: 0,
                                    }}
                                >
                                    HR
                                </Avatar>
                                <div className="message-content">
                                    <div className="message-bubble">
                                        <Spin size="small" />
                                        <Text style={{ marginLeft: "8px" }}>
                                            Thinking...
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chatbot-input">
                        <Input.TextArea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter your question..."
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            disabled={loading}
                        />
                        <Popconfirm
                            title="Clear chat history"
                            description="Are you sure you want to clear the entire chat history?"
                            onConfirm={handleClearChat}
                            okText="Clear"
                            cancelText="Cancel"
                            disabled={messages.length <= 1}
                        >
                            <button
                                className="chatbot-clear-btn"
                                disabled={messages.length <= 1}
                                title="Clear chat history"
                            >
                                <DeleteOutlined />
                            </button>
                        </Popconfirm>
                        <button
                            className="chatbot-send-btn"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || loading}
                        >
                            <SendOutlined />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBotWidget;