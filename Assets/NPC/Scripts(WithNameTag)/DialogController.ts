import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Text} from "UnityEngine.UI";
import {WaitForSeconds} from "UnityEngine";

export default class DialogController extends ZepetoScriptBehaviour {
    public dialogText: Text;
    public dialogString: string;
    OnEnable() {
        this.StartCoroutine(this.Typing(this.dialogString));
    }

    *Typing(text: string) {

        this.dialogText.text = "";
        for (var i = 0; i < text.length; i++) {
            this.dialogText.text += text[i];
            yield new WaitForSeconds(0.1);
        }
    }

}