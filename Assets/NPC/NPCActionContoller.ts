import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator } from 'ZEPETO.Character.Controller';
import { Vector3, AnimationClip, WaitForSeconds } from 'UnityEngine';

import NPCCreator from './NPCCreatorWithNameTag';
export default class NPCActionContoller extends ZepetoScriptBehaviour {

    // ZEPETO ID of the NPC
    public zepetoId: string;
    // The animation clip that will be played by the NPC
    public gesture: AnimationClip;
    public isGestureEnabled: bool = true;

    // NPC character object
    private _npc: ZepetoCharacter;

    Start() {
        // Create a new instance of SpawnInfo and set its position and rotation based on the object's transform
        const spawnInfo = new SpawnInfo();
        spawnInfo.position = this.transform.position;
        spawnInfo.rotation = this.transform.rotation;

        // Use ZepetoCharacterCreator to create a new character by Zepeto ID and assign it to _npc variable
        ZepetoCharacterCreator.CreateByZepetoId(this.zepetoId, spawnInfo, (character: ZepetoCharacter) => {
            this._npc = character;
            // Call the GestureCoroutine method to start the NPC's gesture
            this.StartCoroutine(this.GestureCoroutine());
        })
    }

    *GestureCoroutine() {
        // Infinite loop to continuously check if the isGestureEnabled flag is true
        while (true) {
            if (this.isGestureEnabled) {
                // Set the gesture of the NPC to the specified animation clip
                this._npc.SetGesture(this.gesture);
            } else {
                // Cancel the gesture if the isGestureEnabled flag is false
                this._npc.CancelGesture();
            }
            // Wait for 10 seconds before checking the isGestureEnabled flag again
            yield new WaitForSeconds(10);
        }
    }
}
