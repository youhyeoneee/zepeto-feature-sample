import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {
    ZepetoPlayer,
    ZepetoPlayers
} from "ZEPETO.Character.Controller";
import { ZepetoWorldMultiplay } from "ZEPETO.World";
import { Room } from "ZEPETO.Multiplay";
import {
    Collider,
    HumanBodyBones,
    Object,
    Rigidbody,
    Vector3,
    WaitUntil
} from "UnityEngine";

import MultiplayManager from "../ZepetoScripts/MultiplaySync/Common/MultiplayManager"
import TransformSyncHelper from '../ZepetoScripts/MultiplaySync/Transform/TransformSyncHelper';
import PlayerSync from '../ZepetoScripts/MultiplaySync/Player/PlayerSync';

export default class Pillow extends ZepetoScriptBehaviour {
   
    // The bone to attach the object to.
    private m_tfHelper: TransformSyncHelper;
    private multiplay: ZepetoWorldMultiplay;
    private room: Room;
    public isHaveParent : bool = false;
    
    Start() {
        this.m_tfHelper = this.GetComponent<TransformSyncHelper>();
        this.multiplay = Object.FindObjectOfType<ZepetoWorldMultiplay>();
        
        this.multiplay.RoomJoined += (room: Room) => {
            this.room= room;
            this.room.AddMessageHandler("ChangeOwner"+this.m_tfHelper.Id, (OwnerSessionId) => {
                this.m_tfHelper.ChangeOwner(OwnerSessionId.toString());
                console.log("Set Onwer", OwnerSessionId.toString());
            });
        }
    }

    *SetParent(){
   
    }
}