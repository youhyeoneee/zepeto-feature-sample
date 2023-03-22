import { GameObject, HumanBodyBones, Object, Collider } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Button } from 'UnityEngine.UI';
import { ZepetoCharacter, ZepetoPlayers } from "ZEPETO.Character.Controller";

export default class NPCDialogInteraction extends ZepetoScriptBehaviour {

    public npcDialogCanvas: GameObject;
    public yesButton: Button;
    public noButton: Button;

    private _zepetoCharacter: ZepetoCharacter;

    Start() {

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(()=>{
            this._zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
        
        // Dialog - Select Yes
        this.yesButton.onClick.AddListener(() => {
            console.log("yes")
            this.npcDialogCanvas.SetActive(false);
        });

        // Dialog - Select No
        this.noButton.onClick.AddListener(() => {
            console.log("no")
            this.npcDialogCanvas.SetActive(false);
        });

    }

    // Check if Player character enter collider
    OnTriggerEnter(collider: Collider) {
        if (this._zepetoCharacter == null || collider.gameObject != this._zepetoCharacter.gameObject) {
            return;
        }
        this.npcDialogCanvas.SetActive(true);
    }

    OnTriggerExit(collider: Collider) {
        if (this._zepetoCharacter == null || collider.gameObject != this._zepetoCharacter.gameObject) {
            return;
        }
        this.npcDialogCanvas.SetActive(false);
    }

}