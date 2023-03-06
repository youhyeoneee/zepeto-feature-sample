import { GameObject, HumanBodyBones, Object } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Button } from 'UnityEngine.UI';
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';

import InteractionIcon from './InteractionIcon';

export default class NPCDialog extends ZepetoScriptBehaviour {

    public npcDialogCanvas: GameObject;
    public rightHandItemPrefab: GameObject;
    public yesButton: Button;
    public noButton: Button;

    private _interactionIcon:  InteractionIcon;
    private _localCharacter: ZepetoCharacter;
    private _rightHandItemObject: GameObject;

    Start() {
        
        this._interactionIcon = this.transform.GetComponent<InteractionIcon>();
        
        if (this._interactionIcon != null) {
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(()=>{
                this._localCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            });

            // NPC Interaction
            this._interactionIcon.OnClickEvent.AddListener(()=> {
                this._interactionIcon.HideIcon();
                this.DoInteraction();
            });
        } else {
            console.error("InteractionIcon not found on " + this.transform.name);
        }

        // Dialog - Select Yes
        this.yesButton.onClick.AddListener(() => {
            this.npcDialogCanvas.SetActive(false);
            const animator = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.ZepetoAnimator;
            const hand = animator.GetBoneTransform(HumanBodyBones.RightHand);

            this._rightHandItemObject = Object.Instantiate(this.rightHandItemPrefab, hand) as GameObject;
        });

        // Dialog - Select No
        this.noButton.onClick.AddListener(() => {
            this.npcDialogCanvas.SetActive(false);
        });

    }

    private DoInteraction() {
        this.npcDialogCanvas.SetActive(true);
    }

}