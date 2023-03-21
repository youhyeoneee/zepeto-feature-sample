import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import { Collider, Vector3, Quaternion, GameObject } from 'UnityEngine';
import {ZepetoPlayers} from "ZEPETO.Character.Controller";
import MultiplayManager from '../Common/MultiplayManager';

export default class InstantiateObject extends ZepetoScriptBehaviour {
    @SerializeField() private _prefab: GameObject;

    private OnTriggerEnter(coll: Collider) {
        
        console.log(">> Trigger")
        if(coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>()){
            return;
        }
        MultiplayManager.instance.Instantiate(this._prefab.name, MultiplayManager.instance?.room.SessionId, Vector3.zero, Quaternion.identity);
    }
}