import React, { useState, useEffect, CSSProperties, useReducer, useMemo, useCallback } from 'react';
import './App.sass';

import { NPCName, NPCs, BiomeType, Biomes, INPC, BiomeState, findNPCInBiome, InitialBiomeState, biomeReducer } from './Model';
import { InfoBox } from './InfoBox';

interface MousePos {
  x: number;
  y: number;
}

const activeNPCStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 1,
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none'
};

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
  const [hoverVillage, setHoverVillage] = useState<number[]>();
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
    if (innerArray.length > 0 || (index === 0 && newArray.length === 1))
      newArray[index] = innerArray;
    else
      newArray.splice(index, 1);

    dispatch({
      biome: biome,
      npcs: newArray
    });
  }, [biomeState, dispatch]);

  useEffect(() => {
    const onMouseUp = () => {
      if (activeNPC !== undefined)
        if (hoverVillage) {
          const newBiome = Biomes[hoverVillage[0]].name;
          const prevBiome = findNPCInBiome(activeNPC, biomeState);
          if (activeNPC === 'Truffle' && newBiome !== 'GlowingMushroom') {
            alert('Truffle can only live in Glowing Mushroom');
            return;
          }

          if (prevBiome && (prevBiome[0] !== newBiome || prevBiome[1] !== hoverVillage[1]))
            removeFromBiome(prevBiome[0], activeNPC, prevBiome[1]);

          const npcsInBiome = biomeState[newBiome][hoverVillage[1]];
          if (!npcsInBiome || !npcsInBiome.find(name => name === activeNPC)) {
            const innerArray = npcsInBiome ? [...npcsInBiome, activeNPC] : [activeNPC];
            const newArray = biomeState[newBiome].map(array => array.filter(n => n !== activeNPC));
            newArray[hoverVillage[1] >= 0 ? hoverVillage[1] : newArray.length] = innerArray;
            for (let i in newArray)
              if (newArray[i].length === 0) {
                newArray.splice(Number(i), 1);
                break;
              }

            dispatch({
              biome: newBiome,
              npcs: newArray
            });
          }
        } else {
          // Remove NPC from biome
          const prevBiome = findNPCInBiome(activeNPC, biomeState);
          if (prevBiome)
            removeFromBiome(prevBiome[0], activeNPC, prevBiome[1]);
        }

      setActiveNPC(undefined);
      setHoverVillage(undefined);
    };

    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, [activeNPC, biomeState, hoverVillage, removeFromBiome]);

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
            {Biomes.map((b, bIndex) =>
              <div key={b.name}>
                <img className='biome' alt={b.name} src={b.sprite} />

                <div className='villages'>
                  {biomeState[b.name].map((array, i) => (
                    <div
                      key={i}
                      className={`village${hoverVillage && hoverVillage[0] === bIndex && hoverVillage[1] === i ? ' active' : ''}`}
                      onMouseEnter={() => {
                        if (activeNPC)
                          setHoverVillage([bIndex, i]);
                      }}
                      onMouseLeave={() => setHoverVillage(undefined)}
                    >
                      {NPCs.filter(n => array.find(name => name === n.name) && activeNPC !== n.name).map(n =>
                        <div key={n.name}>
                          <img
                            className='npc'
                            alt={n.name}
                            src={n.sprite}
                            onMouseDown={e => {
                              setActiveNPC(n.name);
                              setInfoNPC(n);
                              setHoverVillage([bIndex, i]);
                              e.preventDefault();
                            }}
                            style={activeNPC ? { pointerEvents: 'none' } : undefined}
                          />
                          <p>{happinessValues[n.name]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    className={`village new${hoverVillage && hoverVillage[0] === bIndex && hoverVillage[1] === -1 ? ' active' : ''}`}
                    onMouseEnter={() => {
                      if (activeNPC)
                        setHoverVillage([bIndex, -1]);
                    }}
                    onMouseLeave={() => setHoverVillage(undefined)}
                  >
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
