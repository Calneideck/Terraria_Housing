import React, { FC } from 'react';
import { INPC, NPCs } from './Model';

interface IInfoBoxProps {
  npc?: INPC;
}

export const InfoBox: FC<IInfoBoxProps> = (props) => {
  return (
    <div className='info-box'>
      {props.npc && <>
        <div className='header'>
          <h4>{props.npc.name}</h4>
          <img src={props.npc.sprite} alt={props.npc.name} />
        </div>

        {props.npc.biomeLove && <div>
          <p>Biome Loves: </p>
          <p>{props.npc.biomeLove}</p>
        </div>}
        {props.npc.biomeLike && <div>
          <p>Biome Likes: </p>
          <p>{props.npc.biomeLike}</p>
        </div>}
        {props.npc.biomeDislike && <div>
          <p>Biome Dislikes: </p>
          <p>{props.npc.biomeDislike}</p>
        </div>}
        {props.npc.biomeHate && <div>
          <p>Biome Hates: </p>
          <p>{props.npc.biomeHate}</p>
        </div>}

        <table>
          <tbody>
            <tr>
              <th>Loves</th>
              <td>{props.npc.npcLove.map(n => <img key={n} src={NPCs.find(npc => npc.name === n)?.sprite} alt={n} />)}</td>
              <th>Likes</th>
              <td>{props.npc.npcLike.map(n => <img key={n} src={NPCs.find(npc => npc.name === n)?.sprite} alt={n} />)}</td>
            </tr>
            <tr>
              <th>Dislikes</th>
              <td>{props.npc.npcDislike.map(n => <img key={n} src={NPCs.find(npc => npc.name === n)?.sprite} alt={n} />)}</td>
              <th>Hates</th>
              <td>{props.npc.npcHate.map(n => <img key={n} src={NPCs.find(npc => npc.name === n)?.sprite} alt={n} />)}</td>
            </tr>
          </tbody>
        </table>
      </>}
    </div>
  )
};