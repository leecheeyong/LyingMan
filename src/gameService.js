import { database } from "./firebase.js";
import {
  ref,
  push,
  set,
  get,
  onValue,
  off,
  serverTimestamp,
  onDisconnect,
} from "firebase/database";
import { generateRoomCode, generatePlayerId } from "./gameUtils.js";

export class GameService {
  constructor() {
    this.currentRoom = localStorage.getItem("currentRoom") || null;
    this.currentPlayer = localStorage.getItem("currentPlayer") || null;
    this.listeners = new Map();
  }

  async createRoom(hostName) {
    const roomCode = generateRoomCode();
    const playerId = generatePlayerId();

    const roomData = {
      code: roomCode,
      host: playerId,
      players: {
        [playerId]: {
          id: playerId,
          name: hostName,
          isHost: true,
          joinedAt: serverTimestamp(),
        },
      },
      gameState: {
        status: "waiting",
        round: 0,
        roles: {},
      },
      createdAt: serverTimestamp(),
    };

    const roomRef = ref(database, `rooms/${roomCode}`);
    await set(roomRef, roomData);

    this.currentRoom = roomCode;
    this.currentPlayer = playerId;
    localStorage.setItem("currentRoom", roomCode);
    localStorage.setItem("currentPlayer", playerId);

    return { roomCode, playerId };
  }

  async joinRoom(roomCode, playerName) {
    const roomRef = ref(database, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }

    const playerId = generatePlayerId();
    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);

    await set(playerRef, {
      id: playerId,
      name: playerName,
      isHost: false,
      joinedAt: serverTimestamp(),
    });
    await onDisconnect(playerRef).remove();

    this.currentRoom = roomCode;
    this.currentPlayer = playerId;
    localStorage.setItem("currentRoom", roomCode);
    localStorage.setItem("currentPlayer", playerId);

    return { roomCode, playerId };
  }

  async getRoomData(roomCode) {
    const roomRef = ref(database, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      throw new Error("Room not found");
    }

    return snapshot.val();
  }

  listenToRoom(roomCode, callback) {
    const roomRef = ref(database, `rooms/${roomCode}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });

    this.listeners.set(roomCode, unsubscribe);
    return unsubscribe;
  }

  stopListening(roomCode) {
    const unsubscribe = this.listeners.get(roomCode);
    if (unsubscribe) {
      off(ref(database, `rooms/${roomCode}`), "value", unsubscribe);
      this.listeners.delete(roomCode);
    }
  }

  async leaveRoom(roomCode, playerId) {
    if (!roomCode || !playerId) return;

    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
    await set(playerRef, null);

    this.currentRoom = null;
    this.currentPlayer = null;
    localStorage.removeItem("currentRoom");
    localStorage.removeItem("currentPlayer");
    this.stopListening(roomCode);
  }

  async startGame(roomCode, starterId) {
    const wordPairs = [
      ["apple", "orange"],
      ["cat", "dog"],
      ["sun", "moon"],
      ["coffee", "tea"],
      ["beach", "mountain"],
      ["mom", "girlfriend"],
      ["car", "motorcycle"],
      ["summer", "winter"],
      ["pizza", "burger"],
      ["book", "movie"],
      ["blanket", "towel"],
      ["banana", "mango"],
      ["teacher", "principal"],
      ["watch", "clock"],
      ["mountain", "hill"],
      ["mirror", "camera"],
      ["subway", "tram"],
      ["cookie", "biscuit"],
      ["bat", "owl"],
      ["notebook", "diary"],
      ["glove", "mitten"],
      ["river", "lake"],
      ["eraser", "sharpener"],
      ["tent", "cabin"],
      ["pilot", "astronaut"],
      ["ghost", "zombie"],
      ["cloud", "fog"],
      ["ladder", "stairs"],
      ["detective", "spy"],
      ["wallet", "purse"],
      ["airplane", "helicopter"],
      ["soccer", "basketball"],
      ["lion", "tiger"],
      ["pen", "pencil"],
      ["school", "office"],
      ["city", "village"],
      ["iPhone", "Android"],
      ["rain", "snow"],
      ["robot", "alien"],
      ["Instagram", "TikTok"],
      ["shirt", "jacket"],
      ["rice", "noodles"],
      ["train", "bus"],
      ["knife", "scissors"],
      ["glasses", "contact lenses"],
      ["YouTube", "Netflix"],
      ["parent", "teacher"],
      ["pirate", "ninja"],
      ["cow", "goat"],
      ["earth", "mars"],
      ["milk", "juice"],
      ["fork", "spoon"],
      ["cake", "ice cream"],
      ["bathroom", "kitchen"],
      ["spider", "ant"],
      ["gold", "silver"],
      ["violin", "guitar"],
      ["mirror", "window"],
      ["bank", "post office"],
      ["police", "firefighter"],
    ];
    const roomRef = ref(database, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) throw new Error("Room not found");
    const room = snapshot.val();
    const playerIds = Object.keys(room.players);
    if (playerIds.length < 4) throw new Error("At least 4 players required");

    const pair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
    const [mainWord, imposterWord] = pair;
    const shuffled = playerIds.sort(() => Math.random() - 0.5);
    const imposterIndex = Math.floor(Math.random() * playerIds.length);
    const roles = {};
    shuffled.forEach((id, idx) => {
      const playerName = room.players[id]?.name || id;
      roles[id] = {
        word: idx === imposterIndex ? imposterWord : mainWord,
        isImposter: idx === imposterIndex,
        name: playerName,
      };
    });

    await set(ref(database, `rooms/${roomCode}/gameState`), {
      status: "describing",
      round: (room.gameState?.round || 0) + 1,
      roles,
      votes: {},
      timerStartedAt: Date.now(),
      wordPair: pair,
    });
    const starterName = room.players[starterId]?.name || starterId;
    const chatRef = ref(database, `rooms/${roomCode}/chat`);
    await push(chatRef, {
      name: "System",
      text: `${starterName} started the game`,
      timestamp: Date.now(),
      playerId: "system",
    });
  }

  async sendChat(roomCode, message) {
    const playerId = this.getCurrentPlayer();
    if (!playerId) {
      console.error("No playerId found, cannot send chat");
      return;
    }
    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
    const playerSnap = await get(playerRef);
    if (!playerSnap.exists()) {
      console.warn("Eliminated player tried to send chat");
      return;
    }
    const playerName =
      (await get(ref(database, `rooms/${roomCode}/players/${playerId}`))).val()
        ?.name || "Unknown";
    const chatRef = ref(database, `rooms/${roomCode}/chat`);
    const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
    const gameStateSnap = await get(gameStateRef);
    if (!gameStateSnap.exists()) return;
    const gameState = gameStateSnap.val();
    const described = gameState.described || {};
    described[playerId] = true;
    await set(gameStateRef, { ...gameState, described });
    try {
      console.log("Attempting to send message:", message);
      await push(chatRef, {
        name: playerName,
        text: message,
        timestamp: Date.now(),
        playerId,
      });
      console.log("Message sent to Firebase:", message);
    } catch (e) {
      console.error("Failed to send message to Firebase:", e);
    }
    const roomRef = ref(database, `rooms/${roomCode}`);
    const roomSnap = await get(roomRef);
    if (!roomSnap.exists()) return;
    const room = roomSnap.val();
    const alivePlayers = Object.keys(room.players);
    if (Object.keys(described).length >= alivePlayers.length) {
      await this.timerEnded(roomCode);
    }
  }

  getChatRef(roomCode) {
    return ref(database, `rooms/${roomCode}/chat`);
  }

  listenToChat(chatRef, callback) {
    const handler = onValue(chatRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((child) => {
        messages.push(child.val());
      });
      messages.sort((a, b) => a.timestamp - b.timestamp);
      console.log("Received chat messages from Firebase:", messages);
      callback(messages);
    });
    return () => off(chatRef, "value", handler);
  }

  getCurrentRoom() {
    return this.currentRoom;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  async validateCurrentPlayer(roomCode) {
    const playerId = this.getCurrentPlayer();
    if (!playerId) return false;
    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
    const snapshot = await get(playerRef);
    if (!snapshot.exists()) {
      localStorage.removeItem("currentRoom");
      localStorage.removeItem("currentPlayer");
      this.currentRoom = null;
      this.currentPlayer = null;
      return false;
    }
    return true;
  }

  async timerEnded(roomCode) {
    const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
    const chatRef = ref(database, `rooms/${roomCode}/chat`);
    const snapshot = await get(gameStateRef);
    if (!snapshot.exists()) return;
    const gameState = snapshot.val();
    await set(gameStateRef, { ...gameState, status: "voting" });
    await push(chatRef, {
      name: "System",
      text: `Round ${gameState.round} ends. Vote for the imposter!`,
      timestamp: Date.now(),
      playerId: "system",
    });
  }

  async vote(roomCode, votedId) {
    const playerId = this.getCurrentPlayer();
    if (!playerId) return;
    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
    const playerSnap = await get(playerRef);
    if (!playerSnap.exists()) {
      console.warn("Eliminated player tried to vote");
      return;
    }
    const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
    const chatRef = ref(database, `rooms/${roomCode}/chat`);
    const snapshot = await get(gameStateRef);
    if (!snapshot.exists()) return;
    const gameState = snapshot.val();
    const votes = gameState.votes || {};
    votes[playerId] = votedId;
    await set(gameStateRef, { ...gameState, votes });
    const voterName = gameState.roles?.[playerId]?.name || playerId;
    const votedName = gameState.roles?.[votedId]?.name || votedId;
    await push(chatRef, {
      name: "System",
      text: `${voterName} voted for ${votedName}`,
      timestamp: Date.now(),
      playerId: "system",
    });
    const roomRef = ref(database, `rooms/${roomCode}`);
    const roomSnap = await get(roomRef);
    if (!roomSnap.exists()) return;
    const room = roomSnap.val();
    const alivePlayers = Object.keys(room.players);
    if (Object.keys(votes).length < alivePlayers.length) return;
    const tally = {};
    Object.values(votes).forEach((id) => {
      tally[id] = (tally[id] || 0) + 1;
    });
    let eliminatedId = null;
    let maxVotes = 0;
    let maxVotedIds = [];
    Object.entries(tally).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        maxVotedIds = [id];
      } else if (count === maxVotes) {
        maxVotedIds.push(id);
      }
    });
    if (maxVotedIds.length > 1) {
      await push(chatRef, {
        name: "System",
        text: `The vote was a draw. No one was eliminated!`,
        timestamp: Date.now(),
        playerId: "system",
      });
      const alivePlayers = Object.keys(room.players);
      const newRoles = {};
      alivePlayers.forEach((id) => {
        newRoles[id] = gameState.roles[id];
      });
      await set(gameStateRef, {
        status: "describing",
        round: (gameState.round || 0) + 1,
        roles: newRoles,
        votes: {},
        described: {},
        timerStartedAt: Date.now(),
        wordPair: gameState.wordPair,
      });
      await push(chatRef, {
        name: "System",
        text: `Round ${(gameState.round || 0) + 1} begins! Describe your word again.`,
        timestamp: Date.now(),
        playerId: "system",
      });
      return;
    }
    eliminatedId = maxVotedIds[0];
    let updatedRoom = room;
    if (eliminatedId) {
      await set(
        ref(database, `rooms/${roomCode}/players/${eliminatedId}`),
        null,
      );
      await push(chatRef, {
        name: "System",
        text: `${room.players[eliminatedId]?.name || "A player"} was eliminated!`,
        timestamp: Date.now(),
        playerId: "system",
      });
      const updatedRoomSnap = await get(roomRef);
      if (!updatedRoomSnap.exists()) return;
      updatedRoom = updatedRoomSnap.val();
    }
    const remainingPlayers = Object.values(updatedRoom.players);
    const imposterId = Object.entries(gameState.roles).find(
      ([id, role]) => role.isImposter,
    )?.[0];
    const imposterAlive = remainingPlayers.some(
      (p) => p && p.id === imposterId,
    );
    if (!imposterAlive) {
      await set(gameStateRef, { ...gameState, status: "ended" });
      await push(chatRef, {
        name: "System",
        text: `The imposter was eliminated! The others win!`,
        timestamp: Date.now(),
        playerId: "system",
      });
    } else if (remainingPlayers.length === 2) {
      await set(gameStateRef, { ...gameState, status: "ended" });
      await push(chatRef, {
        name: "System",
        text: `The imposter survived until the end! The imposter wins!`,
        timestamp: Date.now(),
        playerId: "system",
      });
    } else {
      const alivePlayers = Object.keys(updatedRoom.players);
      const newRoles = {};
      alivePlayers.forEach((id) => {
        newRoles[id] = gameState.roles[id];
      });
      await set(gameStateRef, {
        status: "describing",
        round: (gameState.round || 0) + 1,
        roles: newRoles,
        votes: {},
        described: {},
        timerStartedAt: Date.now(),
        wordPair: gameState.wordPair,
      });
      await push(chatRef, {
        name: "System",
        text: `Round ${(gameState.round || 0) + 1} begins! Describe your word again.`,
        timestamp: Date.now(),
        playerId: "system",
      });
    }
  }
}

export const gameService = new GameService();
