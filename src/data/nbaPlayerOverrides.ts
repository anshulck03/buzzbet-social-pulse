
export interface NBAPlayer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  team: string;
  teamAbbr: string;
  position: string;
  sport: 'NBA';
  headshot: string;
  searchTerms: string[];
}

export const NBA_PLAYER_OVERRIDES: NBAPlayer[] = [
  // Los Angeles Lakers
  { id: 'NBA_manual_lebron_james', name: 'LeBron James', firstName: 'LeBron', lastName: 'James', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['lebron james', 'james', 'lebron', 'king james', 'the king'] },
  { id: 'NBA_manual_anthony_davis', name: 'Anthony Davis', firstName: 'Anthony', lastName: 'Davis', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'PF/C', sport: 'NBA', headshot: '', searchTerms: ['anthony davis', 'davis', 'ad', 'ant davis'] },
  { id: 'NBA_manual_austin_reaves', name: 'Austin Reaves', firstName: 'Austin', lastName: 'Reaves', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['austin reaves', 'reaves'] },
  { id: 'NBA_manual_dalton_knecht', name: 'Dalton Knecht', firstName: 'Dalton', lastName: 'Knecht', team: 'Los Angeles Lakers', teamAbbr: 'LAL', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['dalton knecht', 'knecht'] },
  
  // Golden State Warriors
  { id: 'NBA_manual_stephen_curry', name: 'Stephen Curry', firstName: 'Stephen', lastName: 'Curry', team: 'Golden State Warriors', teamAbbr: 'GSW', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['stephen curry', 'curry', 'steph curry', 'chef curry'] },
  { id: 'NBA_manual_klay_thompson', name: 'Klay Thompson', firstName: 'Klay', lastName: 'Thompson', team: 'Dallas Mavericks', teamAbbr: 'DAL', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['klay thompson', 'thompson', 'klay'] },
  { id: 'NBA_manual_draymond_green', name: 'Draymond Green', firstName: 'Draymond', lastName: 'Green', team: 'Golden State Warriors', teamAbbr: 'GSW', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['draymond green', 'green', 'draymond'] },
  { id: 'NBA_manual_andrew_wiggins', name: 'Andrew Wiggins', firstName: 'Andrew', lastName: 'Wiggins', team: 'Golden State Warriors', teamAbbr: 'GSW', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['andrew wiggins', 'wiggins'] },
  
  // Boston Celtics
  { id: 'NBA_manual_jayson_tatum', name: 'Jayson Tatum', firstName: 'Jayson', lastName: 'Tatum', team: 'Boston Celtics', teamAbbr: 'BOS', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['jayson tatum', 'tatum', 'jt'] },
  { id: 'NBA_manual_jaylen_brown', name: 'Jaylen Brown', firstName: 'Jaylen', lastName: 'Brown', team: 'Boston Celtics', teamAbbr: 'BOS', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['jaylen brown', 'brown', 'jaylen'] },
  { id: 'NBA_manual_kristaps_porzingis', name: 'Kristaps Porzingis', firstName: 'Kristaps', lastName: 'Porzingis', team: 'Boston Celtics', teamAbbr: 'BOS', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['kristaps porzingis', 'porzingis', 'kp', 'unicorn'] },
  { id: 'NBA_manual_derrick_white', name: 'Derrick White', firstName: 'Derrick', lastName: 'White', team: 'Boston Celtics', teamAbbr: 'BOS', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['derrick white', 'white'] },
  
  // Milwaukee Bucks
  { id: 'NBA_manual_giannis_antetokounmpo', name: 'Giannis Antetokounmpo', firstName: 'Giannis', lastName: 'Antetokounmpo', team: 'Milwaukee Bucks', teamAbbr: 'MIL', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['giannis antetokounmpo', 'giannis', 'greek freak', 'antetokounmpo'] },
  { id: 'NBA_manual_damian_lillard', name: 'Damian Lillard', firstName: 'Damian', lastName: 'Lillard', team: 'Milwaukee Bucks', teamAbbr: 'MIL', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['damian lillard', 'lillard', 'dame', 'dame time'] },
  { id: 'NBA_manual_khris_middleton', name: 'Khris Middleton', firstName: 'Khris', lastName: 'Middleton', team: 'Milwaukee Bucks', teamAbbr: 'MIL', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['khris middleton', 'middleton'] },
  
  // Phoenix Suns
  { id: 'NBA_manual_kevin_durant', name: 'Kevin Durant', firstName: 'Kevin', lastName: 'Durant', team: 'Phoenix Suns', teamAbbr: 'PHX', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['kevin durant', 'durant', 'kd', 'slim reaper'] },
  { id: 'NBA_manual_devin_booker', name: 'Devin Booker', firstName: 'Devin', lastName: 'Booker', team: 'Phoenix Suns', teamAbbr: 'PHX', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['devin booker', 'booker', 'book'] },
  { id: 'NBA_manual_bradley_beal', name: 'Bradley Beal', firstName: 'Bradley', lastName: 'Beal', team: 'Phoenix Suns', teamAbbr: 'PHX', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['bradley beal', 'beal'] },
  
  // Dallas Mavericks
  { id: 'NBA_manual_luka_doncic', name: 'Luka Dončić', firstName: 'Luka', lastName: 'Dončić', team: 'Dallas Mavericks', teamAbbr: 'DAL', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['luka doncic', 'doncic', 'luka', 'luka dončić', 'dončić'] },
  { id: 'NBA_manual_kyrie_irving', name: 'Kyrie Irving', firstName: 'Kyrie', lastName: 'Irving', team: 'Dallas Mavericks', teamAbbr: 'DAL', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['kyrie irving', 'irving', 'kyrie'] },
  
  // Denver Nuggets
  { id: 'NBA_manual_nikola_jokic', name: 'Nikola Jokić', firstName: 'Nikola', lastName: 'Jokić', team: 'Denver Nuggets', teamAbbr: 'DEN', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['nikola jokic', 'jokic', 'joker', 'nikola jokić', 'jokić'] },
  { id: 'NBA_manual_jamal_murray', name: 'Jamal Murray', firstName: 'Jamal', lastName: 'Murray', team: 'Denver Nuggets', teamAbbr: 'DEN', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['jamal murray', 'murray'] },
  { id: 'NBA_manual_michael_porter_jr', name: 'Michael Porter Jr.', firstName: 'Michael', lastName: 'Porter Jr.', team: 'Denver Nuggets', teamAbbr: 'DEN', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['michael porter jr', 'porter', 'mpj'] },
  
  // Philadelphia 76ers
  { id: 'NBA_manual_joel_embiid', name: 'Joel Embiid', firstName: 'Joel', lastName: 'Embiid', team: 'Philadelphia 76ers', teamAbbr: 'PHI', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['joel embiid', 'embiid', 'the process'] },
  { id: 'NBA_manual_tyrese_maxey', name: 'Tyrese Maxey', firstName: 'Tyrese', lastName: 'Maxey', team: 'Philadelphia 76ers', teamAbbr: 'PHI', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['tyrese maxey', 'maxey'] },
  { id: 'NBA_manual_paul_george', name: 'Paul George', firstName: 'Paul', lastName: 'George', team: 'Philadelphia 76ers', teamAbbr: 'PHI', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['paul george', 'george', 'pg13'] },
  
  // Miami Heat
  { id: 'NBA_manual_jimmy_butler', name: 'Jimmy Butler', firstName: 'Jimmy', lastName: 'Butler', team: 'Miami Heat', teamAbbr: 'MIA', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['jimmy butler', 'butler', 'jimmy buckets'] },
  { id: 'NBA_manual_bam_adebayo', name: 'Bam Adebayo', firstName: 'Bam', lastName: 'Adebayo', team: 'Miami Heat', teamAbbr: 'MIA', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['bam adebayo', 'adebayo', 'bam'] },
  { id: 'NBA_manual_tyler_herro', name: 'Tyler Herro', firstName: 'Tyler', lastName: 'Herro', team: 'Miami Heat', teamAbbr: 'MIA', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['tyler herro', 'herro'] },
  
  // New York Knicks
  { id: 'NBA_manual_jalen_brunson', name: 'Jalen Brunson', firstName: 'Jalen', lastName: 'Brunson', team: 'New York Knicks', teamAbbr: 'NYK', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['jalen brunson', 'brunson'] },
  { id: 'NBA_manual_karl_anthony_towns', name: 'Karl-Anthony Towns', firstName: 'Karl-Anthony', lastName: 'Towns', team: 'New York Knicks', teamAbbr: 'NYK', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['karl-anthony towns', 'towns', 'kat'] },
  { id: 'NBA_manual_og_anunoby', name: 'OG Anunoby', firstName: 'OG', lastName: 'Anunoby', team: 'New York Knicks', teamAbbr: 'NYK', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['og anunoby', 'anunoby', 'og'] },
  { id: 'NBA_manual_josh_hart', name: 'Josh Hart', firstName: 'Josh', lastName: 'Hart', team: 'New York Knicks', teamAbbr: 'NYK', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['josh hart', 'hart'] },
  
  // Oklahoma City Thunder
  { id: 'NBA_manual_shai_gilgeous_alexander', name: 'Shai Gilgeous-Alexander', firstName: 'Shai', lastName: 'Gilgeous-Alexander', team: 'Oklahoma City Thunder', teamAbbr: 'OKC', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['shai gilgeous-alexander', 'shai', 'sga'] },
  { id: 'NBA_manual_jalen_williams', name: 'Jalen Williams', firstName: 'Jalen', lastName: 'Williams', team: 'Oklahoma City Thunder', teamAbbr: 'OKC', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['jalen williams', 'williams', 'j-dub'] },
  { id: 'NBA_manual_chet_holmgren', name: 'Chet Holmgren', firstName: 'Chet', lastName: 'Holmgren', team: 'Oklahoma City Thunder', teamAbbr: 'OKC', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['chet holmgren', 'holmgren', 'chet'] },
  
  // Cleveland Cavaliers
  { id: 'NBA_manual_donovan_mitchell', name: 'Donovan Mitchell', firstName: 'Donovan', lastName: 'Mitchell', team: 'Cleveland Cavaliers', teamAbbr: 'CLE', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['donovan mitchell', 'mitchell', 'spida'] },
  { id: 'NBA_manual_darius_garland', name: 'Darius Garland', firstName: 'Darius', lastName: 'Garland', team: 'Cleveland Cavaliers', teamAbbr: 'CLE', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['darius garland', 'garland'] },
  { id: 'NBA_manual_evan_mobley', name: 'Evan Mobley', firstName: 'Evan', lastName: 'Mobley', team: 'Cleveland Cavaliers', teamAbbr: 'CLE', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['evan mobley', 'mobley'] },
  
  // Orlando Magic
  { id: 'NBA_manual_paolo_banchero', name: 'Paolo Banchero', firstName: 'Paolo', lastName: 'Banchero', team: 'Orlando Magic', teamAbbr: 'ORL', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['paolo banchero', 'banchero', 'paolo'] },
  { id: 'NBA_manual_franz_wagner', name: 'Franz Wagner', firstName: 'Franz', lastName: 'Wagner', team: 'Orlando Magic', teamAbbr: 'ORL', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['franz wagner', 'wagner', 'franz'] },
  
  // Indiana Pacers
  { id: 'NBA_manual_tyrese_haliburton', name: 'Tyrese Haliburton', firstName: 'Tyrese', lastName: 'Haliburton', team: 'Indiana Pacers', teamAbbr: 'IND', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['tyrese haliburton', 'haliburton'] },
  { id: 'NBA_manual_pascal_siakam', name: 'Pascal Siakam', firstName: 'Pascal', lastName: 'Siakam', team: 'Indiana Pacers', teamAbbr: 'IND', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['pascal siakam', 'siakam', 'spicy p'] },
  
  // Minnesota Timberwolves
  { id: 'NBA_manual_anthony_edwards', name: 'Anthony Edwards', firstName: 'Anthony', lastName: 'Edwards', team: 'Minnesota Timberwolves', teamAbbr: 'MIN', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['anthony edwards', 'edwards', 'ant edwards', 'ant-man'] },
  { id: 'NBA_manual_rudy_gobert', name: 'Rudy Gobert', firstName: 'Rudy', lastName: 'Gobert', team: 'Minnesota Timberwolves', teamAbbr: 'MIN', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['rudy gobert', 'gobert'] },
  { id: 'NBA_manual_jaden_mcdaniels', name: 'Jaden McDaniels', firstName: 'Jaden', lastName: 'McDaniels', team: 'Minnesota Timberwolves', teamAbbr: 'MIN', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['jaden mcdaniels', 'mcdaniels'] },
  
  // Memphis Grizzlies
  { id: 'NBA_manual_ja_morant', name: 'Ja Morant', firstName: 'Ja', lastName: 'Morant', team: 'Memphis Grizzlies', teamAbbr: 'MEM', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['ja morant', 'morant', 'ja'] },
  { id: 'NBA_manual_jaren_jackson_jr', name: 'Jaren Jackson Jr.', firstName: 'Jaren', lastName: 'Jackson Jr.', team: 'Memphis Grizzlies', teamAbbr: 'MEM', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['jaren jackson jr', 'jackson', 'jjj'] },
  
  // Sacramento Kings
  { id: 'NBA_manual_de_aaron_fox', name: "De'Aaron Fox", firstName: "De'Aaron", lastName: 'Fox', team: 'Sacramento Kings', teamAbbr: 'SAC', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ["de'aaron fox", 'fox', 'deaaron fox'] },
  { id: 'NBA_manual_domantas_sabonis', name: 'Domantas Sabonis', firstName: 'Domantas', lastName: 'Sabonis', team: 'Sacramento Kings', teamAbbr: 'SAC', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['domantas sabonis', 'sabonis'] },
  
  // Los Angeles Clippers
  { id: 'NBA_manual_kawhi_leonard', name: 'Kawhi Leonard', firstName: 'Kawhi', lastName: 'Leonard', team: 'Los Angeles Clippers', teamAbbr: 'LAC', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['kawhi leonard', 'leonard', 'kawhi', 'the claw'] },
  { id: 'NBA_manual_james_harden', name: 'James Harden', firstName: 'James', lastName: 'Harden', team: 'Los Angeles Clippers', teamAbbr: 'LAC', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['james harden', 'harden', 'the beard'] },
  
  // Houston Rockets
  { id: 'NBA_manual_alperen_sengun', name: 'Alperen Şengün', firstName: 'Alperen', lastName: 'Şengün', team: 'Houston Rockets', teamAbbr: 'HOU', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['alperen sengun', 'sengun', 'şengün'] },
  { id: 'NBA_manual_fred_vanvleet', name: 'Fred VanVleet', firstName: 'Fred', lastName: 'VanVleet', team: 'Houston Rockets', teamAbbr: 'HOU', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['fred vanvleet', 'vanvleet', 'fvv'] },
  
  // San Antonio Spurs
  { id: 'NBA_manual_victor_wembanyama', name: 'Victor Wembanyama', firstName: 'Victor', lastName: 'Wembanyama', team: 'San Antonio Spurs', teamAbbr: 'SAS', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['victor wembanyama', 'wembanyama', 'wemby', 'victor'] },
  { id: 'NBA_manual_devin_vassell', name: 'Devin Vassell', firstName: 'Devin', lastName: 'Vassell', team: 'San Antonio Spurs', teamAbbr: 'SAS', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['devin vassell', 'vassell'] },
  
  // Atlanta Hawks
  { id: 'NBA_manual_trae_young', name: 'Trae Young', firstName: 'Trae', lastName: 'Young', team: 'Atlanta Hawks', teamAbbr: 'ATL', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['trae young', 'young', 'ice trae'] },
  { id: 'NBA_manual_dejounte_murray', name: 'Dejounte Murray', firstName: 'Dejounte', lastName: 'Murray', team: 'New Orleans Pelicans', teamAbbr: 'NOP', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['dejounte murray', 'murray'] },
  
  // Chicago Bulls
  { id: 'NBA_manual_zach_lavine', name: 'Zach LaVine', firstName: 'Zach', lastName: 'LaVine', team: 'Chicago Bulls', teamAbbr: 'CHI', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['zach lavine', 'lavine'] },
  { id: 'NBA_manual_nikola_vucevic', name: 'Nikola Vučević', firstName: 'Nikola', lastName: 'Vučević', team: 'Chicago Bulls', teamAbbr: 'CHI', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['nikola vucevic', 'vucevic', 'vooch', 'vučević'] },
  
  // Toronto Raptors
  { id: 'NBA_manual_scottie_barnes', name: 'Scottie Barnes', firstName: 'Scottie', lastName: 'Barnes', team: 'Toronto Raptors', teamAbbr: 'TOR', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['scottie barnes', 'barnes', 'scottie'] },
  { id: 'NBA_manual_rj_barrett', name: 'RJ Barrett', firstName: 'RJ', lastName: 'Barrett', team: 'Toronto Raptors', teamAbbr: 'TOR', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['rj barrett', 'barrett', 'rj'] },
  
  // Washington Wizards
  { id: 'NBA_manual_jordan_poole', name: 'Jordan Poole', firstName: 'Jordan', lastName: 'Poole', team: 'Washington Wizards', teamAbbr: 'WAS', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['jordan poole', 'poole'] },
  { id: 'NBA_manual_kyle_kuzma', name: 'Kyle Kuzma', firstName: 'Kyle', lastName: 'Kuzma', team: 'Washington Wizards', teamAbbr: 'WAS', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['kyle kuzma', 'kuzma'] },
  
  // Charlotte Hornets
  { id: 'NBA_manual_lamelo_ball', name: 'LaMelo Ball', firstName: 'LaMelo', lastName: 'Ball', team: 'Charlotte Hornets', teamAbbr: 'CHA', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['lamelo ball', 'ball', 'melo'] },
  { id: 'NBA_manual_miles_bridges', name: 'Miles Bridges', firstName: 'Miles', lastName: 'Bridges', team: 'Charlotte Hornets', teamAbbr: 'CHA', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['miles bridges', 'bridges'] },
  
  // Detroit Pistons
  { id: 'NBA_manual_cade_cunningham', name: 'Cade Cunningham', firstName: 'Cade', lastName: 'Cunningham', team: 'Detroit Pistons', teamAbbr: 'DET', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['cade cunningham', 'cunningham', 'cade'] },
  { id: 'NBA_manual_isaiah_stewart', name: 'Isaiah Stewart', firstName: 'Isaiah', lastName: 'Stewart', team: 'Detroit Pistons', teamAbbr: 'DET', position: 'C', sport: 'NBA', headshot: '', searchTerms: ['isaiah stewart', 'stewart', 'beef stew'] },
  
  // Brooklyn Nets
  { id: 'NBA_manual_mikal_bridges', name: 'Mikal Bridges', firstName: 'Mikal', lastName: 'Bridges', team: 'New York Knicks', teamAbbr: 'NYK', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['mikal bridges', 'bridges', 'mikal'] },
  { id: 'NBA_manual_cam_thomas', name: 'Cam Thomas', firstName: 'Cam', lastName: 'Thomas', team: 'Brooklyn Nets', teamAbbr: 'BKN', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['cam thomas', 'thomas'] },
  
  // Portland Trail Blazers
  { id: 'NBA_manual_anfernee_simons', name: 'Anfernee Simons', firstName: 'Anfernee', lastName: 'Simons', team: 'Portland Trail Blazers', teamAbbr: 'POR', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['anfernee simons', 'simons', 'ant simons'] },
  { id: 'NBA_manual_shaedon_sharpe', name: 'Shaedon Sharpe', firstName: 'Shaedon', lastName: 'Sharpe', team: 'Portland Trail Blazers', teamAbbr: 'POR', position: 'SG', sport: 'NBA', headshot: '', searchTerms: ['shaedon sharpe', 'sharpe'] },
  
  // Utah Jazz
  { id: 'NBA_manual_lauri_markkanen', name: 'Lauri Markkanen', firstName: 'Lauri', lastName: 'Markkanen', team: 'Utah Jazz', teamAbbr: 'UTA', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['lauri markkanen', 'markkanen'] },
  { id: 'NBA_manual_collin_sexton', name: 'Collin Sexton', firstName: 'Collin', lastName: 'Sexton', team: 'Utah Jazz', teamAbbr: 'UTA', position: 'PG', sport: 'NBA', headshot: '', searchTerms: ['collin sexton', 'sexton'] },
  
  // New Orleans Pelicans
  { id: 'NBA_manual_zion_williamson', name: 'Zion Williamson', firstName: 'Zion', lastName: 'Williamson', team: 'New Orleans Pelicans', teamAbbr: 'NOP', position: 'PF', sport: 'NBA', headshot: '', searchTerms: ['zion williamson', 'zion', 'williamson'] },
  { id: 'NBA_manual_brandon_ingram', name: 'Brandon Ingram', firstName: 'Brandon', lastName: 'Ingram', team: 'New Orleans Pelicans', teamAbbr: 'NOP', position: 'SF', sport: 'NBA', headshot: '', searchTerms: ['brandon ingram', 'ingram', 'bi'] }
];
