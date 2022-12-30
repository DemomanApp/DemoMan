import React from "react";
import { Scoreboard, EMPTY_SCOREBOARD } from "../../../demo";

interface ScoreboardTableProps {
    scoreboard: Scoreboard;
}

interface ScoreboardTableState {
    scoreboard: Scoreboard
}

export default class ScoreboardTable extends React.Component<ScoreboardTableProps, ScoreboardTableState> {
    constructor(props: ScoreboardTableProps) {
        super(props);

        this.state = {
            scoreboard: props.scoreboard ?? EMPTY_SCOREBOARD
        };
    }

    setScoreboard(newScoreboard: Scoreboard) {
        this.setState({scoreboard: newScoreboard ?? EMPTY_SCOREBOARD});
    }

    render() {
        const scoreboard: Scoreboard = this.state.scoreboard;

        return (
            <div>
                <table className={ "scoreboard" }>
                    <thead>
                    {/* No headers */ }
                    </thead>
                    <tbody>
                    {/* Row 1: Kills|Captures|Invulns|Backstabs */ }
                    <tr>
                        <td className={ "score-label" }>
                            Kills:
                        </td>
                        <td className={ scoreboard.kills == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.kills }
                        </td>
                        <td className={ "score-label" }>
                            Captures:
                        </td>
                        <td className={ scoreboard.captures == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.captures }
                        </td>
                        <td className={ "score-label" }>
                            Invulns:
                        </td>
                        <td className={ scoreboard.ubercharges == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.ubercharges }
                        </td>
                        <td className={ "score-label" }>
                            Backstabs:
                        </td>
                        <td className={ scoreboard.backstabs == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.backstabs }
                        </td>
                    </tr>

                    {/* Row 2: Deaths|Defenses|Headshots|Bonus */ }
                    <tr>
                        <td className={ "score-label" }>
                            Deaths:
                        </td>
                        <td className={ scoreboard.deaths == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.deaths }
                        </td>
                        <td className={ "score-label" }>
                            Defenses:
                        </td>
                        <td className={ scoreboard.defenses == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.defenses }
                        </td>
                        <td className={ "score-label" }>
                            Headshots:
                        </td>
                        <td className={ scoreboard.headshots == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.headshots }
                        </td>
                        <td className={ "score-label" }>
                            Bonus:
                        </td>
                        <td className={ scoreboard.bonus_points == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.bonus_points }
                        </td>
                    </tr>

                    {/* Row 3: Assists|Domination|Teleports|Support */ }
                    <tr>
                        <td className={ "score-label" }>
                            Assists:
                        </td>
                        <td className={ scoreboard.assists == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.assists }
                        </td>
                        <td className={ "score-label" }>
                            Domination:
                        </td>
                        <td className={ scoreboard.dominations == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.dominations }
                        </td>
                        <td className={ "score-label" }>
                            Teleports:
                        </td>
                        <td className={ scoreboard.teleports == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.teleports }
                        </td>
                        <td className={ "score-label" }>
                            Support:
                        </td>
                        <td className={ scoreboard.support == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.support }
                        </td>
                    </tr>

                    {/* Row 4: Destruction|Revenge|Healing|Damage */ }
                    <tr>
                        <td className={ "score-label" }>
                            Destruction:
                        </td>
                        <td className={ scoreboard.buildings_destroyed == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.buildings_destroyed }
                        </td>
                        <td className={ "score-label" }>
                            Revenge:
                        </td>
                        <td className={ scoreboard.revenges == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.revenges }
                        </td>
                        <td className={ "score-label" }>
                            Healing:
                        </td>
                        <td className={ scoreboard.healing == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.healing }
                        </td>
                        <td className={ "score-label" }>
                            Damage:
                        </td>
                        <td className={ scoreboard.damage_dealt == 0 ? "score-value zero-score" : "score-value non-zero-score" }>
                            { scoreboard.damage_dealt }
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
