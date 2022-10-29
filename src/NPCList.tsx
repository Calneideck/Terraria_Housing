import React, { FC, CSSProperties } from 'react'
import { NPCs, INPC, BiomeState, findNPCInBiome, NPCName } from './Model';
import { MousePos } from './App';

const activeNPCStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 1,
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none'
};

interface INPCListProps {
  biomeState: BiomeState;
  activeNPC?: NPCName;
  mousePos?: MousePos;
  setActiveNPC: (npc: NPCName) => void;
  setInfoNPC: (npc: INPC) => void;
  setTouchPos: (pos: MousePos) => void;
}

export const NPCList: FC<INPCListProps> = (props) => {
  const setActive = (npc: INPC, e: React.MouseEvent | React.TouchEvent) => {
    props.setActiveNPC(npc.name);
    props.setInfoNPC(npc);

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
    <div className='npcs'>
      {NPCs
        .filter(n => findNPCInBiome(n.name, props.biomeState) === null || props.activeNPC === n.name)
        .map(n =>
          <img
            key={n.name}
            className='npc'
            alt={n.name}
            src={n.sprite}
            onMouseDown={(e) => setActive(n, e)}
            onTouchStart={(e) => setActive(n, e)}
            style={props.activeNPC === n.name ? {
              ...activeNPCStyle,
              left: `${props.mousePos?.x}px`,
              top: `${props.mousePos?.y}px`,
            } : {}}
          />
      )}
    </div>
  )
}
