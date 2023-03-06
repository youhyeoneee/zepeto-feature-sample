import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldContent } from 'ZEPETO.World';
import { Collider,Vector3,Quaternion } from 'UnityEngine';
import { ZepetoCharacter, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';

export default class MoveToWorld extends ZepetoScriptBehaviour {

    private zepetoCharacter: ZepetoCharacter;
    private worldId: string = "com.yuhyeon.forest"; // ex: com.default.jumpworld

    Start() {
        console.log("Start");
        
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            console.log(">>", this.zepetoCharacter);
        });
    }

    OnTriggerEnter(collider: Collider) {
        console.log(">> Triggered")
        console.log(">> ", this.zepetoCharacter == null)
        console.log(">> ", collider.gameObject != this.zepetoCharacter.gameObject)
        if ((this.zepetoCharacter == null) || (collider.gameObject != this.zepetoCharacter.gameObject)) {
            return;
        }
        
        ZepetoWorldContent.MoveToWorld(this.worldId, (errCode, errMsg) => {
            // Example of error callback processing (When implementing , try to implement it in various ways, such as pop-up windows)
            console.warn(`${errCode} - ${errMsg}`);
        });
    }

}