const output = document.querySelector("#output");
const form = document.querySelector("#command-form");
const input = document.querySelector("#command");
const promptLabel = document.querySelector("#prompt");

const memoryLabel = document.querySelector("#memory");
const archiveLabel = document.querySelector("#archive");
const clockLabel = document.querySelector("#clock");

const SAVE_KEY = "digital-archaeologist-save-v2";

// Sistema de arquivos virtual
const fileSystem = {
  name: "C:",
  type: "directory",
  children: {
    documents: {
      name: "documents",
      type: "directory",
      children: {
        "diary.txt": {
          name: "diary.txt",
          type: "file",
          content: `November 4, 1997

The experiment has gone wrong.

Dr. Morgan ordered everyone to leave
the laboratory.

I have hidden the access code inside
the system logs.

If someone finds this, do not trust
the official report.`
        },

        "report.txt": {
          name: "report.txt",
          type: "file",
          content: `PROJECT NIGHTFALL
CLASSIFIED REPORT

The experiment was designed to preserve
human memory in digital form.

At 03:17, the system began recording
memories that did not belong to
any registered subject.`
        }
      }
    },

    logs: {
      name: "logs",
      type: "directory",
      children: {
        "system.log": {
          name: "system.log",
          type: "file",
          content: `03:12 - Experiment initialized.
03:14 - Neural interface connected.
03:17 - UNKNOWN MEMORY DETECTED.
03:18 - Security lockdown initiated.
03:20 - Access code fragment: NIGHTFALL`
        },

        "security.log": {
          name: "security.log",
          type: "file",
          content: `SECURITY RECORD

User: ADMIN
Last login: 1997-11-04 03:15

Unauthorized access detected.
Administrator account locked.`
        }
      }
    },

    restricted: {
      name: "restricted",
      type: "directory",
      locked: true,
      password: "NIGHTFALL",
      children: {
        "truth.txt": {
          name: "truth.txt",
          type: "file",
          content: `FINAL RECORD

The experiment did not preserve
the memories of its participants.

It copied them.

The system is still running.
And something inside it remembers you.`
        }
      }
    }
  }
};

// Estado do jogo
let currentDirectory = fileSystem;
let path = ["C:"];
let history = [];
let unlockedFiles = new Set();
let discoveredClues = new Set();

function print(text, type = "") {
  const line = document.createElement("pre");
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function saveGame() {
  const save = {
    unlockedFiles: [...unlockedFiles],
    discoveredClues: [...discoveredClues]
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  updateStatus();
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));

    if (!saved) return;

    unlockedFiles = new Set(saved.unlockedFiles || []);
    discoveredClues = new Set(saved.discoveredClues || []);
  } catch {
    print("Save file corrupted. Starting new session.", "error");
  }
}

function updateStatus() {
  memoryLabel.textContent =
    `${Math.min(discoveredClues.size * 20, 100)}%`;

  archiveLabel.textContent =
    `${unlockedFiles.size}/5`;
}

function updatePrompt() {
  promptLabel.textContent = `${path.join("\\")} >`;
}

function findNode(target, directory = fileSystem) {
  if (directory.name.toLowerCase() === target.toLowerCase()) {
    return directory;
  }

  if (directory.type !== "directory") return null;

  for (const child of Object.values(directory.children)) {
    const result = findNode(target, child);
    if (result) return result;
  }

  return null;
}

function resolvePath(target) {
  if (!target || target === ".") return currentDirectory;

  if (target === "..") {
    return currentDirectory.parent || fileSystem;
  }

  const parts = target.split(/[\\/]/).filter(Boolean);
  let node = target.startsWith("C:") ? fileSystem : currentDirectory;

  for (const part of parts) {
    if (part === "C:") continue;

    if (part === ".") continue;

    if (part === "..") {
      node = node.parent || fileSystem;
      continue;
    }

    if (node.type !== "directory") return null;

    const next = Object.values(node.children).find(
      child => child.name.toLowerCase() === part.toLowerCase()
    );

    if (!next) return null;

    if (next.locked && !unlockedFiles.has(next.name)) {
      return null;
    }

    node = next;
  }

  return node;
}

// Liga os diretórios aos seus pais para permitir navegação
function connectParents(directory) {
  if (directory.type !== "directory") return;

  for (const child of Object.values(directory.children)) {
    child.parent = directory;

    if (child.type === "directory") {
      connectParents(child);
    }
  }
}

connectParents(fileSystem);

function execute(command) {
  const trimmed = command.trim();
  if (!trimmed) return;

  history.push(trimmed);

  const [name, ...args] = trimmed.split(/\s+/);
  const argument = args.join(" ");

  switch (name.toLowerCase()) {
    case "help":
      print(`AVAILABLE COMMANDS

help             Show commands
ls               List directory contents
cd <directory>   Change directory
pwd              Show current path
cat <file>       Read a file
decrypt <code>   Unlock restricted archive
history          Show command history
clear            Clear terminal
`);
      break;

    case "ls": {
      if (currentDirectory.type !== "directory") {
        print("Not a directory.", "error");
        break;
      }

      const entries = Object.values(currentDirectory.children)
        .map(node => node.type === "directory"
          ? `[DIR]  ${node.name}`
          : `[FILE] ${node.name}`);

      print(entries.join("\n") || "Directory is empty.");
      break;
    }

    case "pwd":
      print(path.join("\\"));
      break;

    case "cd": {
      const destination = resolvePath(argument);

      if (!destination || destination.type !== "directory") {
        print("Directory not found or access denied.", "error");
        break;
      }

      currentDirectory = destination;

      path = [];
      let node = destination;

      while (node) {
        path.unshift(node.name);
        node = node.parent;
      }

      updatePrompt();
      break;
    }

    case "cat": {
      const file = resolvePath(argument);

      if (!file || file.type !== "file") {
        print("File not found or access denied.", "error");
        break;
      }

      print(file.content, "system");

      if (!discoveredClues.has(file.name)) {
        discoveredClues.add(file.name);
        saveGame();
      }

      break;
    }

    case "decrypt": {
      const code = argument.toUpperCase();

      if (code === "NIGHTFALL") {
        unlockedFiles.add("restricted");
        print("ACCESS GRANTED. Restricted archive unlocked.", "system");
        saveGame();
      } else {
        print("ACCESS DENIED. Invalid decryption key.", "error");
      }

      break;
    }

    case "history":
      print(history.map((cmd, i) => `${i + 1}. ${cmd}`).join("\n"));
      break;

    case "clear":
      output.replaceChildren();
      break;

    default:
      print(`Unknown command: ${name}. Type 'help'.`, "error");
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const command = input.value;

  print(`${path.join("\\")}> ${command}`);
  execute(command);

  input.value = "";
  input.focus();
});

function updateClock() {
  clockLabel.textContent = new Date().toLocaleTimeString("en-US", {
    hour12: false
  });
}

loadGame();
updateStatus();
updatePrompt();
updateClock();
setInterval(updateClock, 1000);

print("DIGITAL ARCHAEOLOGIST v2.0", "system");
print("System recovered. User: unknown");
print("Type 'help' to begin investigation.");