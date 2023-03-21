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
    Quaternion,
    Transform,
    Vector3,
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

    Start() {
        this.multiplay = Object.FindObjectOfType<ZepetoWorldMultiplay>();

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            // Find the local player and set it to _localCharacter.
            this._localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            this.SendItem();
        });

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
                
                // this.StartCoroutine(this.CreateItem(attachItemInfo))
            });
        };
    }
    
    // *CreateItem(attachItemInfo: AttachItemInfo) {
    //     yield new WaitUntil(()=>ZepetoPlayers.instance.HasPlayer(attachItemInfo.sessionId));
    //     const player = ZepetoPlayers.instance.GetPlayer(attachItemInfo.sessionId).character;
    //     // const bone: Transform = player.ZepetoAnimator.GetBoneTransform(HumanBodyBones[attachItemInfo.bone]);
    //    
    //     if (player.transform.Find(this.prefItem.name + "(Clone)") == null) {
    //         console.log (">>>>>>> Instantiate")
    //         MultiplayManager.instance.Instantiate(this.prefItem.name, attachItemInfo.sessionId, Vector3.zero, Quaternion.identity);
    //     } else {
    //         console.log (">>>>>>> not Instantiate")
    //     }
    //    
    //     console.log(">> ", player.transform.Find(this.prefItem.name + "(Clone)"))
    // }
    // 1.만들어라
    SendItem() {
        MultiplayManager.instance.Instantiate(this.prefItem.name, this._room.SessionId, Vector3.zero, Quaternion.identity);

        const data = new RoomData();
        data.Add("itemName", this.prefItem.name);
        data.Add("bone", this.bodyBone);
        this._room.Send("OnAttachItem", data.GetObject());
    }
    
}
