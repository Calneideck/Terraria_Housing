//#region Imports
import Cavern from './images/biomes/Cavern.png';
import Desert from './images/biomes/Desert.png';
import Forest from './images/biomes/Forest.png';
import GlowingMushroom from './images/biomes/GlowingMushroom.png';
import Hallow from './images/biomes/Hallow.png';
import Jungle from './images/biomes/Jungle.png';
import Ocean from './images/biomes/Ocean.png';
import Snow from './images/biomes/Snow.png';

import Angler from './images/npcs/Angler.png';
import Arms_Dealer from './images/npcs/Arms_Dealer.png';
import Clothier from './images/npcs/Clothier.png';
import Cyborg from './images/npcs/Cyborg.png';
import Demolitionist from './images/npcs/Demolitionist.png';
import Dryad from './images/npcs/Dryad.png';
import Dye_Trader from './images/npcs/Dye_Trader.png';
import Goblin_Tinkerer from './images/npcs/Goblin_Tinkerer.png';
import Golfer from './images/npcs/Golfer.png';
import Guide from './images/npcs/Guide.png';
import Mechanic from './images/npcs/Mechanic.png';
import Merchant from './images/npcs/Merchant.png';
import Nurse from './images/npcs/Nurse.png';
import Painter from './images/npcs/Painter.png';
import Party_Girl from './images/npcs/Party_Girl.png';
import Pirate from './images/npcs/Pirate.png';
import Santa_Claus from './images/npcs/Santa_Claus.png';
import Steampunker from './images/npcs/Steampunker.png';
import Stylist from './images/npcs/Stylist.png';
import Tavernkeep from './images/npcs/Tavernkeep.png';
import Tax_Collector from './images/npcs/Tax_Collector.png';
import Truffle from './images/npcs/Truffle.png';
import Witch_Doctor from './images/npcs/Witch_Doctor.png';
import Wizard from './images/npcs/Wizard.png';
import Zoologist from './images/npcs/Zoologist.png';
//#endregion

export const Biomes = [
    {
        name: 'Cavern',
        sprite: Cavern
    },
    {
        name: 'Desert',
        sprite: Desert
    },
    {
        name: 'Forest',
        sprite: Forest
    },
    {
        name: 'GlowingMushroom',
        sprite: GlowingMushroom
    },
    {
        name: 'Hallow',
        sprite: Hallow
    },
    {
        name: 'Jungle',
        sprite: Jungle
    },
    {
        name: 'Ocean',
        sprite: Ocean
    },
    {
        name: 'Snow',
        sprite: Snow
    },
] as const;

export type BiomeType = typeof Biomes[number]['name'];

export type NPCName = 'Angler' | 'Arms Dealer' | 'Clothier' | 'Cyborg' | 'Demolitionist' | 'Dryad' | 'Dye Trader' | 'Goblin Tinkerer' | 'Golfer' | 'Guide' | 'Mechanic' | 'Merchant' | 'Nurse' | 'Painter' | 'Party Girl' | 'Pirate' | 'Santa Claus' | 'Steampunker' | 'Stylist' | 'Tavernkeep' | 'Tax Collector' | 'Truffle' | 'Witch Doctor' | 'Wizard' | 'Zoologist';

export interface INPC {
    name: NPCName;
    sprite: string;
    
    biomeLove?: BiomeType;
    biomeLike?: BiomeType;
    biomeDislike?: BiomeType;
    biomeHate?: BiomeType;

    npcLove: NPCName[];
    npcLike: NPCName[];
    npcDislike: NPCName[];
    npcHate: NPCName[];
}

export const NPCs: INPC[] = [
    {
        name: 'Angler',
        sprite: Angler,
        biomeLike: 'Ocean',
        biomeHate: 'Desert',
        npcLove: [],
        npcLike: ['Demolitionist', 'Party Girl', 'Tax Collector'],
        npcDislike: [],
        npcHate: ['Tavernkeep']
    },
    {
        name: 'Arms Dealer',
        sprite: Arms_Dealer,
        biomeLike: 'Desert',
        biomeDislike: 'Snow',
        npcLove: ['Nurse'],
        npcLike: ['Steampunker'],
        npcDislike: ['Golfer'],
        npcHate: ['Demolitionist']
    },
    {
        name: 'Clothier',
        sprite: Clothier,
        biomeLike: 'Cavern',
        biomeDislike: 'Hallow',
        npcLove: ['Truffle'],
        npcLike: ['Tax Collector'],
        npcDislike: ['Nurse'],
        npcHate: ['Mechanic']
    },
    {
        name: 'Cyborg',
        sprite: Cyborg,
        biomeLike: 'Snow',
        biomeDislike: 'Jungle',
        npcLove: [],
        npcLike: ['Steampunker', 'Pirate', 'Stylist'],
        npcDislike: ['Zoologist'],
        npcHate: ['Wizard']
    },
    {
        name: 'Demolitionist',
        sprite: Demolitionist,
        biomeLike: 'Cavern',
        biomeDislike: 'Ocean',
        npcLove: ['Tavernkeep'],
        npcLike: ['Mechanic'],
        npcDislike: ['Arms Dealer', 'Goblin Tinkerer'],
        npcHate: []
    },
    {
        name: 'Dryad',
        sprite: Dryad,
        biomeLike: 'Jungle',
        biomeDislike: 'Desert',
        npcLove: [],
        npcLike: ['Witch Doctor', 'Truffle'],
        npcDislike: ['Angler', 'Zoologist'],
        npcHate: ['Golfer']
    },
    {
        name: 'Dye Trader',
        sprite: Dye_Trader,
        biomeLike: 'Desert',
        biomeDislike: 'Forest',
        npcLove: [],
        npcLike: ['Arms Dealer', 'Painter'],
        npcDislike: ['Steampunker'],
        npcHate: ['Pirate']
    },
    {
        name: 'Goblin Tinkerer',
        sprite: Goblin_Tinkerer,
        biomeLike: 'Cavern',
        biomeDislike: 'Jungle',
        npcLove: ['Mechanic'],
        npcLike: ['Dye Trader'],
        npcDislike: ['Clothier'],
        npcHate: ['Stylist']
    },
    {
        name: 'Golfer',
        sprite: Golfer,
        biomeLike: 'Forest',
        biomeDislike: 'Cavern',
        npcLove: ['Angler'],
        npcLike: ['Painter', 'Zoologist'],
        npcDislike: ['Pirate'],
        npcHate: ['Merchant']
    },
    {
        name: 'Guide',
        sprite: Guide,
        biomeLike: 'Forest',
        biomeDislike: 'Ocean',
        npcLove: [],
        npcLike: ['Clothier', 'Zoologist'],
        npcDislike: ['Steampunker'],
        npcHate: ['Painter']
    },
    {
        name: 'Mechanic',
        sprite: Mechanic,
        biomeLike: 'Snow',
        biomeDislike: 'Cavern',
        npcLove: ['Goblin Tinkerer'],
        npcLike: ['Cyborg'],
        npcDislike: ['Arms Dealer'],
        npcHate: ['Clothier']
    },
    {
        name: 'Merchant',
        sprite: Merchant,
        biomeLike: 'Forest',
        biomeDislike: 'Desert',
        npcLove: [],
        npcLike: ['Golfer', 'Nurse'],
        npcDislike: ['Tax Collector'],
        npcHate: ['Angler']
    },
    {
        name: 'Nurse',
        sprite: Nurse,
        biomeLike: 'Hallow',
        biomeDislike: 'Snow',
        npcLove: ['Arms Dealer'],
        npcLike: ['Wizard'],
        npcDislike: ['Dryad', 'Party Girl'],
        npcHate: ['Zoologist']
    },
    {
        name: 'Painter',
        sprite: Painter,
        biomeLike: 'Jungle',
        biomeDislike: 'Forest',
        npcLove: ['Dryad'],
        npcLike: ['Party Girl'],
        npcDislike: ['Truffle', 'Cyborg'],
        npcHate: []
    },
    {
        name: 'Party Girl',
        sprite: Party_Girl,
        biomeLike: 'Hallow',
        biomeDislike: 'Cavern',
        npcLove: ['Wizard'],
        npcLike: ['Stylist'],
        npcDislike: ['Merchant'],
        npcHate: ['Tax Collector']
    },
    {
        name: 'Pirate',
        sprite: Pirate,
        biomeLike: 'Ocean',
        biomeDislike: 'Cavern',
        npcLove: ['Angler'],
        npcLike: ['Tavernkeep'],
        npcDislike: ['Stylist'],
        npcHate: ['Guide']
    },
    {
        name: 'Santa Claus',
        sprite: Santa_Claus,
        biomeLove: 'Snow',
        biomeHate: 'Desert',
        npcLove: [],
        npcLike: [],
        npcDislike: [],
        npcHate: ['Tax Collector']
    },
    {
        name: 'Steampunker',
        sprite: Steampunker,
        biomeLike: 'Desert',
        biomeDislike: 'Jungle',
        npcLove: ['Cyborg'],
        npcLike: ['Painter'],
        npcDislike: ['Dryad', 'Wizard', 'Party Girl'],
        npcHate: []
    },
    {
        name: 'Stylist',
        sprite: Stylist,
        biomeLike: 'Ocean',
        biomeDislike: 'Snow',
        npcLove: ['Dye Trader'],
        npcLike: ['Pirate'],
        npcDislike: ['Tavernkeep'],
        npcHate: ['Goblin Tinkerer']
    },
    {
        name: 'Tavernkeep',
        sprite: Tavernkeep,
        biomeLike: 'Hallow',
        biomeDislike: 'Snow',
        npcLove: ['Demolitionist'],
        npcLike: ['Goblin Tinkerer'],
        npcDislike: ['Guide'],
        npcHate: ['Dye Trader']
    },
    {
        name: 'Tax Collector',
        sprite: Tax_Collector,
        biomeLike: 'Snow',
        biomeDislike: 'Hallow',
        npcLove: ['Merchant'],
        npcLike: ['Party Girl'],
        npcDislike: ['Demolitionist', 'Mechanic'],
        npcHate: ['Santa Claus']
    },
    {
        name: 'Truffle',
        sprite: Truffle,
        npcLove: ['Guide'],
        npcLike: ['Dryad'],
        npcDislike: ['Clothier'],
        npcHate: ['Witch Doctor']
    },
    {
        name: 'Witch Doctor',
        sprite: Witch_Doctor,
        biomeLike: 'Jungle',
        biomeDislike: 'Hallow',
        npcLove: [],
        npcLike: ['Dryad', 'Guide'],
        npcDislike: ['Nurse'],
        npcHate: ['Truffle']
    },
    {
        name: 'Wizard',
        sprite: Wizard,
        biomeLike: 'Hallow',
        biomeDislike: 'Ocean',
        npcLove: ['Golfer'],
        npcLike: ['Merchant'],
        npcDislike: ['Witch Doctor'],
        npcHate: ['Cyborg']
    },
    {
        name: 'Zoologist',
        sprite: Zoologist,
        biomeLike: 'Forest',
        biomeDislike: 'Desert',
        npcLove: ['Witch Doctor'],
        npcLike: ['Golfer'],
        npcDislike: ['Angler'],
        npcHate: ['Arms Dealer']
    }
]