export interface ManualPlayer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  team: string;
  teamAbbr: string;
  position: string;
  sport: 'NBA' | 'NFL' | 'MLB' | 'NHL';
  headshot: string;
  searchTerms: string[];
}

// Import NBA player overrides
import { NBA_PLAYER_OVERRIDES } from './nbaPlayerOverrides';
import { CSV_NBA_PLAYERS } from './csvNbaPlayers';

// NFL player overrides (keeping existing ones for now)
const NFL_PLAYER_OVERRIDES: ManualPlayer[] = [
  // Arizona Cardinals
  { id: 'NFL_manual_isaiah_adams', name: 'Isaiah Adams', firstName: 'Isaiah', lastName: 'Adams', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Guard', sport: 'NFL', headshot: '', searchTerms: ['isaiah adams', 'adams'] },
  { id: 'NFL_manual_andre_baccellia', name: 'Andre Baccellia', firstName: 'Andre', lastName: 'Baccellia', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['andre baccellia', 'baccellia'] },
  { id: 'NFL_manual_kelvin_beachum', name: 'Kelvin Beachum', firstName: 'Kelvin', lastName: 'Beachum', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['kelvin beachum', 'beachum'] },
  { id: 'NFL_manual_trey_benson', name: 'Trey Benson', firstName: 'Trey', lastName: 'Benson', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['trey benson', 'benson'] },
  { id: 'NFL_manual_jacoby_brissett', name: 'Jacoby Brissett', firstName: 'Jacoby', lastName: 'Brissett', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Quarterback', sport: 'NFL', headshot: '', searchTerms: ['jacoby brissett', 'brissett'] },
  { id: 'NFL_manual_evan_brown', name: 'Evan Brown', firstName: 'Evan', lastName: 'Brown', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Center', sport: 'NFL', headshot: '', searchTerms: ['evan brown', 'brown'] },
  { id: 'NFL_manual_jeremiah_byers', name: 'Jeremiah Byers', firstName: 'Jeremiah', lastName: 'Byers', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['jeremiah byers', 'byers'] },
  { id: 'NFL_manual_oscar_cardenas', name: 'Oscar Cardenas', firstName: 'Oscar', lastName: 'Cardenas', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['oscar cardenas', 'cardenas'] },
  { id: 'NFL_manual_michael_carter', name: 'Michael Carter', firstName: 'Michael', lastName: 'Carter', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['michael carter', 'carter'] },
  { id: 'NFL_manual_hayden_conner', name: 'Hayden Conner', firstName: 'Hayden', lastName: 'Conner', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Guard', sport: 'NFL', headshot: '', searchTerms: ['hayden conner', 'conner'] },
  { id: 'NFL_manual_james_conner', name: 'James Conner', firstName: 'James', lastName: 'Conner', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['james conner', 'conner'] },
  { id: 'NFL_manual_jake_curhan', name: 'Jake Curhan', firstName: 'Jake', lastName: 'Curhan', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['jake curhan', 'curhan'] },
  { id: 'NFL_manual_mcclendon_curtis', name: 'McClendon Curtis', firstName: 'McClendon', lastName: 'Curtis', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['mcclendon curtis', 'curtis'] },
  { id: 'NFL_manual_deejay_dallas', name: 'DeeJay Dallas', firstName: 'DeeJay', lastName: 'Dallas', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['deejay dallas', 'dallas'] },
  { id: 'NFL_manual_josiah_deguara', name: 'Josiah Deguara', firstName: 'Josiah', lastName: 'Deguara', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['josiah deguara', 'deguara'] },
  { id: 'NFL_manual_emari_demercado', name: 'Emari Demercado', firstName: 'Emari', lastName: 'Demercado', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['emari demercado', 'demercado'] },
  { id: 'NFL_manual_greg_dortch', name: 'Greg Dortch', firstName: 'Greg', lastName: 'Dortch', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['greg dortch', 'dortch'] },
  { id: 'NFL_manual_simi_fehoko', name: 'Simi Fehoko', firstName: 'Simi', lastName: 'Fehoko', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['simi fehoko', 'fehoko'] },
  { id: 'NFL_manual_hjalte_froholdt', name: 'Hjalte Froholdt', firstName: 'Hjalte', lastName: 'Froholdt', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Guard', sport: 'NFL', headshot: '', searchTerms: ['hjalte froholdt', 'froholdt'] },
  { id: 'NFL_manual_josh_fryar', name: 'Josh Fryar', firstName: 'Josh', lastName: 'Fryar', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['josh fryar', 'fryar'] },
  { id: 'NFL_manual_jon_gaines_ii', name: 'Jon Gaines II', firstName: 'Jon', lastName: 'Gaines II', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Guard', sport: 'NFL', headshot: '', searchTerms: ['jon gaines ii', 'gaines'] },
  { id: 'NFL_manual_bryson_green', name: 'Bryson Green', firstName: 'Bryson', lastName: 'Green', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['bryson green', 'green'] },
  { id: 'NFL_manual_marvin_harrison_jr', name: 'Marvin Harrison Jr.', firstName: 'Marvin', lastName: 'Harrison Jr.', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['marvin harrison jr', 'harrison'] },
  { id: 'NFL_manual_sincere_haynesworth', name: 'Sincere Haynesworth', firstName: 'Sincere', lastName: 'Haynesworth', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Center', sport: 'NFL', headshot: '', searchTerms: ['sincere haynesworth', 'haynesworth'] },
  { id: 'NFL_manual_elijah_higgins', name: 'Elijah Higgins', firstName: 'Elijah', lastName: 'Higgins', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['elijah higgins', 'higgins'] },
  { id: 'NFL_manual_trishton_jackson', name: 'Trishton Jackson', firstName: 'Trishton', lastName: 'Jackson', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['trishton jackson', 'jackson'] },
  { id: 'NFL_manual_paris_johnson_jr', name: 'Paris Johnson Jr.', firstName: 'Paris', lastName: 'Johnson Jr.', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['paris johnson jr', 'johnson'] },
  { id: 'NFL_manual_christian_jones', name: 'Christian Jones', firstName: 'Christian', lastName: 'Jones', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['christian jones', 'jones'] },
  { id: 'NFL_manual_zay_jones', name: 'Zay Jones', firstName: 'Zay', lastName: 'Jones', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['zay jones', 'jones'] },
  { id: 'NFL_manual_zonovan_knight', name: 'Zonovan Knight', firstName: 'Zonovan', lastName: 'Knight', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['zonovan knight', 'knight'] },
  { id: 'NFL_manual_nick_leverett', name: 'Nick Leverett', firstName: 'Nick', lastName: 'Leverett', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Guard', sport: 'NFL', headshot: '', searchTerms: ['nick leverett', 'leverett'] },
  { id: 'NFL_manual_trey_mcbride', name: 'Trey McBride', firstName: 'Trey', lastName: 'McBride', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['trey mcbride', 'mcbride'] },
  { id: 'NFL_manual_kyler_murray', name: 'Kyler Murray', firstName: 'Kyler', lastName: 'Murray', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Quarterback', sport: 'NFL', headshot: '', searchTerms: ['kyler murray', 'murray'] },
  { id: 'NFL_manual_royce_newman', name: 'Royce Newman', firstName: 'Royce', lastName: 'Newman', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Guard', sport: 'NFL', headshot: '', searchTerms: ['royce newman', 'newman'] },
  { id: 'NFL_manual_tejhaun_palmer', name: 'Tejhaun Palmer', firstName: 'Tejhaun', lastName: 'Palmer', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['tejhaun palmer', 'palmer'] },
  { id: 'NFL_manual_tip_reiman', name: 'Tip Reiman', firstName: 'Tip', lastName: 'Reiman', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['tip reiman', 'reiman'] },
  { id: 'NFL_manual_valentin_senn', name: 'Valentin Senn', firstName: 'Valentin', lastName: 'Senn', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['valentin senn', 'senn'] },
  { id: 'NFL_manual_clayton_tune', name: 'Clayton Tune', firstName: 'Clayton', lastName: 'Tune', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Quarterback', sport: 'NFL', headshot: '', searchTerms: ['clayton tune', 'tune'] },
  { id: 'NFL_manual_travis_vokolek', name: 'Travis Vokolek', firstName: 'Travis', lastName: 'Vokolek', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['travis vokolek', 'vokolek'] },
  { id: 'NFL_manual_quez_watkins', name: 'Quez Watkins', firstName: 'Quez', lastName: 'Watkins', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['quez watkins', 'watkins'] },
  { id: 'NFL_manual_xavier_weaver', name: 'Xavier Weaver', firstName: 'Xavier', lastName: 'Weaver', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['xavier weaver', 'weaver'] },
  { id: 'NFL_manual_jonah_williams', name: 'Jonah Williams', firstName: 'Jonah', lastName: 'Williams', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Offensive Tackle', sport: 'NFL', headshot: '', searchTerms: ['jonah williams', 'williams'] },
  { id: 'NFL_manual_michael_wilson', name: 'Michael Wilson', firstName: 'Michael', lastName: 'Wilson', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['michael wilson', 'wilson'] },
  { id: 'NFL_manual_budda_baker', name: 'Budda Baker', firstName: 'Budda', lastName: 'Baker', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Safety', sport: 'NFL', headshot: '', searchTerms: ['budda baker', 'baker'] },
  { id: 'NFL_manual_joey_blount', name: 'Joey Blount', firstName: 'Joey', lastName: 'Blount', team: 'Arizona Cardinals', teamAbbr: 'ARI', position: 'Safety', sport: 'NFL', headshot: '', searchTerms: ['joey blount', 'blount'] },
  
  // Atlanta Falcons (continuing with key players)
  { id: 'NFL_manual_kirk_cousins', name: 'Kirk Cousins', firstName: 'Kirk', lastName: 'Cousins', team: 'Atlanta Falcons', teamAbbr: 'ATL', position: 'Quarterback', sport: 'NFL', headshot: '', searchTerms: ['kirk cousins', 'cousins'] },
  { id: 'NFL_manual_drake_london', name: 'Drake London', firstName: 'Drake', lastName: 'London', team: 'Atlanta Falcons', teamAbbr: 'ATL', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['drake london', 'london'] },
  { id: 'NFL_manual_kyle_pitts', name: 'Kyle Pitts', firstName: 'Kyle', lastName: 'Pitts', team: 'Atlanta Falcons', teamAbbr: 'ATL', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['kyle pitts', 'pitts'] },
  { id: 'NFL_manual_bijan_robinson', name: 'Bijan Robinson', firstName: 'Bijan', lastName: 'Robinson', team: 'Atlanta Falcons', teamAbbr: 'ATL', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['bijan robinson', 'robinson'] },
  { id: 'NFL_manual_tyler_allgeier', name: 'Tyler Allgeier', firstName: 'Tyler', lastName: 'Allgeier', team: 'Atlanta Falcons', teamAbbr: 'ATL', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['tyler allgeier', 'allgeier'] },
  { id: 'NFL_manual_darnell_mooney', name: 'Darnell Mooney', firstName: 'Darnell', lastName: 'Mooney', team: 'Atlanta Falcons', teamAbbr: 'ATL', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['darnell mooney', 'mooney'] },
  { id: 'NFL_manual_michael_penix_jr', name: 'Michael Penix Jr.', firstName: 'Michael', lastName: 'Penix Jr.', team: 'Atlanta Falcons', teamAbbr: 'ATL', position: 'Quarterback', sport: 'NFL', headshot: '', searchTerms: ['michael penix jr', 'penix'] },
  
  // Baltimore Ravens (key players)
  { id: 'NFL_manual_lamar_jackson', name: 'Lamar Jackson', firstName: 'Lamar', lastName: 'Jackson', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'Quarterback', sport: 'NFL', headshot: '', searchTerms: ['lamar jackson', 'jackson'] },
  { id: 'NFL_manual_derrick_henry', name: 'Derrick Henry', firstName: 'Derrick', lastName: 'Henry', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['derrick henry', 'henry'] },
  { id: 'NFL_manual_mark_andrews', name: 'Mark Andrews', firstName: 'Mark', lastName: 'Andrews', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'Tight End', sport: 'NFL', headshot: '', searchTerms: ['mark andrews', 'andrews'] },
  { id: 'NFL_manual_zay_flowers', name: 'Zay Flowers', firstName: 'Zay', lastName: 'Flowers', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['zay flowers', 'flowers'] },
  { id: 'NFL_manual_deandre_hopkins', name: 'DeAndre Hopkins', firstName: 'DeAndre', lastName: 'Hopkins', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['deandre hopkins', 'hopkins'] },
  { id: 'NFL_manual_rashod_bateman', name: 'Rashod Bateman', firstName: 'Rashod', lastName: 'Bateman', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['rashod bateman', 'bateman'] },
  { id: 'NFL_manual_roquan_smith', name: 'Roquan Smith', firstName: 'Roquan', lastName: 'Smith', team: 'Baltimore Ravens', teamAbbr: 'BAL', position: 'Linebacker', sport: 'NFL', headshot: '', searchTerms: ['roquan smith', 'smith'] },
  
  // Buffalo Bills (key players)
  { id: 'NFL_manual_josh_allen', name: 'Josh Allen', firstName: 'Josh', lastName: 'Allen', team: 'Buffalo Bills', teamAbbr: 'BUF', position: 'Quarterback', sport: 'NFL', headshot: '', searchTerms: ['josh allen', 'allen'] },
  { id: 'NFL_manual_james_cook', name: 'James Cook', firstName: 'James', lastName: 'Cook', team: 'Buffalo Bills', teamAbbr: 'BUF', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['james cook', 'cook'] },
  { id: 'NFL_manual_keon_coleman', name: 'Keon Coleman', firstName: 'Keon', lastName: 'Coleman', team: 'Buffalo Bills', teamAbbr: 'BUF', position: 'Wide Receiver', sport: 'NFL', headshot: '', searchTerms: ['keon coleman', 'coleman'] },
  { id: 'NFL_manual_ray_davis', name: 'Ray Davis', firstName: 'Ray', lastName: 'Davis', team: 'Buffalo Bills', teamAbbr: 'BUF', position: 'Running Back', sport: 'NFL', headshot: '', searchTerms: ['ray davis', 'davis'] }
];

// Combine all manual player overrides
export const MANUAL_PLAYER_OVERRIDES: ManualPlayer[] = [
  ...NBA_PLAYER_OVERRIDES,
  ...CSV_NBA_PLAYERS,
  ...NFL_PLAYER_OVERRIDES
];
