import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';

const TOURNAMENT = {
  name: 'PGL Major Copenhagen 2024',
  game: 'CS2',
  dates: '17–31 Березня 2024',
  prizePool: '$1,250,000',
};

const BRACKET = {
  quarterFinals: [
    {
      id: 'qf1',
      team1: {
        name: 'Natus Vincere',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Natus_Vincere_Logo.png',
        score: 2,
        country: '🇺🇦',
      },
      team2: {
        name: 'Team Liquid',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Team_Liquid_logo.png',
        score: 0,
        country: '🇺🇸',
      },
      winner: 1,
      status: 'finished',
    },
    {
      id: 'qf2',
      team1: {
        name: 'Team Vitality',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Team_Vitality_Logo.svg/1200px-Team_Vitality_Logo.svg.png',
        score: 2,
        country: '🇫🇷',
      },
      team2: {
        name: 'Astralis',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Astralis_logo.png',
        score: 1,
        country: '🇩🇰',
      },
      winner: 1,
      status: 'finished',
    },
    {
      id: 'qf3',
      team1: { name: 'FaZe Clan', logo: null, score: 2, country: '🌍' },
      team2: { name: 'G2 Esports', logo: null, score: 0, country: '🇪🇺' },
      winner: 1,
      status: 'finished',
    },
    {
      id: 'qf4',
      team1: { name: 'ENCE', logo: null, score: 1, country: '🇫🇮' },
      team2: { name: 'Spirit', logo: null, score: 2, country: '🇷🇺' },
      winner: 2,
      status: 'finished',
    },
  ],
  semiFinals: [
    {
      id: 'sf1',
      team1: {
        name: 'Natus Vincere',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Natus_Vincere_Logo.png',
        score: 2,
        country: '🇺🇦',
      },
      team2: {
        name: 'Team Vitality',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Team_Vitality_Logo.svg/1200px-Team_Vitality_Logo.svg.png',
        score: 1,
        country: '🇫🇷',
      },
      winner: 1,
      status: 'finished',
    },
    {
      id: 'sf2',
      team1: { name: 'FaZe Clan', logo: null, score: 0, country: '🌍' },
      team2: { name: 'Spirit', logo: null, score: 2, country: '🇷🇺' },
      winner: 2,
      status: 'finished',
    },
  ],
  grandFinal: {
    id: 'gf',
    team1: {
      name: 'Natus Vincere',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Natus_Vincere_Logo.png',
      score: 2,
      country: '🇺🇦',
    },
    team2: { name: 'Spirit', logo: null, score: 0, country: '🇷🇺' },
    winner: 1,
    status: 'finished',
  },
};

function MatchCard({ match, isHighlighted, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isUpcoming = match.status === 'upcoming';

  const TeamRow = ({ team, isWinner, side }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: isWinner ? 'rgba(168,0,255,0.08)' : 'transparent',
        borderLeft: isWinner ? '3px solid #a800ff' : '3px solid transparent',
        borderRadius: side === 'top' ? '8px 8px 0 0' : '0 0 8px 8px',
        transition: '0.2s',
        opacity: !isWinner && !isUpcoming ? 0.4 : 1,
      }}
    >
      {}
      <div style={{ width: '22px', height: '22px', flexShrink: 0 }}>
        {team.logo ? (
          <img
            src={team.logo}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : (
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '1px solid #222',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
            }}
          >
            {team.country}
          </div>
        )}
      </div>

      <span
        style={{
          flex: 1,
          fontSize: '0.75rem',
          fontWeight: isWinner ? 800 : 500,
          color: isWinner ? '#fff' : '#666',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100px',
        }}
      >
        {team.name}
      </span>

      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 900,
          color: isWinner ? '#a800ff' : '#333',
          minWidth: '16px',
          textAlign: 'right',
        }}
      >
        {isUpcoming ? '–' : team.score}
      </span>
    </div>
  );

  return (
    <div
      onClick={() => onClick && onClick(match)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#0a0a0a',
        border: `1px solid ${isHighlighted ? '#a800ff' : hovered ? '#2a2a2a' : '#141414'}`,
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isHighlighted
          ? '0 0 20px rgba(168,0,255,0.2)'
          : hovered
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : 'none',
        minWidth: '180px',
        overflow: 'hidden',
      }}
    >
      <TeamRow team={match.team1} isWinner={match.winner === 1} side="top" />
      <div style={{ height: '1px', background: '#111' }} />
      <TeamRow team={match.team2} isWinner={match.winner === 2} side="bottom" />
    </div>
  );
}

function RoundColumn({ title, matches, selectedId, onSelect, isFinal }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        minWidth: isFinal ? '200px' : '190px',
      }}
    >
      {}
      <div
        style={{
          fontSize: '0.6rem',
          fontWeight: 900,
          letterSpacing: '2px',
          color: isFinal ? '#a800ff' : '#333',
          textTransform: 'uppercase',
          marginBottom: '8px',
          padding: '4px 12px',
          border: isFinal ? '1px solid #a800ff33' : '1px solid #1a1a1a',
          borderRadius: '20px',
          background: isFinal ? 'rgba(168,0,255,0.05)' : 'transparent',
        }}
      >
        {title}
      </div>

      {}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isFinal ? '0' : '16px',
          justifyContent: 'space-around',
          flex: 1,
          width: '100%',
        }}
      >
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            isHighlighted={selectedId === match.id}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '32px', flexShrink: 0 }}>
      <div style={{ width: '100%', height: '1px', background: '#1a1a1a' }} />
    </div>
  );
}

function MatchDetail({ match, onClose }) {
  if (!match) return null;

  const winner = match.winner === 1 ? match.team1 : match.team2;
  const loser = match.winner === 1 ? match.team2 : match.team1;

  return (
    <div
      style={{
        background: '#070707',
        border: '1px solid #1a1a1a',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 900,
            letterSpacing: '2px',
            color: '#333',
            textTransform: 'uppercase',
          }}
        >
          ДЕТАЛІ МАТЧУ
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#333',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
        {}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '0.55rem',
              color: '#a800ff',
              fontWeight: 900,
              letterSpacing: '2px',
              marginBottom: '8px',
            }}
          >
            ПЕРЕМОЖЕЦЬ
          </div>
          {winner.logo && (
            <img
              src={winner.logo}
              alt=""
              style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '8px' }}
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#fff' }}>{winner.name}</div>
        </div>

        {}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '4px' }}>
            {match.team1.score} <span style={{ color: '#222' }}>:</span> {match.team2.score}
          </div>
          <div
            style={{ fontSize: '0.6rem', color: '#333', marginTop: '4px', letterSpacing: '1px' }}
          >
            {match.status === 'finished'
              ? 'ЗАВЕРШЕНО'
              : match.status === 'live'
                ? '● LIVE'
                : 'НЕЗАБАРОМ'}
          </div>
        </div>

        {}
        <div style={{ textAlign: 'center', opacity: 0.4 }}>
          <div
            style={{
              fontSize: '0.55rem',
              color: '#444',
              fontWeight: 900,
              letterSpacing: '2px',
              marginBottom: '8px',
            }}
          >
            ПРОГРАВ
          </div>
          {loser.logo && (
            <img
              src={loser.logo}
              alt=""
              style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '8px' }}
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
          <div style={{ fontWeight: 900, fontSize: '1rem', color: '#666' }}>{loser.name}</div>
        </div>
      </div>
    </div>
  );
}

export default function TournamentBracket() {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleSelect = (match) => {
    setSelectedMatch((prev) => (prev?.id === match.id ? null : match));
  };

  return (
    <PageLayout>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 600px) {
          .bracket-header h1 { font-size: 1.5rem !important; }
          .bracket-scroll-hint { display: flex !important; }
        }
      `}</style>
      <div style={{ padding: '2rem 0', animation: 'fadeUp 0.4s ease both' }}>
        {}
        <div className="bracket-header" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '2px',
                color: '#ff6b35',
                padding: '3px 10px',
                border: '1px solid #ff6b3544',
                borderRadius: '20px',
              }}
            >
              {TOURNAMENT.game}
            </span>
            <span style={{ fontSize: '0.6rem', color: '#333', letterSpacing: '1px' }}>
              {TOURNAMENT.dates}
            </span>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-1px',
            }}
          >
            {TOURNAMENT.name}
          </h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: '#a800ff', fontWeight: 700 }}>
              🏆 {TOURNAMENT.prizePool}
            </span>
          </div>
        </div>

        {}
        <div
          style={{
            background: '#040404',
            border: '1px solid #111',
            borderRadius: '20px',
            padding: '32px',
            overflowX: 'auto',
          }}
        >
          <div
            className="bracket-scroll-hint"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 6,
              color: '#333',
              fontSize: '0.65rem',
              marginBottom: 16,
            }}
          >
            <span>←</span> Прокрути для перегляду сітки <span>→</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', minWidth: '800px' }}>
            {}
            <RoundColumn
              title="Чвертьфінал"
              matches={BRACKET.quarterFinals}
              selectedId={selectedMatch?.id}
              onSelect={handleSelect}
            />

            <Connector />

            {}
            <RoundColumn
              title="Півфінал"
              matches={BRACKET.semiFinals}
              selectedId={selectedMatch?.id}
              onSelect={handleSelect}
            />

            <Connector />

            {}
            <RoundColumn
              title="🏆 Гранд Фінал"
              matches={[BRACKET.grandFinal]}
              selectedId={selectedMatch?.id}
              onSelect={handleSelect}
              isFinal
            />
          </div>
        </div>

        {}
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingLeft: '4px' }}>
          {[
            { color: '#a800ff', label: 'Переможець' },
            { color: '#333', label: 'Програв' },
            { color: '#ff6b35', label: 'Live' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }}
              />
              <span style={{ fontSize: '0.65rem', color: '#333' }}>{label}</span>
            </div>
          ))}
          <span style={{ fontSize: '0.65rem', color: '#222', marginLeft: 'auto' }}>
            Натисни на матч щоб побачити деталі
          </span>
        </div>

        {}
        {selectedMatch && (
          <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />
        )}
      </div>
    </PageLayout>
  );
}
