import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../AppContext.tsx';
import { ArrowLeftIcon } from '../components.tsx';

export default function FantasyFootballView() {
    const { onNavigate } = useAppDispatch();
    const { fantasyLeagues } = useAppState();
    const [selectedLeagueId, setSelectedLeagueId] = useState(fantasyLeagues[0]?.id || null);

    const activeLeague = fantasyLeagues.find(l => l.id === selectedLeagueId);

    return (
        <div className="page">
            <header className="header">
                 <button className="back-button" onClick={() => onNavigate('lockerRoom')}>
                    <ArrowLeftIcon />
                </button>
                <h2>🏈 Fantasy Football</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                <section className="card">
                    <h3>Standings</h3>
                    {activeLeague ? (
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{borderBottom: '1px solid var(--border)'}}>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Team</th>
                                    <th style={{padding: '8px', textAlign: 'right'}}>W-L</th>
                                </tr>
                            </thead>
                            <tbody> 
                                {activeLeague.teams.sort((a,b) => b.wins - a.wins).map(team => (
                                    <tr key={team.id} style={{borderBottom: '1px solid var(--border)'}}>
                                        <td style={{padding: '8px'}}>{team.teamName}</td>
                                        <td style={{padding: '8px', textAlign: 'right'}}>{`${team.wins}-${team.losses}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No active league.</p>}
                </section>
            </main>
        </div>
    );
}