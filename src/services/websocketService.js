import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WEB_SOCKET_URL } from "../constants/constants";

const isValidJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};

class WebSocketService {
    static stompClient = null;


    static connect = (user, projectId, onMessage) => {
        WebSocketService.stompClient = Stomp.over(() => new SockJS(WEB_SOCKET_URL));
        WebSocketService.stompClient.reconnectDelay = 5000;

        WebSocketService.stompClient.onConnect = () => {
            console.log('WebSocket connected');
            WebSocketService.subscribe(`/public/project/${projectId}`, onMessage);
            WebSocketService.subscribe(`/private/${user}`, onMessage);
        };

        WebSocketService.stompClient.onStompError = (error) => {
            console.error('WebSocket STOMP error:', error);
        };

        WebSocketService.stompClient.activate();
    };

    static subscribe = (topic, onMessage) => {
        if (WebSocketService.stompClient?.connected) {
            WebSocketService.stompClient.subscribe(topic, (message) => {
                if (isValidJson(message.body)) {
                    const parsedMessage = JSON.parse(message.body);
                    console.log(`Received message from ${topic}:`, parsedMessage);
                    if (onMessage) onMessage(parsedMessage);
                } else {
                    console.warn(`Invalid JSON message received from ${topic}:`, message.body);
                }
            });
        } else {
            console.error('Cannot subscribe. WebSocket is not connected.');
        }
    };


    static sendMessage = (message) => {
        if (WebSocketService.stompClient?.connected) {
            WebSocketService.stompClient.send('/app/send', {}, JSON.stringify(message));
            console.log('Message sent:', message);
        } else {
            console.error('WebSocket is not connected.');
        }
    };

    static disconnect = () => {
        if (WebSocketService.stompClient) {
            WebSocketService.stompClient.deactivate();
            console.log('WebSocket disconnected manually');
        }
    };
}

export default WebSocketService;
