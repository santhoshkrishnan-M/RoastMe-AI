'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { useMultiplayerStore } from '@/store/multiplayerStore';

export function MultiplayerLobby() {
  const [roomCode, setRoomCode] = useState('');
  const [roastMessage, setRoastMessage] = useState('');
  const { createRoom, joinRoom, leaveRoom, sendRoast, error, players, roasts } = useMultiplayer();
  const { isInRoom, currentRoom, leaderboard } = useMultiplayerStore();

  const handleCreateRoom = () => {
    createRoom();
  };

  const handleJoinRoom = () => {
    if (roomCode.trim() && roomCode.length === 6) {
      joinRoom(roomCode.toUpperCase());
    }
  };

  const handleSendRoast = () => {
    if (roastMessage.trim()) {
      sendRoast(roastMessage);
      setRoastMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendRoast();
    }
  };

  if (!isInRoom) {
    return (
      <GlassCard className="space-y-6" glow>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Multiplayer Roast Battle</h2>
          <p className="text-text-secondary text-sm mt-1">Battle with friends in real-time!</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            className="w-full py-4 bg-gradient-primary text-white rounded-lg
                     font-medium hover:opacity-90 transition-opacity text-lg
                     shadow-lg shadow-primary/20"
          >
            🎮 Create New Room
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-text-secondary text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="ENTER CODE"
              maxLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                       text-text-primary placeholder-text-secondary text-center text-2xl
                       tracking-[0.3em] font-mono uppercase
                       focus:outline-none focus:border-secondary transition-colors"
            />
            <button
              onClick={handleJoinRoom}
              disabled={roomCode.length !== 6}
              className="w-full py-3 bg-secondary text-white rounded-lg
                       font-medium hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-secondary/20"
            >
              🚪 Join Room
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-text-secondary space-y-1">
          <p>• Real-time battles</p>
          <p>• AI-powered scoring</p>
          <p>• Live leaderboard</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <GlassCard className="space-y-4" glow>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Battle Room</h2>
            <p className="text-3xl font-mono tracking-[0.3em] text-secondary mt-1">
              {currentRoom?.roomCode}
            </p>
          </div>
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg
                     hover:bg-red-500/30 transition-colors border border-red-500/30"
          >
            Leave
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text-primary flex items-center justify-between">
            <span>Players ({players.length})</span>
            <span className="text-text-secondary text-xs">Live</span>
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {players.map((player, index) => (
                <motion.div
                  key={player.socketId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-2
                           border border-white/10"
                >
                  <span className="text-text-primary font-medium text-sm">{player.username}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-bold text-sm">
                      {player.score}
                    </span>
                    <span className="text-text-secondary text-xs">pts</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            value={roastMessage}
            onChange={(e) => setRoastMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your roast here... (Press Enter to send)"
            maxLength={200}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                     text-text-primary placeholder-text-secondary resize-none
                     focus:outline-none focus:border-primary transition-colors"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {roastMessage.length}/200
            </span>
            <button
              onClick={handleSendRoast}
              disabled={!roastMessage.trim()}
              className="px-6 py-2 bg-gradient-accent text-white rounded-lg
                       font-medium hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-accent/20"
            >
              🔥 Send Roast
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-3">
        <h3 className="text-lg font-bold text-text-primary">🔥 Battle Feed</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {roasts.slice().reverse().map((roast, index) => (
              <motion.div
                key={roast.timestamp}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary">
                    {roast.username}
                  </span>
                  <span className={`text-sm font-bold ${
                    roast.score >= 75 ? 'text-accent' : 
                    roast.score >= 50 ? 'text-secondary' : 
                    'text-text-secondary'
                  }`}>
                    +{roast.score}
                  </span>
                </div>
                <p className="text-text-primary text-sm">{roast.message}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {roasts.length === 0 && (
            <div className="text-center text-text-secondary py-8 text-sm">
              No roasts yet. Be the first to battle!
            </div>
          )}
        </div>
      </GlassCard>

      {leaderboard.length > 0 && (
        <GlassCard className="space-y-3">
          <h3 className="text-lg font-bold text-text-primary">🏆 Leaderboard</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-lg
                           border ${
                    index === 0 ? 'bg-accent/20 border-accent/50' :
                    index === 1 ? 'bg-secondary/20 border-secondary/50' :
                    index === 2 ? 'bg-primary/20 border-primary/50' :
                    'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xl font-bold ${
                      index === 0 ? 'text-accent' :
                      index === 1 ? 'text-secondary' :
                      index === 2 ? 'text-primary' :
                      'text-text-secondary'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${entry.rank}`}
                    </span>
                    <span className="text-text-primary font-medium">{entry.username}</span>
                  </div>
                  <span className="text-secondary font-bold text-lg">
                    {entry.score}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
