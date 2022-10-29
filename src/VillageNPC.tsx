import React, { FC } from 'react'
import { INPC, NPCName } from './Model';
import { MousePos } from './App';

interface IVillageNPCProps {
  npc: INPC;
  activeNPC: Boolean;
  happiness: number;
  setActiveNPC: (name: NPCName) => void;
  setInfoNPC: (npc: INPC) => void;
  setHoverVillage: () => void;
  setTouchPos: (pos: MousePos) => void;
}

export const VillageNPC: FC<IVillageNPCProps> = (props) => {

  const setActive = (e: React.MouseEvent | React.TouchEvent) => {
    props.setActiveNPC(props.npc.name);
    props.setInfoNPC(props.npc);
    props.setHoverVillage();

    const touchEvent = e as React.TouchEvent
    if (touchEvent.touches) {
      props.setTouchPos({
        x: touchEvent.touches[0].clientX,
        y: touchEvent.touches[0].clientY,
      });
    } else {
      e.preventDefault();
    }
  }

  return (
    <div
      key={props.npc.name}
      style={props.activeNPC ? { pointerEvents: 'none' } : undefined}
    >
      <img
        className='npc'
        alt={props.npc.name}
        src={props.npc.sprite}
        onMouseDown={(e) => setActive(e)}
        onTouchStart={(e) => setActive(e)}
      />
      <p>{Math.round(props.happiness * 100)}%</p>
    </div>
  )
}
