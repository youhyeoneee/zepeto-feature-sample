import {ZepetoScriptBehaviour} from 'ZEPETO.Script';
import {KnowSockets, SpawnInfo, ZepetoCharacter, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import {WorldService} from 'ZEPETO.World';
import {HumanBodyBones} from "UnityEngine";

export default class PlayerSpawner extends ZepetoScriptBehaviour {

    Start() {
        // Get the user id specified from logging into zepeto through the editor. 
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, new SpawnInfo(), true);
    }
}