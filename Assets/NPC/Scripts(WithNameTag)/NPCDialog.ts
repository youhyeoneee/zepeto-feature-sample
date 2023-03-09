import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoWorldHelper } from 'ZEPETO.World';
import {
    Texture,
    Texture2D,
    Sprite,
    Rect,
    Vector2,
    GameObject,
    Canvas,
    Camera,
    Object,
    Vector3,
    RectTransform, Collider, AnimationClip, WaitForSeconds
} from 'UnityEngine';
import {Image, LayoutRebuilder, Text} from 'UnityEngine.UI';
import {
    KnowSockets,
    SpawnInfo,
    ZepetoCharacter,
    ZepetoCharacterCreator,
    ZepetoPlayers, ZepetoScreenTouchpad
} from "ZEPETO.Character.Controller";

export default class NPCDialog extends ZepetoScriptBehaviour {

    public dialog: GameObject;

    // ZEPETO ID of the NPC
    public zepetoId: string;
    // name to be displayed in the name tag 
    public nameTag: string;
    // Prefab of the name tag canvas game object
    public nameTagPrefab: GameObject;
    // y-axis offset value of the name tag canvas game object
    public nameTagYOffset: number;
    
    public sleepAnimation: AnimationClip;
    public helloAnimation: AnimationClip;
    
    // Local character object
    private _zepetoCharacter: ZepetoCharacter;
    // NPC character object
    private _npc: ZepetoCharacter;
    // name tag canvas game object
    private _npcNameTagObject: GameObject;
    // Text inside the name tag canvas game object
    private _npcNameTagText: Text;
    private _canvas: Canvas;
    private _cachedWorldCamera: Camera;

    private _touchpad: GameObject;
    
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
            
            this.StartCoroutine(this.SleepGestureCorutine());
        })

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this._zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            // If click the touchpad, cancel the gesture
            // this._touchpad = Object.FindObjectOfType<ZepetoScreenTouchpad>().gameObject;
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

    // Check if Player character enter collider
    OnTriggerEnter(collider: Collider) {
        if (this._zepetoCharacter == null || collider.gameObject != this._zepetoCharacter.gameObject) {
            return;
        }

        this.StartCoroutine(this.HelloGestureCorutine());
        // this._touchpad.SetActive(false);
        this.dialog.SetActive(true);
    }

    OnTriggerExit(collider: Collider) {
        if (this._zepetoCharacter == null || collider.gameObject != this._zepetoCharacter.gameObject) {
            return;
        }

        this.StartCoroutine(this.SleepGestureCorutine());
        // this._touchpad.SetActive(true);
        this.dialog.SetActive(false);
    }
    
    private Update() {
        if (this._canvas != null) {
            this.UpdateCanvasRotation();
        }
    }

    private UpdateCanvasRotation() {
        // Update the rotation of the name tag canvas to face the camera
        this._canvas.transform.LookAt(this._cachedWorldCamera.transform);
        this._canvas.transform.Rotate(0, 180, 0);

    }
    
    *SleepGestureCorutine(){
        this._npc.SetGesture(this.sleepAnimation);
    }

    *HelloGestureCorutine(){
        this._npc.SetGesture(this.helloAnimation);
    }
}