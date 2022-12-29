import { useState } from "react";
import { useParams } from "react-router-dom";


import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  List,
  Loader,
  Paper,
  Popover,
  Stack,
  Tabs,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconFileAnalytics,
  IconFileInfo,
  IconPencil,
  IconPlayerPlay,
  IconServer,
  IconTimeline,
  IconUser,
  IconUsers,
} from "@tabler/icons";

import { Scoreboard } from "../../../demo";

export function ScoreboardTable({ scoreboard }: { scoreboard: Scoreboard }) {
	return (
		<div>
			<table className="scoreboard" style={{ width: "100%" }}>
				<thead>
					{/* No headers */}
				</thead>
				<tbody>
					<tr>
						<td>Kills:</td>
						<td>{ scoreboard.kills }</td>
						<td>Captures:</td>
						<td>{ scoreboard.captures }</td>
						<td>Invulns:</td>
						<td>{ scoreboard.ubercharges }</td>
						<td>Backstabs:</td>
						<td>{ scoreboard.backstabs }</td>
					</tr>

					<tr>
						<td>Deaths:</td>
						<td>{ scoreboard.deaths }</td>
						<td>Defenses:</td>
						<td>{ scoreboard.defenses }</td>
						<td>Headshots:</td>
						<td>{ scoreboard.headshots }</td>
						<td>Bonus:</td>
						<td>{ scoreboard.bonus_points }</td>
					</tr>

					<tr>
						<td>Assists:</td>
						<td>{ scoreboard.assists }</td>
						<td>Domination:</td>
						<td>{ scoreboard.dominations }</td>
						<td>Teleports:</td>
						<td>{ scoreboard.teleports }</td>
						<td>Support:</td>
						<td>{ scoreboard.support }</td>
					</tr>

					<tr>
						<td>Destruction:</td>
						<td>{ scoreboard.buildings_destroyed }</td>
						<td>Revenge:</td>
						<td>{ scoreboard.revenges }</td>
						<td>Healing:</td>
						<td>{ scoreboard.healing }</td>
						<td>Damage:</td>
						<td>{ scoreboard.damage_dealt }</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
