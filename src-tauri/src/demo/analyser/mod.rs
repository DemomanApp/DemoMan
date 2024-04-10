mod custom_damage;
mod damage_flag;
mod player_condition;
mod player_flag;
mod weapon_class;

use std::{cmp::Ordering, collections::HashMap, convert::TryFrom, str::FromStr};

use log::{info, trace, warn};
use num_derive::FromPrimitive;
use num_traits::FromPrimitive;
use serde::{Deserialize, Serialize};

use steamid_ng::SteamID;
use tf_demo_parser::{
    demo::{
        data::{DemoTick, ServerTick},
        gameevent_gen::{
            CrossbowHealEvent, PlayerConnectClientEvent, PlayerDeathEvent, PlayerDisconnectEvent,
            PlayerHurtEvent, PlayerSpawnEvent, PlayerTeamEvent, TeamPlayPointCapturedEvent,
            TeamPlayRoundStalemateEvent, TeamPlayRoundStartEvent, TeamPlayRoundWinEvent,
        },
        gamevent::GameEvent,
        header::Header,
        message::{
            gameevent::GameEventMessage,
            packetentities::{EntityId, PacketEntity},
            usermessage::UserMessage,
            Message,
        },
        packet::{
            datatable::{ParseSendTable, ServerClass, ServerClassName},
            stringtable::StringTableEntry,
        },
        parser::{
            analyser::{Class, Team, UserId},
            MessageHandler,
        },
        sendprop::SendPropIdentifier,
    },
    MessageType, ParserState, Stream,
};

pub use custom_damage::CustomDamage;
pub use damage_flag::DamageFlag;
pub use player_condition::PlayerCondition;
pub use weapon_class::WeaponClass;

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize, PartialEq, FromPrimitive)]
pub enum PlayerLifeState {
    #[default]
    Alive = 0,
    Dying = 1,
    Death = 2,
    Respawnable = 3,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct HighlightEvent {
    tick: DemoTick,
    event: Highlight,
}

/// Snapshot of a player at the time a highlight occurred so highlights will display using the
/// correct team colors.
#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct HighlightPlayerSnapshot {
    /// The ID of the player.
    user_id: UserId,

    /// The name of the player at the time the highlight occurred.
    name: String,

    /// What team the player was on at the time.
    /// NOTE: This can sometimes be Team::Other (probably when an m_iTeam update is missing)
    team: Team,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub enum Highlight {
    Kill {
        killer: HighlightPlayerSnapshot,
        assister: Option<HighlightPlayerSnapshot>,
        victim: HighlightPlayerSnapshot,
        weapon: String,
        kill_icon: String,
        streak: usize,
        drop: bool,
        airshot: bool,
    },
    KillStreak {
        player: HighlightPlayerSnapshot,
        streak: u16,
    },
    KillStreakEnded {
        killer: HighlightPlayerSnapshot,
        victim: HighlightPlayerSnapshot,
        streak: u16,
    },
    ChatMessage {
        sender: HighlightPlayerSnapshot,
        text: String,
    },
    Airshot {
        attacker: HighlightPlayerSnapshot,
        victim: HighlightPlayerSnapshot,
    },
    CrossbowAirshot {
        healer: HighlightPlayerSnapshot,
        target: HighlightPlayerSnapshot,
    },
    PointCaptured {
        point_name: String,
        capturing_team: u8,
        cappers: Vec<UserId>, // snapshots aren't needed since we already know the team as part of the event
    },
    RoundStalemate {
        reason: u8,
    },
    RoundStart {
        full_reset: bool,
    },
    RoundWin {
        winner: u8,
        // TODO: Win reason?
    },
    PlayerConnected {
        user_id: UserId, // can't use snapshots here because there's no team yet
    },
    PlayerDisconnected {
        user_id: UserId,
        reason: String,
    },
    Pause {
        pause: bool,
    },
    // TODO:
    // Multikill?
    // Midair kills?
    // Flicks?
}

#[derive(Default, Debug, Deserialize, Serialize, PartialEq)]
pub struct GameSummary {
    pub local_user_id: UserId,
    pub highlights: Vec<HighlightEvent>,
    pub red_team_score: u32,
    pub blue_team_score: u32,
    pub interval_per_tick: f32,
    pub num_rounds: u32,
    pub players: Vec<PlayerSummary>,
}

/**
 * Generic scoreboard struct. This is used to track the current scores for a single player.
 */
#[derive(Debug, Serialize, Deserialize, PartialEq, Default, Clone)]
pub struct Scoreboard {
    pub points: u32,
    pub kills: u32,
    pub assists: u32,
    pub deaths: u32,
    pub buildings_destroyed: u32,
    pub captures: u32,
    pub defenses: u32,
    pub dominations: u32,
    pub revenges: u32,
    pub ubercharges: u32,
    pub headshots: u32,
    pub teleports: u32,
    pub healing: u32,
    pub backstabs: u32,
    pub bonus_points: u32,
    pub support: u32,
    pub damage_dealt: u32,
}

#[derive(Debug, Default)]
pub struct PlayerState {
    name: String,
    steam_id: u64,
    user_id: UserId,

    team: Team,

    /// The scoreboard for the entire match
    scoreboard: Scoreboard,

    /// Per-round scoreboards
    round_scoreboards: HashMap<u32, Scoreboard>,

    // Temporary state data
    class: Class,
    life_state: PlayerLifeState,
    charge: u8,

    player_cond: u32,
    player_cond_ex: u32,
    player_cond_ex2: u32,
    player_cond_ex3: u32,

    // The same as `player_cond`.
    // For some reason, only TF_COND_CRITBOOSTED is stored
    // in this variable (bit 11), everything else is in player_cond.
    condition_bits: u32,

    // TODO use server tick instead,
    // demo ticks continue running while the game is paused,
    // making the class play durations inaccurate
    last_spawn_tick: Option<DemoTick>,
    time_on_class: [usize; 9],
}

#[allow(dead_code)]
impl PlayerState {
    pub fn has_cond(&self, cond: PlayerCondition) -> bool {
        let cond = cond as u32;
        if cond < 32 {
            // All conditions with index <32 are stored in `player_cond`,
            // except for TF_COND_CRITBOOSTED, which is stored in bit 11
            // of `condition_bits`.
            ((self.player_cond | self.condition_bits) & (1 << cond)) != 0
        } else if cond < 64 {
            (self.player_cond_ex & (1 << (cond - 32))) != 0
        } else if cond < 96 {
            (self.player_cond_ex2 & (1 << (cond - 64))) != 0
        } else if cond < 128 {
            (self.player_cond_ex3 & (1 << (cond - 96))) != 0
        } else {
            false
        }
    }

    fn format_conditions(&self) -> Vec<PlayerCondition> {
        let mut conditions = Vec::new();
        for i in 0..128u32 {
            if let Some(cond) = PlayerCondition::from_u32(i) {
                if self.has_cond(cond) {
                    conditions.push(cond);
                }
            }
        }
        conditions
    }

    fn handle_life_end(&mut self, tick: DemoTick) {
        if self.class != Class::Other {
            if let Some(last_spawn_tick) = self.last_spawn_tick {
                self.time_on_class[(self.class as usize) - 1] +=
                    u32::from(tick - last_spawn_tick) as usize;
            }
        }

        // Prevent this life from contributing to class playtime a
        // second time, for example by dying after a round ended
        self.last_spawn_tick = None;
    }
}

#[derive(Debug, Default, Deserialize, Serialize, PartialEq)]
pub struct PlayerSummary {
    name: String,
    steam_id: u64,
    user_id: UserId,

    team: Team,
    time_on_class: [usize; 9],

    /// The scoreboard for the entire match
    scoreboard: Scoreboard,

    /// Per-round scoreboards
    round_scoreboards: HashMap<u32, Scoreboard>,
}

impl From<PlayerState> for PlayerSummary {
    fn from(state: PlayerState) -> Self {
        let PlayerState {
            name,
            steam_id,
            user_id,
            team,
            scoreboard,
            round_scoreboards,
            time_on_class,
            ..
        } = state;

        Self {
            name,
            steam_id,
            user_id,
            team,
            time_on_class,
            scoreboard,
            round_scoreboards,
        }
    }
}

#[derive(Default, Debug)]
pub struct GameDetailsAnalyser {
    highlights: Vec<HighlightEvent>,
    interval_per_tick: f32,
    is_stv: bool,
    players: HashMap<UserId, PlayerState>,
    /// indexed by `ClassId`
    class_names: Vec<ServerClassName>,
    mediguns: HashMap<u32, EntityId>,
    red_team_entity_id: EntityId,
    blue_team_entity_id: EntityId,
    red_team_score: u32,
    blue_team_score: u32,
    local_entity_id: EntityId,

    /// The current round being played.  Increments while parsing
    current_round: u32,

    server_tick: ServerTick,
    demo_tick: DemoTick,

    player_entities: HashMap<EntityId, UserId>,
}

impl MessageHandler for GameDetailsAnalyser {
    type Output = GameSummary;

    fn does_handle(message_type: MessageType) -> bool {
        matches!(
            message_type,
            MessageType::PacketEntities
                | MessageType::GameEvent
                | MessageType::SetPause
                | MessageType::ServerInfo
                | MessageType::UserMessage
                | MessageType::NetTick
        )
    }

    fn handle_message(&mut self, message: &Message, tick: DemoTick, parser_state: &ParserState) {
        self.demo_tick = tick;
        match message {
            Message::NetTick(message) => {
                self.server_tick = message.tick;
            }
            Message::PacketEntities(message) => {
                for entity in &message.entities {
                    self.handle_entity(entity, parser_state);
                }
            }
            Message::GameEvent(GameEventMessage { event, .. }) => {
                self.handle_game_event(event);
            }
            Message::UserMessage(message) => {
                self.handle_usermessage(message);
            }
            Message::SetPause(message) => {
                self.add_highlight(Highlight::Pause {
                    pause: message.pause,
                });
            }
            Message::ServerInfo(message) => {
                self.local_entity_id = EntityId::from(u32::from(message.player_slot) + 1);
                self.interval_per_tick = message.interval_per_tick;
            }
            _ => {}
        }
    }

    fn handle_string_entry(
        &mut self,
        table: &str,
        index: usize,
        entry: &StringTableEntry,
        _parser_state: &ParserState,
    ) {
        if table == "userinfo" {
            self.parse_user_info(
                index,
                entry.text.as_ref().map(AsRef::as_ref),
                entry.extra_data.as_ref().map(|data| data.data.clone()),
            );
        }
    }

    fn handle_data_tables(
        &mut self,
        _parse_tables: &[ParseSendTable],
        server_classes: &[ServerClass],
        _parser_state: &ParserState,
    ) {
        self.class_names = server_classes
            .iter()
            .map(|class| &class.name)
            .cloned()
            .collect();
    }

    fn handle_header(&mut self, header: &Header) {
        // STV demos have an empty server field in their header
        self.is_stv = header.server.is_empty();
    }

    fn into_output(self, _state: &ParserState) -> Self::Output {
        Self::Output {
            local_user_id: *self
                .player_entities
                .get(&self.local_entity_id)
                .unwrap_or(&UserId::default()),
            highlights: self.highlights,
            red_team_score: self.red_team_score,
            blue_team_score: self.blue_team_score,
            interval_per_tick: self.interval_per_tick,
            players: self
                .players
                .into_values()
                .map(PlayerSummary::from)
                .collect(),
            num_rounds: self.current_round,
        }
    }
}

// Macro to help with parsing scoreboard properties.  The logic is the same for each property,
// just with a different attribute name.  This makes it easier to manage all 16+ score attributes
macro_rules! process_score_prop {
    ($prop: expr, $name: ident, $player: expr, $current_round: expr) => {
        {
            let $name = i64::try_from(&$prop.value).unwrap_or_default() as u32;

            // Compare the value on the packet with the value on the match scoreboard
            // (which is the maximum received value)
            match $name.cmp(&$player.scoreboard.$name) {
                Ordering::Less => {
                    // Less than the match score
                    // Since match scores can never decrease, this property is guaranteed to be for the current round
                    $player.round_scoreboards.entry($current_round).or_default().$name = $name;
                },
                Ordering::Greater => {
                    // More than the current value for the entire match, which guarantees it's
                    // for the player's global scoreboard
                    $player.scoreboard.$name = $name;
                    if $current_round == 0 ||
                        !$player.round_scoreboards.iter().any(|(round, scoreboard)| *round < $current_round && scoreboard.$name > 0) {
                        // The player had no values for this property in any previous round,
                        // which means this value is ALSO the value for the current round
                        $player.round_scoreboards.entry($current_round).or_default().$name = $name;
                    } else {
                        // The player had a nonzero score for this property in at least one previous
                        // round, which means that the score for this round MUST be less than the match score
                    }
                },
                Ordering::Equal => {
                    // Same value as the match scoreboard.  Don't bother updating it.
                    if $current_round == 0 ||
                        !$player.round_scoreboards.iter().any(|(round, scoreboard)| *round < $current_round && scoreboard.$name > 0) {
                        // Same value as the match score, but the player had no values for this
                        // property in any previous round, which means this value is the value for the current round
                        $player.round_scoreboards.entry($current_round).or_default().$name = $name;
                    } else {
                        // The player had a nonzero score for this property in at least one previous
                        // round, which means that the score for this round MUST be less than the match score
                    }
                }
            }
        }
    }
}

impl GameDetailsAnalyser {
    fn add_highlight(&mut self, event: Highlight) {
        let tick = self.demo_tick;
        self.highlights.push(HighlightEvent { tick, event });
    }

    // fn get_player_of_entity(&self, entity_id: &EntityId) -> Option<&PlayerState> {
    //     self.player_entities.get(entity_id).and_then(|user_id| self.players.get(user_id))
    // }

    fn get_player_of_entity_mut(&mut self, entity_id: EntityId) -> Option<&mut PlayerState> {
        self.player_entities
            .get(&entity_id)
            .and_then(|user_id| self.players.get_mut(user_id))
    }

    pub fn handle_entity(&mut self, entity: &PacketEntity, parser_state: &ParserState) {
        let class_name: &str = self
            .class_names
            .get(usize::from(entity.server_class))
            .map_or("", ServerClassName::as_str);
        match class_name {
            "CTFPlayer" => self.handle_player_entity(entity, parser_state),
            "CTFPlayerResource" => self.handle_player_resource(entity, parser_state),
            "CTFTeam" => self.handle_team(entity, parser_state),
            "CWeaponMedigun" => self.handle_medigun(entity, parser_state),

            _ => {}
        }
    }

    pub fn handle_game_event(&mut self, event: &GameEvent) {
        match event {
            GameEvent::PlayerDeath(event) => {
                self.handle_player_death_event(event);
            }
            GameEvent::PlayerHurt(event) => {
                self.handle_player_hurt_event(event);
            }
            GameEvent::PlayerTeam(event) => {
                // Player changed teams (game assigned on join, manually changed, or autobalanced)
                self.handle_player_team_event(event);
            }
            GameEvent::PlayerSpawn(event) => {
                self.handle_player_spawn_event(event);
            }
            GameEvent::TeamPlayRoundStalemate(event) => {
                self.handle_round_stalemate_event(event);
                self.handle_round_end();
            }
            GameEvent::TeamPlayRoundStart(event) => {
                self.handle_round_start_event(event);
            }
            GameEvent::TeamPlayRoundWin(event) => {
                self.handle_round_win_event(event);
                self.handle_round_end();
            }
            GameEvent::PlayerConnectClient(event) => {
                self.handle_player_connect_event(event);
            }
            GameEvent::PlayerDisconnect(event) => {
                self.handle_player_disconnect_event(event);
            }
            GameEvent::TeamPlayPointCaptured(event) => {
                self.handle_point_captured_event(event);
            }
            GameEvent::CrossbowHeal(event) => {
                self.handle_crossbow_heal_event(event);
            }
            _ => {}
        }
    }

    fn handle_usermessage(&mut self, message: &UserMessage) {
        if let UserMessage::SayText2(message) = message {
            let player_id = self
                .player_entities
                .get(&message.client)
                .copied()
                .unwrap_or_default();

            self.add_highlight(Highlight::ChatMessage {
                sender: self.player_snapshot(player_id),
                text: message.plain_text(),
            });
        }
    }

    pub fn handle_player_resource(&mut self, entity: &PacketEntity, parser_state: &ParserState) {
        for prop in entity.props(parser_state) {
            if let Some((table_name, prop_name)) = prop.identifier.names() {
                if let Ok(entity_id) = u32::from_str(prop_name.as_str()) {
                    if let Some(player) = self.get_player_of_entity_mut(EntityId::from(entity_id)) {
                        #[allow(clippy::match_same_arms)]
                        match table_name.as_str() {
                            "m_iTeam" => {
                                let new_team =
                                    Team::new(i64::try_from(&prop.value).unwrap_or_default());

                                player.team = new_team;
                            }
                            // We currently use player spawn events as our source of truth
                            // for determining the current player class. This is a second
                            // possible method to determine the player class, which does *not*
                            // always match with the first method.
                            // TODO: Investigate what the differences are,
                            //       maybe one is better than the other?
                            // "m_iPlayerClass" => {
                            //     player.class =
                            //         Class::new(i64::try_from(&prop.value).unwrap_or_default());
                            // }
                            "m_iChargeLevel" => {
                                // This is only networked in tournament mode
                                // player.charge = i64
                                //     ::try_from(&prop.value)
                                //     .unwrap_or_default() as u8;
                            }
                            _ => {}
                        }
                    }
                }
            }
        }
    }

    #[allow(clippy::too_many_lines)]
    pub fn handle_player_entity(&mut self, entity: &PacketEntity, parser_state: &ParserState) {
        let current_round = self.current_round;

        if let Some(player) = self.get_player_of_entity_mut(entity.entity_index) {
            const LIFE_STATE_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_BasePlayer", "m_lifeState");

            // Player conditions
            const PLAYER_COND_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerShared", "m_nPlayerCond");
            const PLAYER_COND_EX_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerShared", "m_nPlayerCondEx");
            const PLAYER_COND_EX2_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerShared", "m_nPlayerCondEx2");
            const PLAYER_COND_EX3_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerShared", "m_nPlayerCondEx3");
            const PLAYER_CONDITION_BITS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerConditionListExclusive", "_condition_bits");

            // Properties for tracking per-player scoreboard information.
            // NOTE: These tables are actually called m_ScoreData and m_RoundScoreData, encoded
            // as DT_TFPlayerScoringDataExclusive structures.  The parser uses the data struct name
            // instead of the table name in the props it gives us (it may be encoded that way in
            // the raw packet, which would be unfortunate).  This makes it tricky to determine which
            // props correspond to m_ScoreData table and which correspond to the m_RoundScoreData
            // table.  The current implementation compares the values with the currently tracked
            // scoreboard information, and if it's a larger value it's probably the match-specific
            // data.  If it's less than the currently known match data, it'll be for the round
            // because scoreboard data can never decrease
            //
            // NOTE: some game modes DO subtract deaths from the points total,
            // but I don't care enough about that to bother checking for it
            const CAPTURES_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iCaptures");
            const DEFENSES_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iDefenses");
            const KILLS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iKills");
            const DEATHS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iDeaths");
            const DOMINATIONS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iDominations");
            const REVENGE_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iRevenge");
            const BUILDINGS_DESTROYED_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iBuildingsDestroyed");
            const HEADSHOTS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iHeadshots");
            const BACKSTABS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iBackstabs");
            const HEAL_POINTS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iHealPoints");
            const INVULNS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iInvulns");
            const TELEPORTS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iTeleports");
            const DAMAGE_DONE_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iDamageDone");
            const KILL_ASSISTS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iKillAssists");
            const BONUS_POINTS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iBonusPoints");
            const POINTS_PROP: SendPropIdentifier =
                SendPropIdentifier::new("DT_TFPlayerScoringDataExclusive", "m_iPoints");

            for prop in entity.props(parser_state) {
                #[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation)]
                match prop.identifier {
                    LIFE_STATE_PROP => {
                        player.life_state = PlayerLifeState::from_i64(
                            i64::try_from(&prop.value).unwrap_or_default(),
                        )
                        .unwrap_or_default();
                    }
                    PLAYER_COND_PROP => {
                        player.player_cond = i64::try_from(&prop.value).unwrap_or_default() as u32;
                    }
                    PLAYER_COND_EX_PROP => {
                        player.player_cond_ex =
                            i64::try_from(&prop.value).unwrap_or_default() as u32;
                    }
                    PLAYER_COND_EX2_PROP => {
                        player.player_cond_ex2 =
                            i64::try_from(&prop.value).unwrap_or_default() as u32;
                    }
                    PLAYER_COND_EX3_PROP => {
                        player.player_cond_ex3 =
                            i64::try_from(&prop.value).unwrap_or_default() as u32;
                    }
                    PLAYER_CONDITION_BITS_PROP => {
                        player.condition_bits =
                            i64::try_from(&prop.value).unwrap_or_default() as u32;
                    }
                    CAPTURES_PROP => {
                        process_score_prop!(prop, captures, player, current_round);
                    }
                    DEFENSES_PROP => {
                        process_score_prop!(prop, defenses, player, current_round);
                    }
                    KILLS_PROP => {
                        process_score_prop!(prop, kills, player, current_round);
                    }
                    DEATHS_PROP => {
                        process_score_prop!(prop, deaths, player, current_round);
                    }
                    DOMINATIONS_PROP => {
                        process_score_prop!(prop, dominations, player, current_round);
                    }
                    REVENGE_PROP => {
                        process_score_prop!(prop, revenges, player, current_round);
                    }
                    BUILDINGS_DESTROYED_PROP => {
                        process_score_prop!(prop, buildings_destroyed, player, current_round);
                    }
                    HEADSHOTS_PROP => {
                        process_score_prop!(prop, headshots, player, current_round);
                    }
                    BACKSTABS_PROP => {
                        process_score_prop!(prop, backstabs, player, current_round);
                    }
                    HEAL_POINTS_PROP => {
                        process_score_prop!(prop, healing, player, current_round);
                    }
                    INVULNS_PROP => {
                        process_score_prop!(prop, ubercharges, player, current_round);
                    }
                    TELEPORTS_PROP => {
                        process_score_prop!(prop, teleports, player, current_round);
                    }
                    DAMAGE_DONE_PROP => {
                        process_score_prop!(prop, damage_dealt, player, current_round);
                    }
                    KILL_ASSISTS_PROP => {
                        process_score_prop!(prop, assists, player, current_round);
                    }
                    BONUS_POINTS_PROP => {
                        process_score_prop!(prop, bonus_points, player, current_round);
                    }
                    POINTS_PROP => {
                        process_score_prop!(prop, points, player, current_round);
                    }
                    _ => {}
                }
            }
        } else {
            info!("player not known in handle_player_entity");
        }
    }

    fn handle_medigun(&mut self, entity: &PacketEntity, parser_state: &ParserState) {
        const CHARGE_PROP: SendPropIdentifier =
            SendPropIdentifier::new("DT_TFWeaponMedigunDataNonLocal", "m_flChargeLevel");
        const LOCAL_CHARGE_PROP: SendPropIdentifier =
            SendPropIdentifier::new("DT_LocalTFWeaponMedigunData", "m_flChargeLevel");
        const OWNER_PROP: SendPropIdentifier =
            SendPropIdentifier::new("DT_BaseCombatWeapon", "m_hOwner");

        for prop in entity.props(parser_state) {
            #[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation)]
            match prop.identifier {
                CHARGE_PROP | LOCAL_CHARGE_PROP => {
                    let charge = f32::try_from(&prop.value).unwrap_or_default();
                    if let Some(owner_id) = self.mediguns.get(&entity.entity_index.into()).copied()
                    {
                        if let Some(owner) = self.get_player_of_entity_mut(owner_id) {
                            owner.charge = (charge * 100.0).round() as u8;
                        }
                    }
                }
                OWNER_PROP => {
                    let owner_id = u32::from(i64::try_from(&prop.value).unwrap_or_default() as u8);
                    if self.mediguns.get(&entity.entity_index.into()).is_none() {
                        self.mediguns
                            .insert(entity.entity_index.into(), EntityId::from(owner_id));
                    }
                }
                _ => {}
            }
        }
    }

    fn handle_team(&mut self, entity: &PacketEntity, parser_state: &ParserState) {
        const TEAM_NUM_PROP: SendPropIdentifier = SendPropIdentifier::new("DT_Team", "m_iTeamNum");
        const TEAM_SCORE_PROP: SendPropIdentifier = SendPropIdentifier::new("DT_Team", "m_iScore");

        for prop in entity.props(parser_state) {
            #[allow(clippy::cast_sign_loss, clippy::cast_possible_truncation)]
            match prop.identifier {
                TEAM_NUM_PROP => {
                    let team_num = i64::try_from(&prop.value).unwrap_or_default() as u8;

                    match Team::try_from(team_num).unwrap_or(Team::Other) {
                        Team::Red => {
                            self.red_team_entity_id = entity.entity_index;
                        }
                        Team::Blue => {
                            self.blue_team_entity_id = entity.entity_index;
                        }
                        _ => {}
                    }
                }
                TEAM_SCORE_PROP => {
                    let score = i64::try_from(&prop.value).unwrap_or_default() as u32;
                    if entity.entity_index == self.red_team_entity_id {
                        self.red_team_score = score;
                    } else if entity.entity_index == self.blue_team_entity_id {
                        self.blue_team_score = score;
                    }
                }
                _ => {}
            }
        }
    }

    fn parse_user_info(&mut self, index: usize, text: Option<&str>, data: Option<Stream>) {
        let Ok(index) = index.try_into() else {
            warn!("Index out of bounds in parse_user_info");
            return;
        };
        if let Ok(Some(user_info)) =
            tf_demo_parser::demo::data::UserInfo::parse_from_string_table(index, text, data)
        {
            // Remember who this player entity belongs to.
            // If a player leaves and someone else joins,
            // the new player can get the EntityId previously
            // used by the player who left.
            self.player_entities
                .insert(user_info.entity_id, user_info.player_info.user_id);

            // Remember this user's name/steamID
            let player = self
                .players
                .entry(user_info.player_info.user_id)
                .or_default();

            player.name = user_info.player_info.name;
            player.steam_id = SteamID::from_steam3(&user_info.player_info.steam_id)
                .unwrap_or_default()
                .into();
            player.user_id = user_info.player_info.user_id;
        }
    }

    fn handle_player_team_event(&mut self, event: &PlayerTeamEvent) {
        let player_id = event.user_id;

        if let Ok(team) = Team::try_from(event.team) {
            if let Some(player) = self.players.get_mut(&player_id.into()) {
                player.team = team;
            }
        }
    }

    fn handle_player_hurt_event(&mut self, event: &PlayerHurtEvent) {
        let victim_id = UserId::from(event.user_id);
        let attacker_id = UserId::from(event.attacker);

        let victim = self.players.get(&victim_id).expect("failed to find victim");

        let weapon = WeaponClass::from_u16(event.weapon_id).unwrap_or_default();

        if
        // In POV demos, only record airshots performed by the local player.
        (self.is_stv ||
                self.player_entities.get(&self.local_entity_id) == Some(&attacker_id)) &&
            // Victim is currently blastjumping
            victim.has_cond(PlayerCondition::TF_COND_BLASTJUMPING) &&
            victim_id != attacker_id &&
            // Only count hits with certain weapons
            matches!(
                weapon,
                WeaponClass::TF_WEAPON_ROCKETLAUNCHER |
                    WeaponClass::TF_WEAPON_ROCKETLAUNCHER_DIRECTHIT |
                    WeaponClass::TF_WEAPON_PARTICLE_CANNON | // Cow mangler
                    WeaponClass::TF_WEAPON_GRENADELAUNCHER |
                    WeaponClass::TF_WEAPON_CANNON | // Loose cannon
                    WeaponClass::TF_WEAPON_CROSSBOW
            )
        {
            self.add_highlight(Highlight::Airshot {
                attacker: self.player_snapshot(attacker_id),
                victim: self.player_snapshot(victim_id),
            });
        }
    }

    // TODO: refactor to remove the following line
    #[allow(clippy::too_many_lines)]
    fn handle_player_death_event(&mut self, event: &PlayerDeathEvent) {
        let killer_id = UserId::from(event.attacker);
        let maybe_assister_id = if event.assister == u16::MAX {
            None
        } else {
            Some(UserId::from(event.assister))
        };
        let victim_id = UserId::from(event.user_id);

        let victim = self.players.get_mut(&victim_id);

        let drop: bool;
        let airshot: bool;

        if let Some(victim) = victim {
            drop = victim.charge == 100;
            airshot = victim.has_cond(PlayerCondition::TF_COND_BLASTJUMPING);
            victim.handle_life_end(self.demo_tick);
        } else {
            drop = false;
            airshot = false;
        }

        let mut kill_icon = event.weapon.as_ref();
        let mut killer_name_override: Option<String> = None;

        // Substitute the kill icon according to the kill flags, if necessary.
        if let Some(custom_kill) = CustomDamage::from_u16(event.custom_kill) {
            match custom_kill {
                CustomDamage::TF_DMG_CUSTOM_BACKSTAB => {
                    if kill_icon == "sharp_dresser" {
                        kill_icon = "sharp_dresser_backstab";
                    } else {
                        kill_icon = "backstab";
                    }
                }
                CustomDamage::TF_DMG_CUSTOM_HEADSHOT
                | CustomDamage::TF_DMG_CUSTOM_HEADSHOT_DECAPITATION => {
                    if kill_icon == "ambassador" {
                        kill_icon = "ambassador_headshot";
                    } else if kill_icon == "huntsman" {
                        kill_icon = "huntsman_headshot";
                    } else if event.player_penetrate_count > 0 {
                        kill_icon = "headshot_player_penetration";
                    } else {
                        kill_icon = "headshot";
                    }
                }
                CustomDamage::TF_DMG_CUSTOM_BURNING => {
                    if killer_id == victim_id {
                        kill_icon = "firedeath";
                    }
                }
                CustomDamage::TF_DMG_CUSTOM_BURNING_ARROW => {
                    kill_icon = "huntsman_burning";
                }
                CustomDamage::TF_DMG_CUSTOM_FLYINGBURN => {
                    kill_icon = "huntsman_flyingburn";
                }
                CustomDamage::TF_DMG_CUSTOM_PUMPKIN_BOMB => {
                    kill_icon = "pumpkindeath";
                }
                // This value is only given to custom_kill if
                // 1) The player uses a killbind to suicide or
                // 2) The player kills himself, with another
                //    player being awarded the kill because of
                //    recent damage.
                CustomDamage::TF_DMG_CUSTOM_SUICIDE => {
                    if killer_id == victim_id {
                        kill_icon = "#suicide";
                    } else {
                        kill_icon = "#assisted_suicide";
                    }
                }
                CustomDamage::TF_DMG_CUSTOM_EYEBALL_ROCKET => {
                    if killer_id == 0 {
                        killer_name_override = Some("MONOCULUS!".into());
                    }
                }
                CustomDamage::TF_DMG_CUSTOM_MERASMUS_ZAP
                | CustomDamage::TF_DMG_CUSTOM_MERASMUS_GRENADE
                | CustomDamage::TF_DMG_CUSTOM_MERASMUS_DECAPITATION => {
                    if killer_id == 0 {
                        killer_name_override = Some("MERASMUS!".into());
                    }
                }
                CustomDamage::TF_DMG_CUSTOM_SPELL_SKELETON => {
                    if killer_id == 0 {
                        killer_name_override = Some("SKELETON".into());
                    }
                }
                CustomDamage::TF_DMG_CUSTOM_KART => {
                    kill_icon = "bumper_kart";
                }
                CustomDamage::TF_DMG_CUSTOM_GIANT_HAMMER => {
                    kill_icon = "necro_smasher";
                }
                _ => {}
            }
        }

        // Special cases of suicides
        if killer_id == 0 || killer_id == victim_id {
            if (event.damage_bits & DamageFlag::DMG_FALL.bitmask()) != 0 {
                kill_icon = "#fall";
            }
            // Don't ask.
            if (event.damage_bits & DamageFlag::DMG_NERVEGAS.bitmask()) != 0 {
                kill_icon = "saw_kill";
            }
            if (event.damage_bits & DamageFlag::DMG_VEHICLE.bitmask()) != 0 {
                kill_icon = "vehicle";
            }
        }

        self.add_highlight(Highlight::Kill {
            killer: self.player_snapshot_with_name(killer_id, killer_name_override),
            assister: maybe_assister_id.map(|assister_id| self.player_snapshot(assister_id)),
            victim: self.player_snapshot(victim_id),
            weapon: event.weapon.to_string(),
            kill_icon: kill_icon.to_string(),
            streak: event.kill_streak_total as usize,
            drop,
            airshot,
        });

        if event.kill_streak_total > 0 && event.kill_streak_total % 5 == 0 {
            self.add_highlight(Highlight::KillStreak {
                player: self.player_snapshot(killer_id),
                streak: event.kill_streak_total,
            });
        }

        // Note: kill_streak_assist is only incremented when a medic gets an assist while their
        // medigun is active (which isn't always when their heal target gets a kill!)
        if event.kill_streak_assist > 0 && event.kill_streak_assist % 5 == 0 {
            if let Some(assister_id) = maybe_assister_id {
                if self.players.contains_key(&assister_id) {
                    self.add_highlight(Highlight::KillStreak {
                        player: self.player_snapshot(assister_id),
                        streak: event.kill_streak_assist,
                    });
                }
            }
        }

        if event.kill_streak_victim >= 10 {
            self.add_highlight(Highlight::KillStreakEnded {
                killer: self.player_snapshot(killer_id),
                victim: self.player_snapshot(victim_id),
                streak: event.kill_streak_victim,
            });
        }
    }

    fn handle_crossbow_heal_event(&mut self, event: &CrossbowHealEvent) {
        // This event seems to only be present in STV demos.
        // Also, the UserIds in the event use u8s instead of u16s,
        // which will cause attribution errors.

        // TODO: reconsider if we need this at all.

        let target_id = UserId::from(u16::from(event.target));

        if let Some(target_player) = self.players.get(&target_id) {
            if target_player.has_cond(PlayerCondition::TF_COND_BLASTJUMPING) {
                self.add_highlight(Highlight::CrossbowAirshot {
                    healer: self.player_snapshot(UserId::from(u16::from(event.healer))),
                    target: self.player_snapshot(UserId::from(u16::from(event.target))),
                });
            }
        }
    }

    fn handle_player_spawn_event(&mut self, event: &PlayerSpawnEvent) {
        if let Some(player) = self.players.get_mut(&UserId::from(event.user_id)) {
            player.class = Class::new(event.class);
            player.last_spawn_tick = Some(self.demo_tick);
        }
    }

    fn handle_round_stalemate_event(&mut self, event: &TeamPlayRoundStalemateEvent) {
        self.add_highlight(Highlight::RoundStalemate {
            reason: event.reason,
        });
    }

    fn handle_round_start_event(&mut self, event: &TeamPlayRoundStartEvent) {
        self.add_highlight(Highlight::RoundStart {
            full_reset: event.full_reset,
        });
    }

    fn handle_round_win_event(&mut self, event: &TeamPlayRoundWinEvent) {
        self.add_highlight(Highlight::RoundWin { winner: event.team });
    }

    fn handle_round_end(&mut self) {
        self.current_round += 1;
        for player in self.players.values_mut() {
            if player.life_state == PlayerLifeState::Alive {
                player.handle_life_end(self.demo_tick);
            }
        }
    }

    fn handle_point_captured_event(&mut self, event: &TeamPlayPointCapturedEvent) {
        // No more than 8 players are recorded in the `cappers`
        // field of the teamplay_point_captured event.
        let mut cappers = Vec::with_capacity(8);

        for capper_entity_id in event.cappers.as_bytes() {
            let capper_entity_id = EntityId::from(*capper_entity_id as usize);
            if let Some(capper_user_id) = self.player_entities.get(&capper_entity_id) {
                cappers.push(*capper_user_id);
            }
        }

        self.add_highlight(Highlight::PointCaptured {
            point_name: event.cp_name.to_string(),
            capturing_team: event.team,
            cappers,
        });
    }

    fn handle_player_connect_event(&mut self, event: &PlayerConnectClientEvent) {
        self.add_highlight(Highlight::PlayerConnected {
            user_id: UserId::from(event.user_id),
        });
    }

    fn handle_player_disconnect_event(&mut self, event: &PlayerDisconnectEvent) {
        let user_id = UserId::from(event.user_id);
        self.add_highlight(Highlight::PlayerDisconnected {
            user_id,
            reason: event.reason.to_string(),
        });

        if let Some(player) = self.players.get_mut(&user_id) {
            player.handle_life_end(self.demo_tick);
        }
    }

    /// Creates a snapshot for a player with the given user ID.
    fn player_snapshot(&self, user_id: UserId) -> HighlightPlayerSnapshot {
        self.player_snapshot_with_name(user_id, None)
    }

    /// Creates a snapshot for a player with the given user ID and an optional specified name.
    /// If a name isn't provided, the player's current name will be taken from the current demo
    /// state.
    fn player_snapshot_with_name(
        &self,
        user_id: UserId,
        name_override: Option<String>,
    ) -> HighlightPlayerSnapshot {
        match self.players.get(&user_id) {
            Some(player) => HighlightPlayerSnapshot {
                user_id: player.user_id,
                name: name_override.unwrap_or_else(|| player.name.clone()),
                team: player.team,
            },
            None => {
                // Most likely UserId(0)
                HighlightPlayerSnapshot {
                    user_id,
                    name: name_override.unwrap_or_else(|| {
                        if user_id == 0 {
                            "WORLD".to_string()
                        } else {
                            "<unknown>".to_string()
                        }
                    }),
                    team: Team::Other,
                }
            }
        }
    }
}

#[test]
fn test_parser() {
    let fallback_path: String = "src/tests/data/demos/test_demo.dem".into();
    let args: Vec<String> = std::env::args().collect();
    let path = args
        .iter()
        .enumerate()
        .find(|(_index, arg)| *arg == "--path")
        .and_then(|(index, _arg)| args.get(index + 1))
        .unwrap_or(&fallback_path);
    let file = std::fs::read(path).expect("Failed to read file");
    let demo = tf_demo_parser::Demo::new(&file);
    let parser = tf_demo_parser::DemoParser::new_all_with_analyser(
        demo.get_stream(),
        GameDetailsAnalyser::default(),
    );
    let (header, state) = parser.parse().expect("Parsing failed");
    println!("HEADER: {header:#?}\nSTATE: {state:#?}");
}

#[test]
fn test_bincode() {
    let fallback_path: String = "src/tests/data/demos/test_demo.dem".into();
    let args: Vec<String> = std::env::args().collect();
    let path = args
        .iter()
        .enumerate()
        .find(|(_index, arg)| *arg == "--path")
        .and_then(|(index, _arg)| args.get(index + 1))
        .unwrap_or(&fallback_path);
    let file = std::fs::read(path).expect("Failed to read file");
    let demo = tf_demo_parser::Demo::new(&file);
    let parser = tf_demo_parser::DemoParser::new_all_with_analyser(
        demo.get_stream(),
        GameDetailsAnalyser::default(),
    );
    let (_header, state) = parser.parse().expect("Parsing failed");

    let bytes = bincode::serialize(&state).unwrap();
    let decoded: GameSummary = bincode::deserialize(&bytes).unwrap();

    assert_eq!(decoded, state);
}
