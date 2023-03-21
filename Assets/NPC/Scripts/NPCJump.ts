import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator } from 'ZEPETO.Character.Controller';
import { WaitForSeconds } from 'UnityEngine';

export default class NPCJump extends ZepetoScriptBehaviour {

    // ZEPETO ID of the NPC
    public zepetoId: string;
    // NPC character object
    private _npc: ZepetoCharacter;

    Start() {
        // Create a new instance of SpawnInfo and set its position and rotation based on the object's transform
        const spawnInfo = new SpawnInfo();
        spawnInfo.position = this.transform.position;
        spawnInfo.rotation = this.transform.rotation;

        // Use ZepetoCharacterCreator to create a new character by ZEPETO ID and assign it to _npc variable
        ZepetoCharacterCreator.CreateByZepetoId(this.zepetoId, spawnInfo, (character: ZepetoCharacter) => {
            this._npc = character;
            
            this.StartCoroutine(this.JumpCoroutine());
        });
    }

    *JumpCoroutine() {
        // Infinite loop to continuously
        while (true) {
            // Call the Jump() method of the ZepetoCharacter to make it jump
            this._npc.Jump();

            // Wait for 5 seconds 
            yield new WaitForSeconds(5);
        }
    }
}