import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from "ZEPETO.World";
import {
    Animator,
    GameObject,
    HumanBodyBones,
    Object,
    Transform,
    WaitUntil
} from "UnityEngine";
import {
    ZepetoCharacter,
    ZepetoPlayers
} from "ZEPETO.Character.Controller";
import {
    Room,
    RoomData
} from "ZEPETO.Multiplay";

import MultiplayManager from "../ZepetoScripts/MultiplaySync/Common/MultiplayManager"
import TransformSyncHelper from '../ZepetoScripts/MultiplaySync/Transform/TransformSyncHelper';
import Pillow from './Pillow';

interface AttachItemInfo {
    sessionId: string,
    itemName: string,
    bone: number,
}


export default class AttachMulti2 extends ZepetoScriptBehaviour {

    public multiplay: ZepetoWorldMultiplay;
    public bodyBone: HumanBodyBones = HumanBodyBones.Neck;
    public prefItem: GameObject;

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
            // 2. 서버 -> ㅇㅋㅇㅋ
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
        
    }


    // 1. 만들어라 -> 서버
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