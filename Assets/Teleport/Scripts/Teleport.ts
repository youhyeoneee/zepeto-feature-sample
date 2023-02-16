import { Collider, Vector3, Quaternion, GameObject } from 'UnityEngine';
import { SpawnInfo, ZepetoCharacter, ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';

export default class Teleport extends ZepetoScriptBehaviour {

    private zepetoCharacter: ZepetoCharacter;

    // Destination Object
    public destinationObject : GameObject;

    Start() {
        // Zepeto character object
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
    }

    OnTriggerEnter(collider: Collider) {
        if (this.zepetoCharacter == null || collider.gameObject != this.zepetoCharacter.gameObject) {
            return;
        }

        // Teleport to Origin Position
        this.zepetoCharacter.Teleport(this.destinationObject.transform.position, Quaternion.identity);
    }
}