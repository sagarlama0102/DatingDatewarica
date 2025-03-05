import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ match }) => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiPickerRef = useRef(null);

	const { sendMessage } = useMessageStore();

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		try {
			// Assuming match.id is the correct ID in Sequelize, use match.id for the message
			await sendMessage(match.id, message); // Ensure you are using the match.id
			setMessage("");
			window.location.reload();
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<form onSubmit={handleSendMessage} className="flex relative">
			{/* Emoji Picker Button */}
			<button
				type="button"
				onClick={() => setShowEmojiPicker((prev) => !prev)}
				className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none"
			>
				<Smile size={24} />
			</button>

			{/* Message Input */}
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className="flex-grow p-3 pl-12 rounded-l-lg border-2 border-pink-500 
        focus:outline-none focus:ring-2 focus:ring-pink-300"
				placeholder="Type a message..."
			/>

			{/* Send Button */}
			<button
				type="submit"
				className="bg-pink-500 text-white p-3 rounded-r-lg 
        hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
			>
				<Send size={24} />
			</button>

			{/* Emoji Picker */}
			{showEmojiPicker && (
				<div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-10">
					<EmojiPicker
						onEmojiClick={(emojiObject) => {
							if (emojiObject?.emoji) {
								setMessage((prev) => prev + emojiObject.emoji);
							}
						}}
					/>
				</div>
			)}
		</form>
	);
};

export default MessageInput;
