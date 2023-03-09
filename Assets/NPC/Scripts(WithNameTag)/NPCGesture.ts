import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { KnowSockets, SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator } from 'ZEPETO.Character.Controller';
import { Vector3, AnimationClip, Animator, RuntimeAnimatorController, Object, GameObject, RectTransform, Canvas, Camera } from 'UnityEngine';
import { LayoutRebuilder, Text } from 'UnityEngine.UI';

export default class NPCGesture extends ZepetoScriptBehaviour {

    // ZEPETO ID of the NPC
    public zepetoId: string;
    // name to be displayed in the name tag 
    public nameTag: string;
    // Prefab of the name tag canvas game object
    public nameTagPrefab: GameObject;
    // y-axis offset value of the name tag canvas game object
    public nameTagYOffset: number;
    // The Animator Controller of the NPC
    public npcAnimator: RuntimeAnimatorController;

    // NPC character object
    private _npc: ZepetoCharacter;
    // name tag canvas game object
    private _npcNameTagObject: GameObject;
    // Text inside the name tag canvas game object
    private _npcNameTagText: Text;
    private _canvas: Canvas;
    private _cachedWorldCamera: Camera;

    Start() {

        // Create a new instance of SpawnInfo and set its position and rotation based on the object's transform
        const spawnInfo = new SpawnInfo();
        spawnInfo.position = this.transform.position;
        spawnInfo.rotation = this.transform.rotation;

        // Use ZepetoCharacterCreator to create a new character by ZEPETO ID and assign it to _npc variable
        ZepetoCharacterCreator.CreateByZepetoId(this.zepetoId, spawnInfo, (character: ZepetoCharacter) => {
            this._npc = character;

            // Set the name tag
            this.SetNameTag();
            
            // Get the Animator component from the NPC character and set its runtimeAnimatorController to npcAnimator
            this._npc.GetComponentInChildren<Animator>().runtimeAnimatorController = this.npcAnimator;
        });
    }

    // Set the name tag
    SetNameTag() {
        // Dynamically create the name tag canvas game object
        this._npcNameTagObject = Object.Instantiate(this.nameTagPrefab) as GameObject;

        // Set the position of the name tag canvas game object above the NPC's head
        this._npcNameTagObject.transform.position = Vector3.op_Addition(this._npc.GetSocket(KnowSockets.HEAD_UPPER).position, new Vector3(0, this.nameTagYOffset,0));

        // Set the text inside the name tag
        this._npcNameTagText = this._npcNameTagObject.GetComponentInChildren<Text>();
        LayoutRebuilder.ForceRebuildLayoutImmediate(this._npcNameTagObject.GetComponent<RectTransform>());
        this._npcNameTagText.text = this.nameTag;

        this._canvas = this._npcNameTagObject.GetComponent<Canvas>();
        this._cachedWorldCamera = Object.FindObjectOfType<Camera>();
        this._canvas.worldCamera = this._cachedWorldCamera;
    }

    private Update() {
        if (this._canvas != null) {
            this.UpdateCanvasRotation();
        }
    }

    // Update the rotation of the name tag canvas to face the camera
    private UpdateCanvasRotation() {
        this._canvas.transform.LookAt(this._cachedWorldCamera.transform);
        this._canvas.transform.Rotate(0, 180, 0);
    }
}