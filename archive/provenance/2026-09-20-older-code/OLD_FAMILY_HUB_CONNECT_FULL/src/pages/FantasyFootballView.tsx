import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { styles } from '../styles';
import type { FantasyLeague } from '../types';

export default function FantasyFootballView() {
    const { fantasyLeagues, addFantasyLeague, updateFantasyLeague } = useAppContext();
    const [selectedLeagueId, setSelectedLeagueId] = useState(fantasyLeagues[0]?.id || null);

    const activeLeague = fantasyLeagues.find(l => l.id === selectedLeagueId);

    return React.createElement('div', { style: styles.pageContainer },
        React.createElement('h2', { style: styles.pageHeader }, "🏈 Fantasy Football"),
        
        React.createElement('section', { style: styles.section },
            React.createElement('h3', { style: styles.sectionTitle }, 'Standings'),
            activeLeague ? (
                React.createElement('table', {style: {width: '100%'}},
                    React.createElement('thead', null, React.createElement('tr', null, React.createElement('th', null, 'Team'), React.createElement('th', null, 'W-L'))),
                    React.createElement('tbody', null, 
                        activeLeague.teams.sort((a,b) => b.wins - a.wins).map(team => (
                            React.createElement('tr', {key: team.id}, React.createElement('td', null, team.teamName), React.createElement('td', null, `${team.wins}-${team.losses}`))
                        ))
                    )
                )
            ) : React.createElement('p', null, "No active league.")
        )
    );
}
