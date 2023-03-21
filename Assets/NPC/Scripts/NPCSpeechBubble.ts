import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { KnowSockets, SpawnInfo, ZepetoCharacter, ZepetoCharacterCreator } from 'ZEPETO.Character.Controller';
import { Canvas, Camera, Vector3, Object, GameObject } from 'UnityEngine';
import { Text } from 'UnityEngine.UI';

export default class NPCSpeechBubble extends ZepetoScriptBehaviour {

    // ZEPETO ID of the NPC
    public zepetoId: string;
    // Dialogue content to be displayed in the speech bubble
    public speechBubbleText: string;
    // Prefab of the speech bubble canvas game object
    public speechBubblePrefab: GameObject;
    // Y-axis offset value of the speech bubble canvas game object
    public speechBubbleYOffset: number;

    // NPC character object
    private _npc: ZepetoCharacter;
    // Speech bubble canvas game object
    private _speechBubbleObject: GameObject;
    // Text inside the speech bubble canvas game object
    private _speechBubbleText: Text;
    // Speech bubble canvas
    private _canvas: Canvas;
    // World Camera
    private _cachedWorldCamera: Camera;
    
    Start() {
        // Create a new instance of SpawnInfo and set its position and rotation based on the object's transform
        const spawnInfo = new SpawnInfo();
        spawnInfo.position = this.transform.position;
        spawnInfo.rotation = this.transform.rotation;

        // Use ZepetoCharacterCreator to create a new character by ZEPETO ID and assign it to _npc variable
        ZepetoCharacterCreator.CreateByZepetoId(this.zepetoId, spawnInfo, (character: ZepetoCharacter) => {
            this._npc = character;
            
            // Set the speech bubble
            this.SetBubble();
        })
    }

    // Set the speech bubble
    SetBubble() {
        // Dynamically create the speech bubble canvas game object
        this._speechBubbleObject = Object.Instantiate(this.speechBubblePrefab) as GameObject;

        // Set the parent of the  speech bubble canvas game object transform to be the NPC transform.
        this._speechBubbleObject.transform.SetParent(this._npc.transform);
        
        // Set the position of the speech bubble canvas game object above the NPC's head
        this._speechBubbleObject.transform.position = Vector3.op_Addition(this._npc.GetSocket(KnowSockets.HEAD_UPPER).position, new Vector3(0, this.speechBubbleYOffset,0));

        // Set the text inside the speech bubble
        this._speechBubbleText = this._speechBubbleObject.GetComponentInChildren<Text>();
        this.SetBubbleText(this.speechBubbleText);

        this._canvas = this._speechBubbleObject.GetComponent<Canvas>();
        this._cachedWorldCamera = Object.FindObjectOfType<Camera>();
        this._canvas.worldCamera = this._cachedWorldCamera;
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

    // Update the rotation of the speech bubble canvas to face the camera
    private UpdateCanvasRotation() {
        this._canvas.transform.LookAt(this._cachedWorldCamera.transform);
        this._canvas.transform.Rotate(0, 180, 0);
    }

}