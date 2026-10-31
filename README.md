# Digital Archaeologist

An interactive retro-computer investigation game built with vanilla JavaScript, HTML, and CSS.

Explore a recovered computer system, navigate its virtual file system, uncover hidden documents, and decrypt restricted archives to reveal the truth behind a mysterious experiment.

## Features

- **Virtual File System:** Navigate directories and explore documents through terminal commands.
- **Interactive Terminal:** Execute commands such as `help`, `ls`, `cd`, `cat`, `pwd`, and `history`.
- **Investigation Gameplay:** Discover clues hidden in system logs, diaries, and classified reports.
- **Decryption Mechanics:** Unlock restricted archives using passwords discovered during exploration.
- **Progress Persistence:** Automatically save investigation progress using LocalStorage.
- **Retro CRT Interface:** Experience a green monochrome terminal inspired by 1990s computers.
- **Responsive Design:** Play on desktop and mobile devices.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- DOM Manipulation
- LocalStorage API

## Getting Started

### Prerequisites

A modern web browser and a code editor such as Visual Studio Code.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/digital-archaeologist.git
   ```

2. Navigate to the project directory:

   ```bash
   cd digital-archaeologist
   ```

3. Open `index.html` in your browser, or use the Live Server extension in Visual Studio Code.

## Available Commands

| Command | Description |
|---|---|
| `help` | Display available commands |
| `ls` | List files and directories |
| `cd <directory>` | Navigate to a directory |
| `pwd` | Display the current directory |
| `cat <file>` | Read a file |
| `decrypt <password>` | Unlock restricted archives |
| `history` | Display previously executed commands |
| `clear` | Clear the terminal output |

## Gameplay

Your investigation begins with access to a recovered computer system.

Explore its directories, read documents, examine system logs, and piece together the events surrounding Project Nightfall.

Some archives are restricted. Search for clues and discover the passwords required to access them.

## Project Structure

```text
digital-archaeologist/
├── index.html
├── style.css
└── script.js
```

## Future Improvements

- Additional investigation scenarios and multiple endings.
- More advanced file system interactions.
- Command autocomplete and keyboard navigation.
- Sound effects and enhanced CRT visual effects.
- Improved puzzle mechanics and hidden commands.
- Modular JavaScript architecture and automated tests.

## License

This project is open source and available under the MIT License.
