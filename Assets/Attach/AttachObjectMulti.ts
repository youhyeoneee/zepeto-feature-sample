import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Transform, Animator, GameObject, HumanBodyBones, Object } from 'UnityEngine';

export default class AttachObject extends ZepetoScriptBehaviour {

    // The object prefab to be attached on the body.
    public prefItem: GameObject;
    // The bone to attach the object to.
    public bodyBone: HumanBodyBones;

    private _localCharacter: ZepetoCharacter;

    Start() {

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            // Find the local player and set it to _localCharacter.
            this._localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            // Get the _localCharacter's animator component.
            const animator: Animator = this._localCharacter.ZepetoAnimator;
            // Get the position of the bone to attach the object to.
            const bone: Transform = animator.GetBoneTransform(this.bodyBone);
            // Create the object prefab.
            Object.Instantiate(this.prefItem, bone) as GameObject;
        });
    }
}
