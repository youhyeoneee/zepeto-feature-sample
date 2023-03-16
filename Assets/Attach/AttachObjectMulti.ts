import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import {
    ZepetoCharacter,
    ZepetoPlayers
} from 'ZEPETO.Character.Controller';
import {
    Animator,
    GameObject,
    HumanBodyBones,
    Object,
    Transform,
    WaitUntil
} from 'UnityEngine';
import {
    Room,
    RoomData
} from 'ZEPETO.Multiplay';
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import MultiplayManager from "../ZepetoScripts/MultiplaySync/Common/MultiplayManager"
import TransformSyncHelper from '../ZepetoScripts/MultiplaySync/Transform/TransformSyncHelper';
import Pillow from './Pillow';

interface AttachItemInfo {
    sessionId: string,
    itemName: string,
    bone: number,
}


export default class AttachObject extends ZepetoScriptBehaviour {

    public multiplay: ZepetoWorldMultiplay;

    // The object prefab to be attached on the body.
    public prefItem: GameObject;
    public bodyBone: HumanBodyBones = HumanBodyBones.Neck;
    
    private _localCharacter: ZepetoCharacter;
    private _room: Room;
    private m_tfHelper: TransformSyncHelper;
    private isLocalCharacterOnAttach: boolean = false;

    Start() {
        this.multiplay = Object.FindObjectOfType<ZepetoWorldMultiplay>();

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            // Find the local player and set it to _localCharacter.
            this._localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            this.SendItem();
        });

        // When a new player comes in, send the player information about the currently up blocks.
        // ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {
        // });

        // For MultiPlay
        this.multiplay.RoomCreated += (room: Room) => {
            this._room = room;
            // Receive user's gesture information from the server
            this._room.AddMessageHandler("OnAttachItem", (message: AttachItemInfo) => {
                let attachItemInfo: AttachItemInfo = {
                    sessionId: message.sessionId,
                    itemName: message.itemName,
                    bone: message.bone
                };

                console.log(">>", attachItemInfo.sessionId, attachItemInfo.itemName, attachItemInfo.bone);
                this.StartCoroutine(this.CreateObject(attachItemInfo));
            });
        };
    }
    
    *CreateObject(info: AttachItemInfo) {
        yield new WaitUntil(()=>ZepetoPlayers.instance.HasPlayer(info.sessionId));
        const player = ZepetoPlayers.instance.GetPlayer(info.sessionId).character;
        
        const pillow = GameObject.FindObjectOfType<Pillow>();
        this.m_tfHelper = pillow.GetComponent<TransformSyncHelper>();
        console.log(pillow);
        console.log(this.m_tfHelper);
        if(!this.m_tfHelper?.isOwner) {
            this.multiplay.Room.Send("ChangeOwner", this.m_tfHelper.Id);
        }
        
        if (player.GetComponentInChildren<Pillow>() == null) {
            // Get the _localCharacter's animator component.
            const animator: Animator = player.ZepetoAnimator;
            // Get the position of the bone to attach the object to.
            // const bone: HumanBodyBones = this.prefItem.GetComponent<Pillow>().bodyBone;
            const boneTransform: Transform = animator.GetBoneTransform(this.bodyBone);

            // Create the object prefab.
        }

    }
    

    
    // 1.만들어라
    SendItem() {
        // Get the _localCharacter's animator component.
        const animator: Animator = this._localCharacter.ZepetoAnimator;
        // Get the position of the bone to attach the object to.
        const boneTransform: Transform = animator.GetBoneTransform(this.bodyBone);

        // Create the object prefab.
        MultiplayManager.instance.Instantiate(this.prefItem.name, this._room.SessionId, boneTransform.position, this.prefItem.transform.rotation);

        const data = new RoomData();
        data.Add("itemName", this.prefItem.name);
        data.Add("bone", this.bodyBone);
        this._room.Send("OnAttachItem", data.GetObject());
    }
    
}
