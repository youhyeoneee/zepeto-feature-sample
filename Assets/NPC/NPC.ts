import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import {
    KnowSockets,
    SpawnInfo,
    ZepetoCharacter,
    ZepetoCharacterCreator,
    ZepetoPlayers
} from 'ZEPETO.Character.Controller';
import {
    Canvas,
    Camera,
    Vector3,
    AnimationClip,
    Object,
    GameObject,
    RectTransform,
    Animator,
    Collider,
    RuntimeAnimatorController
} from 'UnityEngine';
import { LayoutRebuilder, Text } from 'UnityEngine.UI';

export default class NPC extends ZepetoScriptBehaviour {

    // ZEPETO ID of the NPC
    public zepetoId: string;

    public npcAnimator: RuntimeAnimatorController;
    
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
    // Speech bubble canvas game object
    private _speechBubbleObject: GameObject;
    // Text inside the speech bubble canvas game object
    private _speechBubbleText: Text;

    Start() {
        // Set the spawn position for the NPC
        const spawnInfo = new SpawnInfo();
        spawnInfo.position = this.transform.position;
        spawnInfo.rotation = this.transform.rotation;

        // Create the NPC
        ZepetoCharacterCreator.CreateByZepetoId(this.zepetoId, spawnInfo, (character: ZepetoCharacter) => {
            this._npc = character;
            
            this.SetBubble();
            this._npc.GetComponentInChildren<Animator>().runtimeAnimatorController = this.npcAnimator;
        })

        // Zepeto character object
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this._zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
    }
    
    //Check if Player character enter collider 
    OnTriggerEnter(collider: Collider) {
        if (this._zepetoCharacter == null || collider.gameObject != this._zepetoCharacter.gameObject) {
            return;
        }
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
    }

    // Open the speech bubble canvas and set the text
    SetBubbleText(bubbleText: string) {
        this._speechBubbleObject.SetActive(true);
        this._speechBubbleText.text = bubbleText;
    }
    
}