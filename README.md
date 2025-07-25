<img src="./public/logo-white.png" width="150">

# [LyingMan](https://lyingman.vercel.app)

LyingMan is a real-time social deduction game made possible with firebase realtime. Players join a room, receive secret words, and try to identify the imposter among them through clever descriptions and voting.

## Demo

<video src="https://github.com/user-attachments/assets/7209f167-245e-4a92-af77-e7ac9a1e9fed"></video>

## About
LyingMan (卧底) is a game my friends and I used to play back in school — thinking about it always brings back great memories of laughter and clever guesses. It wasn’t just a game; it was part of what made our school days so special, a simple joy that brought us closer together.

## Features

- **Real-time multiplayer:** Up to 8 players per room.
- **Secret roles:** All but one player receive the same word; one imposter gets a similar but different word.
- **Describe & deduce:** Each player describes their word in the chat—be subtle!
- **Voting:** After all descriptions, players vote for who they think is the imposter.
- **Rounds:** The game continues until the imposter is caught or only two players remain.
- **Responsive design:** Mobile and desktop friendly.
- **Automatic player removal:** Disconnected or eliminated players are removed from the game.

## How to Play

1. **Create or join a room** (minimum 4 players).
2. **Receive your secret word.** One player is the imposter with a different word.
3. **Describe your word** in the chat—try not to give it away!
4. **Vote** for who you think is the imposter.
5. **Elimination:** The player with the most votes is eliminated. If it’s a tie, no one is eliminated.
6. **Win conditions:**
   - If the imposter is eliminated, the others win.
   - If only two players remain and the imposter is still in, the imposter wins.
   - Otherwise, the game continues to the next round.

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/leecheeyong/LyingMan.git
   cd LyingMan
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable **Authentication** (Email/Password).
   - Set up **Cloud Firestore** in test mode (or with secured rules).
   - Edit the `src/firebase.js` file, replace with your Firebase credentials

## License

LyingMan is available as open source under the terms of the [MIT License](https://github.com/leecheeyong/LyingMan/blob/main/LICENSE).
