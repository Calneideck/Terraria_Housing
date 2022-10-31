import React, { useState, useEffect, useReducer, useMemo, useCallback } from 'react';
import './App.sass';

import { NPCName, NPCs, BiomeType, Biomes, INPC, BiomeState, findNPCInBiome, InitialBiomeState, biomeReducer } from './Model';
import { InfoBox } from './InfoBox';
import { NPCList } from './NPCList';
import { VillageNPC } from './VillageNPC';

export interface MousePos {
  x: number;
  y: number;
}

const clamp = (val: number, min: number, max: number) => {
  return Math.min(max, Math.max(val, min));
}

const getSiblingIndex = (element: Element) => {
  return Array.from(element.parentNode!.children).indexOf(element)
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
      biomeMult = 0.88;
      break;

    case NPCData.biomeLike:
      biomeMult = 0.94;
      break;

    case NPCData.biomeDislike:
      biomeMult = 1.06;
      break;

    case NPCData.biomeHate:
      biomeMult = 1.12;
      break;
  }

  const others = biomeState[biome[0]][biome[1]].filter(n => n !== npc);

  let spaceMult = 1;
  if (npc !== 'Princess') {
    spaceMult = others.length < 3 ? 0.95 : 1;
    if (others.length > 3)
      spaceMult *= Math.pow(1.04, others.length - 3);
  } else if (others.length < 2) {
    spaceMult = 1000;
  }

  let neighbourMult = 1.0;
  for (const neighbour of others) {
    if (NPCData.npcLove.find(n => n === neighbour) || npc === 'Princess')
      neighbourMult *= 0.88;
    else if (NPCData.npcLike.find(n => n === neighbour) || neighbour === 'Princess')
      neighbourMult *= 0.94;
    else if (NPCData.npcDislike.find(n => n === neighbour))
      neighbourMult *= 1.06;
    else if (NPCData.npcHate.find(n => n === neighbour))
      neighbourMult *= 1.12;
  }

  return Math.round(clamp(biomeMult * spaceMult * neighbourMult, 0.75, 1.5) * 100) / 100;
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

    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (window.innerWidth < 768) {
      alert('This site is not suitable for mobile devices.')
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    if (biomeState !== InitialBiomeState)
      localStorage.setItem('housing', JSON.stringify(biomeState));
  }, [biomeState]);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!activeNPC) return

      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      const elements = document.elementsFromPoint(e.touches[0].clientX, e.touches[0].clientY);

      let inVillage = false;
      for (const elem of elements) {
        if (elem.classList.contains('village')) {
          const biomeIndex = getSiblingIndex(elements[2]);
          const villageIndex = elem.classList.contains('new')
            ? -1 : getSiblingIndex(elem);
          setHoverVillage([biomeIndex, villageIndex]);
          inVillage = true;
          break;
        }
      }

      if (!inVillage) setHoverVillage(undefined);
    };

    window.addEventListener('touchmove', onTouchMove);
    return () => window.removeEventListener('touchmove', onTouchMove);
  }, [activeNPC]);

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
      if (!activeNPC) return;

      if (hoverVillage) {
        const newBiome = Biomes[hoverVillage[0]].name;
        const prevBiome = findNPCInBiome(activeNPC, biomeState);
        if (activeNPC === 'Truffle' && newBiome !== 'GlowingMushroom') {
          setActiveNPC(undefined);
          setHoverVillage(undefined);
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
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
    }
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
              <NPCList
                activeNPC={activeNPC}
                mousePos={mousePos}
                biomeState={biomeState}
                setActiveNPC={setActiveNPC}
                setInfoNPC={setInfoNPC}
                setTouchPos={setMousePos}
              />
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
                        <VillageNPC
                          key={n.name}
                          npc={n}
                          happiness={happinessValues[n.name]}
                          activeNPC={!!activeNPC}
                          setActiveNPC={setActiveNPC}
                          setInfoNPC={setInfoNPC}
                          setHoverVillage={() => setHoverVillage([bIndex, i])}
                          setTouchPos={setMousePos}
                        />
                      )}
                    </div>
                  ))}
                  <div
                    className={`village new${hoverVillage?.[0] === bIndex && hoverVillage[1] === -1 ? ' active' : ''}`}
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
          <div style={{ marginBottom: 24 }}>
            <h2>How to use</h2>
            <ul>
              <li>Drag and drop NPCs into biomes</li>
              <li>Drop an NPC onto the green + to create a new village in that biome</li>
              <ul>
                <li>A village is within the same biome but separate from other villages</li>
              </ul>
              <li>The percentage displayed below an NPC is the relative cost they will sell items at</li>
              <ul>
                <li><strong>Lower is better!</strong></li>
              </ul>
              <li>NPCs will sell pylons at 90% or lower</li>
              <li>Refer <a href='https://terraria.fandom.com/wiki/NPCs#Factors_affecting_happiness'>here</a> for more information.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
