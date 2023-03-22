import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Collider, Vector3, Quaternion, GameObject, Object } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import MultiplayManager from '../Common/MultiplayManager';

export default class InstantiateObject extends ZepetoScriptBehaviour {
    
    @SerializeField() private _prefab: GameObject;
    
    private _isFirst: bool = true;
    
    private OnTriggerEnter(coll: Collider) {
        
        if (coll != ZepetoPlayers.instance.LocalPlayer?.zepetoPlayer?.character.GetComponent<Collider>()){
            return;
        }

        if (this._isFirst) {
            MultiplayManager.instance.Instantiate(this._prefab.name, MultiplayManager.instance?.room.SessionId, Vector3.zero, Quaternion.identity);
            this._isFirst = false;
        }
    }
}