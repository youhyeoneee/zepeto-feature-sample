import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { KnowSockets, SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator } from 'ZEPETO.Character.Controller';
import { Canvas, Camera, Vector3, AnimationClip, Object, GameObject, RectTransform, Animator, RuntimeAnimatorController } from 'UnityEngine';
import { LayoutRebuilder, Text } from 'UnityEngine.UI';

export default class NPC extends ZepetoScriptBehaviour {

    // ZEPETO ID of the NPC
    public zepetoId: string;
    // name to be displayed in the name tag 
    public nameTag: string;
    // Prefab of the name tag canvas game object
    public nameTagPrefab: GameObject;
    // y-axis offset value of the name tag canvas game object
    public nameTagYOffset: number;

    // NPC character object
    private _npc: ZepetoCharacter;
    // Speech bubble canvas game object
    private _npcNameTagObject: GameObject;
    // Text inside the speech bubble canvas game object
    private _npcNameTagText: Text;

    Start() {
        // Create a new instance of SpawnInfo and set its position and rotation based on the object's transform
        const spawnInfo = new SpawnInfo();
        spawnInfo.position = this.transform.position;
        spawnInfo.rotation = this.transform.rotation;

        // Use ZepetoCharacterCreator to create a new character by ZEPETO ID and assign it to _npc variable
        ZepetoCharacterCreator.CreateByZepetoId(this.zepetoId, spawnInfo, (character: ZepetoCharacter) => {
            this._npc = character;
            
            // Set the speech bubble 
            this.SetNameTag();
        })
    }

    // Set the speech bubble 
    SetNameTag() {
        // Dynamically create the speech bubble canvas game object
        this._npcNameTagObject = Object.Instantiate(this.nameTagPrefab) as GameObject;

        // Set the position of the speech bubble canvas game object above the NPC's head
        this._npcNameTagObject.transform.position = Vector3.op_Addition(this._npc.GetSocket(KnowSockets.HEAD_UPPER).position, new Vector3(0, this.nameTagYOffset,0));

        // Set the text inside the speech bubble 
        this._npcNameTagText = this._npcNameTagObject.GetComponentInChildren<Text>();
        LayoutRebuilder.ForceRebuildLayoutImmediate(this._npcNameTagObject.GetComponent<RectTransform>());
        this._npcNameTagText.text = this.nameTag;
    }
    

}