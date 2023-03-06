import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Button, InputField, Text } from 'UnityEngine.UI';
import { ZepetoChat, MessageType, UserMessage } from 'ZEPETO.Chat';
import { Color } from 'UnityEngine';


export default class CustomChat extends ZepetoScriptBehaviour {
    
    public sendChatBtn: Button;
    public resultText: Text;
    public inputChatbox: InputField;

    Start() {

        this.sendChatBtn.onClick.AddListener(() => {
            this.resultText.color = Color.black;
            const inputMsg = this.inputChatbox.text;
            ZepetoChat.Send(inputMsg);
        });

        // Receive message
        ZepetoChat.OnReceivedMessage.AddListener(msg => {
            const userMsg = msg as UserMessage;
            this.resultText.text = `[USER - ${userMsg.userName}] - ${userMsg.message}`;
        });
    }
}