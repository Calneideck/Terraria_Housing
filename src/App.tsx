import React, { useState, useEffect, CSSProperties, useReducer, useMemo, useCallback } from 'react';
import './App.sass';

import { NPCName, NPCs, BiomeType, Biomes, INPC } from './Stores';
import { InfoBox } from './InfoBox';

interface MousePos {
  x: number;
  y: number;
}

type BiomeState = { [key in BiomeType]: NPCName[][] };

const InitialBiomeState: BiomeState = {
  Forest: [[]],
  Cavern: [[]],
  GlowingMushroom: [[]],
  Desert: [[]],
  Hallow: [[]],
  Jungle: [[]],
  Ocean: [[]],
  Snow: [[]]
};

type FindBiomeType = (npc: NPCName, state: BiomeState) => [BiomeType, number] | null;
const findNPCInBiome: FindBiomeType = (npc: NPCName, state: BiomeState) => {
  for (let [key, value] of Object.entries(state))
    for (let [i, array] of Object.entries(value))
      if (array.find(name => name === npc))
        return [key as BiomeType, Number(i)];

  return null;
}

const activeNPCStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 1,
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none'
};

type SetBiome = { biome: BiomeType, npcs: NPCName[][] };
type SetAll = { biome: 'all', housing: BiomeState };

const biomeReducer = (state: BiomeState, action: SetBiome | SetAll) => {
  switch (action.biome) {
    case 'Forest':
      return { ...state, Forest: action.npcs }

    case 'Cavern':
      return { ...state, Cavern: action.npcs }

    case 'Snow':
      return { ...state, Snow: action.npcs }

    case 'Desert':
      return { ...state, Desert: action.npcs }

    case 'Jungle':
      return { ...state, Jungle: action.npcs }

    case 'Hallow':
      return { ...state, Hallow: action.npcs }

    case 'Ocean':
      return { ...state, Ocean: action.npcs }

    case 'GlowingMushroom':
      return { ...state, GlowingMushroom: action.npcs }

    case 'all':
      return action.housing;

    default:
      return state;
  }
}

const clamp = (val: number, min: number, max: number) => {
  return Math.min(max, Math.max(val, min));
}

const calcHappiness = (npc: NPCName, biomeState: BiomeState) => {
  const biome = findNPCInBiome(npc, biomeState);
  if (!biome)
    return null;

  const NPCData = NPCs.find(n => n.name === npc);
  if (!NPCData)
    return null;

  let biomeMult = 1.0;
  switch (biome[0]) {
    case NPCData.biomeLove:
      biomeMult = 0.9;
      break;

    case NPCData.biomeLike:
      biomeMult = 0.95;
      break;

    case NPCData.biomeDislike:
      biomeMult = 1.05;
      break;

    case NPCData.biomeHate:
      biomeMult = 1.1;
      break;
  }

  const others = biomeState[biome[0]][biome[1]].filter(n => n !== npc);
  let spaceMult = others.length < 2 ? 0.9 : 1;
  if (others.length > 2)
    spaceMult *= Math.pow(1.04, others.length - 1);

  let neighbourMult = 1.0;
  for (let i = 0; i < others.length; i++) {
    if (NPCData.npcLove.find(n => n === others[i]))
      neighbourMult *= 0.9;
    else if (NPCData.npcLike.find(n => n === others[i]))
      neighbourMult *= 0.95;
    else if (NPCData.npcDislike.find(n => n === others[i]))
      neighbourMult *= 1.05;
    else if (NPCData.npcHate.find(n => n === others[i]))
      neighbourMult *= 1.1;
  }

  let happiness = Math.round(clamp(biomeMult * spaceMult * neighbourMult, 0.75, 1.5) * 20) / 20;
  return happiness.toPrecision(3).slice(0, 4);
}

export const App = () => {
  const [activeNPC, setActiveNPC] = useState<NPCName>();
  const [infoNPC, setInfoNPC] = useState<INPC>();
  const [mousePos, setMousePos] = useState<MousePos>();
  const [biomeState, dispatch] = useReducer(biomeReducer, InitialBiomeState);

  useEffect(() => {
    const housingString = localStorage.getItem('housing');
    if (housingString)
      try {
        const housing = JSON.parse(housingString) as BiomeState;
        dispatch({
          biome: 'all',
          housing: housing
        });
      } catch { }

  }, []);

  useEffect(() => {
    if (biomeState !== InitialBiomeState)
      localStorage.setItem('housing', JSON.stringify(biomeState));
  }, [biomeState]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const removeFromBiome = useCallback((biome: BiomeType, npc: NPCName, index: number) => {
    const innerArray = biomeState[biome][index].filter(n => n !== npc);
    const newArray = [...biomeState[biome]];
    newArray[index] = innerArray;

    dispatch({
      biome: biome,
      npcs: newArray
    });
  }, [biomeState, dispatch]);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      if ((e.target as HTMLElement).className === 'biome') {
        if (activeNPC !== undefined) {
          const newBiome = (e.target as HTMLImageElement).alt as BiomeType;
          const prevBiome = findNPCInBiome(activeNPC, biomeState);
          if (activeNPC === 'Truffle' && newBiome !== 'GlowingMushroom') {
            alert('Truffle can only live in Glowing Mushroom');
            e.returnValue = false;
            return;
          }

          if (prevBiome && prevBiome[0] !== newBiome)
            removeFromBiome(prevBiome[0], activeNPC, prevBiome[1]);

          let npcsInBiome = biomeState[newBiome][0];
          if (!npcsInBiome.find(name => name === activeNPC)) {
            const innerArray = [...npcsInBiome, activeNPC];
            const newArray = [...biomeState[newBiome]];
            newArray[0] = innerArray;

            dispatch({
              biome: newBiome,
              npcs: newArray
            });
          }
        }
      } else if (activeNPC !== undefined) {
        // Remove npc from biome
        const prevBiome = findNPCInBiome(activeNPC, biomeState);
        if (prevBiome)
          removeFromBiome(prevBiome[0], activeNPC, prevBiome[1]);
      }

      setActiveNPC(undefined);
    };

    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, [activeNPC, biomeState, removeFromBiome]);

  const happinessValues = useMemo(() => {
    const values: any = {};
    for (let i = 0; i < NPCs.length; i++)
      if (findNPCInBiome(NPCs[i].name, biomeState))
        values[NPCs[i].name] = calcHappiness(NPCs[i].name, biomeState);

    return values;
  }, [biomeState]);

  const onReset = () => {
    dispatch({
      biome: 'all',
      housing: { ...InitialBiomeState }
    });
  }

  return (
    <div>
      <div className='container'>
        <div>
          <div className='top-row'>
            <div>
              <h1>Terraria Housing</h1>
              <div className='npcs'>
                {NPCs.filter(n => findNPCInBiome(n.name, biomeState) === null || activeNPC === n.name).map(n => <img
                  key={n.name}
                  className='npc'
                  alt={n.name}
                  src={n.sprite}
                  onMouseDown={e => {
                    setActiveNPC(n.name);
                    setInfoNPC(n);
                    e.preventDefault();
                  }}
                  style={activeNPC === n.name ? {
                    ...activeNPCStyle,
                    left: `${mousePos?.x}px`,
                    top: `${mousePos?.y}px`,
                  } : {}}
                />)}
              </div>
              <button style={{ marginTop: 8 }} onClick={onReset}>Reset</button>
            </div>
            <InfoBox npc={infoNPC} />
          </div>
          <div className='biomes'>
            {Biomes.map(b =>
              <div key={b.name}>
                <img className='biome' alt={b.name} src={b.sprite} />

                <div className='villages'>
                  {biomeState[b.name].map((array, i) => (
                    <div key={i} className='village'>
                      {NPCs.filter(n => array.find(name => name === n.name) && activeNPC !== n.name).map(n =>
                        <div key={n.name}>
                          <img
                            className='npc'
                            alt={n.name}
                            src={n.sprite}
                            onMouseDown={e => {
                              setActiveNPC(n.name);
                              setInfoNPC(n);
                              e.preventDefault();
                            }}
                            style={activeNPC ? { pointerEvents: 'none' } : undefined}
                          />
                          <p>{happinessValues[n.name]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className='village new'>
                    {activeNPC && <span>+</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
