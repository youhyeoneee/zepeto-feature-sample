import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { KnowSockets, SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Canvas, Camera, Vector3, AnimationClip, Object, GameObject, RectTransform, Animator, RuntimeAnimatorController, Collider } from 'UnityEngine';
import { LayoutRebuilder, Text } from 'UnityEngine.UI';

export default class NPCInteraction extends ZepetoScriptBehaviour {

    // ZEPETO ID of the NPC
    public zepetoId: string;
    // name to be displayed in the name tag 
    public nameTag: string;
    // Prefab of the name tag canvas game object
    public nameTagPrefab: GameObject;
    // y-axis offset value of the name tag canvas game object
    public nameTagYOffset: number;

    // Dialogue content to be displayed in the speech bubble
    public speechBubbleText: string;
    public changedSpeechBubbleText: string;
    // Prefab of the speech bubble canvas game object
    public speechBubblePrefab: GameObject;
    // y-axis offset value of the speech bubble canvas game object
    public speechBubbleYOffset: number;

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
    private _speechBubbleCanvas: Canvas;

    // Speech bubble canvas game object
    private _speechBubbleObject: GameObject;
    // Text inside the speech bubble canvas game object
    private _speechBubbleText: Text;

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

            // Set the speech bubble 
            this.SetBubble();
        })

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this._zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
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
        
        console.log(">>>>");
        LayoutRebuilder.ForceRebuildLayoutImmediate(this._speechBubbleText.GetComponent<RectTransform>());
        this.SetBubbleText(this.changedSpeechBubbleText);
    }

    OnTriggerExit(collider: Collider) {
        if (this._zepetoCharacter == null || collider.gameObject != this._zepetoCharacter.gameObject) {
            return;
        }
        LayoutRebuilder.ForceRebuildLayoutImmediate(this._speechBubbleText.GetComponent<RectTransform>());
        this.SetBubbleText(this.speechBubbleText);
    }
    
    // Set the speech bubble 
    SetBubble() {
        // Dynamically create the speech bubble canvas game object
        this._speechBubbleObject = Object.Instantiate(this.speechBubblePrefab) as GameObject;

        // Set the position of the speech bubble canvas game object above the NPC's head
        this._speechBubbleObject.transform.position = Vector3.op_Addition(this._npc.GetSocket(KnowSockets.HEAD_UPPER).position, new Vector3(0, this.speechBubbleYOffset,0));

        // Set the text inside the speech bubble 
        this._speechBubbleText = this._speechBubbleObject.GetComponentInChildren<Text>();
        LayoutRebuilder.ForceRebuildLayoutImmediate(this._speechBubbleText.GetComponent<RectTransform>());
        this.SetBubbleText(this.speechBubbleText);

        this._speechBubbleCanvas = this._speechBubbleObject.GetComponent<Canvas>();
        this._speechBubbleCanvas.worldCamera = this._cachedWorldCamera;
    }

    // Open the speech bubble canvas and set the text
    SetBubbleText(bubbleText: string) {
        this._speechBubbleObject.SetActive(true);
        this._speechBubbleText.text = bubbleText;
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

        // Update the rotation of the speech bubble canvas to face the camera
        this._speechBubbleCanvas.transform.LookAt(this._cachedWorldCamera.transform);
        this._speechBubbleCanvas.transform.Rotate(0, 180, 0);
    }
}