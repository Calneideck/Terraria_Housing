import React, { useState, useEffect } from 'react';
import './App.sass';

import { NPC, NPCs, BiomeType, Biomes } from './Stores';

interface MousePos {
  x: number;
  y: number;
}

const InitialBiomeState: { [key in BiomeType]: NPC[] } = {
  Forest: [],
  Cavern: [],
  GlowingMushroom: [],
  Desert: [],
  Hallow: [],
  Jungle: [],
  Ocean: [],
  Snow: []
};

function App() {
  const [activeNPC, setActiveNPC] = useState<NPC>();
  const [mousePos, setMousePos] = useState<MousePos>();
  const [biomes, SetBiomes] = useState(InitialBiomeState);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      if ((e.target as HTMLElement).className === 'biome') {
        if (activeNPC !== undefined) {
          const key = (e.target as HTMLImageElement).alt as BiomeType;
          let npcsInBiome = biomes[key];
          if (!npcsInBiome.find(name => name === activeNPC)) {
            npcsInBiome = [...npcsInBiome, activeNPC];
            SetBiomes({ ...biomes, [key]: npcsInBiome });
          }
        }
      }
      setActiveNPC(undefined);
    };

    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, [activeNPC, biomes]);

  return (
    <div>
      <div className='container'>
        <div>
          <h1>Terraria Housing</h1>
          <div className='npcs'>
            {NPCs.map(n => <img
              key={n.name}
              className='npc'
              alt={n.name}
              src={n.sprite}
              onMouseDown={e => {
                setActiveNPC(n.name);
                e.preventDefault();
              }}
              style={activeNPC === n.name ? {
                position: 'fixed',
                zIndex: 1,
                left: `${mousePos?.x}px`,
                top: `${mousePos?.y}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              } : {}}
            />)}
          </div>
          <div className='biomes'>
            {Biomes.map(b =>
              <div key={b.name}>
                <img className='biome' alt={b.name} src={b.sprite} />

                <div className='npc-holder'>
                  {NPCs.filter(n => biomes[b.name].find(name => name === n.name)).map(n => <img
                    key={n.name}
                    className='npc'
                    alt={n.name}
                    src={n.sprite}
                    onMouseDown={e => {
                      setActiveNPC(n.name);
                      e.preventDefault();
                    }}
                    style={activeNPC === n.name ? {
                      position: 'fixed',
                      zIndex: 1,
                      left: `${mousePos?.x}px`,
                      top: `${mousePos?.y}px`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none'
                    } : {}}
                  />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
