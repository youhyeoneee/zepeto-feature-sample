import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator } from 'ZEPETO.Character.Controller';
import { Vector3, AnimationClip, Animator, RuntimeAnimatorController } from 'UnityEngine';

export default class NPCActionController extends ZepetoScriptBehaviour {

    // The ZEPETO ID of the NPC
    public zepetoId: string;
    // The Animator Controller of the NPC
    public npcAnimator: RuntimeAnimatorController;

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

            // Get the Animator component from the NPC character and set its runtimeAnimatorController to npcAnimator
            this._npc.GetComponentInChildren<Animator>().runtimeAnimatorController = this.npcAnimator;
        });
    }
    
}