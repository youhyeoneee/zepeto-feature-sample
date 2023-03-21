import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {
    WaitUntil,
    HumanBodyBones,
    Vector3,
    Quaternion,
    Object, GameObject
} from "UnityEngine";
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import TransformSyncHelper from '../Transform/TransformSyncHelper';
import { ZepetoWorldMultiplay } from "ZEPETO.World";
import { Room } from "ZEPETO.Multiplay";
import MultiplayManager from '../Common/MultiplayManager';

export default class PackingObject extends ZepetoScriptBehaviour {
    // This is a script that makes the ZEPETO player move together by setting the object as a child object.
    // For example, holding a gun, holding a balloon,
    @SerializeField() private targetBone: HumanBodyBones;
    @SerializeField() private localPosition: Vector3 = Vector3.zero;
    @SerializeField() private localRotation: Vector3 = Vector3.zero;
    @SerializeField() private ownerSessiondId: string;
    
    private _tfHelper: TransformSyncHelper;
    private _multiplay: ZepetoWorldMultiplay;

    Start() {
        this._multiplay = Object.FindObjectOfType<ZepetoWorldMultiplay>();
        this._tfHelper = this.transform.GetComponent<TransformSyncHelper>();
        this._multiplay.Room.Send("ChangeOwner", this._tfHelper.Id);
        console.log(">> OwnerSessionId", this._tfHelper.OwnerSessionId)
        this.StartCoroutine(this.PackingObject(this._tfHelper.OwnerSessionId));
    }

    private *PackingObject(ownerSessiondId :string){
        yield new WaitUntil(()=>ZepetoPlayers.instance.HasPlayer(ownerSessiondId));
        const player = ZepetoPlayers.instance.GetPlayer(ownerSessiondId).character;
        console.log(">> Paking ?? ", player);
        this.transform.parent = player.ZepetoAnimator.GetBoneTransform(this.targetBone);
        this.transform.localPosition = this.localPosition;
        this.transform.localRotation = Quaternion.Euler(this.localRotation);
        this.ownerSessiondId = ownerSessiondId;
    }

    OnDestroy(){
        console.log(">> IS OWNER ? ", this._tfHelper.isOwner)
        if(this._tfHelper.isOwner){
            console.log(">> DESTROY!!!!!!!!", this._tfHelper.isOwner)
            MultiplayManager.instance.Destroy(this.gameObject);
        }
    }

}