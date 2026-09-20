import React, { useState, useCallback } from 'react';
import { uniqueId } from '../utils/utils.ts';
import { EmptyState, ArrowLeftIcon } from '../components.tsx';

interface Player {
    id: string;
    name: string;
    score: number;
}

interface GameScorerViewProps {
    onBack: () => void;
}

const PlayerScoreCard: React.FC<{ 
    player: Player;
    onScoreChange: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}> = ({ player, onScoreChange, onRemove }) => {
    const [pointsToAdd, setPointsToAdd] = useState('');

    const handleAddPoints = (e: React.FormEvent) => {
        e.preventDefault();
        const points = parseInt(pointsToAdd, 10);
        if (!isNaN(points)) {
            onScoreChange(player.id, points);
            setPointsToAdd('');
        }
    };

    return (
        <div className="list-item">
            <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2em' }}>{player.name}</h4>
                <p style={{ margin: 0, fontSize: '2em', fontWeight: 'bold' }}>{player.score}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn" style={{width: '50px'}} onClick={() => onScoreChange(player.id, 1)}>+1</button>
                    <button className="btn btn-secondary" style={{width: '50px'}} onClick={() => onScoreChange(player.id, -1)}>-1</button>
                </div>
                <form onSubmit={handleAddPoints} style={{ display: 'flex', gap: '5px' }}>
                    <input
                        type='number'
                        value={pointsToAdd}
                        onChange={e => setPointsToAdd(e.target.value)}
                        style={{ width: '70px' }}
                        placeholder='+ pts'
                    />
                    <button type='submit' className="btn w-auto">Add</button>
                </form>
                <button className="btn btn-danger w-auto" onClick={() => onRemove(player.id)}>Remove</button>
            </div>
        </div>
    );
};


export default function GameScorerView({ onBack }: GameScorerViewProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            setPlayers(prev => [...prev, { id: uniqueId(), name: newPlayerName.trim(), score: 0 }]);
            setNewPlayerName('');
        }
    };

    const handleScoreChange = useCallback((id: string, delta: number) => {
        setPlayers(prev =>
            prev.map(p => (p.id === id ? { ...p, score: Math.max(0, p.score + delta) } : p))
        );
    }, []);

    const handleRemovePlayer = useCallback((id: string) => {
        if (window.confirm("Are you sure you want to remove this player?")) {
            setPlayers(prev => prev.filter(p => p.id !== id));
        }
    }, []);
    
    const handleResetScores = useCallback(() => {
         if (window.confirm("Are you sure you want to reset all scores to 0?")) {
            setPlayers(prev => prev.map(p => ({...p, score: 0})));
        }
    }, []);
    
    const handleNewGame = useCallback(() => {
        if (window.confirm("Are you sure you want to start a new game? This will clear all players and scores.")) {
            setPlayers([]);
        }
    }, []);

    return (
        <div className="page">
             <header className="header">
                 <button className="back-button" onClick={onBack} aria-label="Back to The Locker Room">
                    <ArrowLeftIcon />
                </button>
                <h2>🎲 Game Scorer</h2>
                <div className="header-placeholder" />
            </header>
            <main className="main">
                 <section className="card">
                    <h3>Game Setup</h3>
                    <form onSubmit={handleAddPlayer} className="flex gap-2">
                        <input
                            className="flex-grow"
                            value={newPlayerName}
                            onChange={e => setNewPlayerName(e.target.value)}
                            placeholder="Enter player or team name"
                        />
                        <button type='submit' className="btn w-auto">Add Player</button>
                    </form>
                    {players.length > 0 && (
                        <div className="flex gap-2 mt-20">
                             <button className="btn btn-secondary flex-grow" onClick={handleResetScores}>Reset Scores</button>
                             <button className="btn btn-danger flex-grow" onClick={handleNewGame}>New Game</button>
                        </div>
                    )}
                </section>

                <section className="card">
                     <h3>Scoreboard</h3>
                     {players.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {players.map(p => (
                                <PlayerScoreCard 
                                    key={p.id} 
                                    player={p}
                                    onScoreChange={handleScoreChange}
                                    onRemove={handleRemovePlayer} 
                                />
                            ))}
                        </div>
                     ) : (
                        <EmptyState
                            icon="🏆"
                            title="No Players Yet"
                            message="Add some players or teams above to start keeping score!"
                        />
                     )}
                </section>
            </main>
        </div>
    );
}