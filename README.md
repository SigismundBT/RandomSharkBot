# 🦈 RandomSharkBot

&#x20;  &#x20;

> 🚨 This is the final and latest version of RandomSharkBot. The project is no longer actively maintained, but remains available for reference and inspiration.

> ⚙️ This version is based on [RandomSharkBot V12](https://github.com/SigismundBT/RandomSharkBot-V12) with significant feature upgrades, improved structure, and updated libraries.

> A fully featured Discord bot originally developed for a \~100-member gaming server, where the developer also served as a co-admin. The bot initially featured full role and user onboarding automation in its v12 version. The birthday reminder system was later added based on a feature request by the server owner. The bot was hosted on Heroku and backed by Firebase.. Designed to automate birthday reminders, user onboarding, role management, and more — all backed by Firebase.

---

## 📌 Features

### 🤖 Auto Commands

- **Welcome Message** – Sends a message (with optional image) when a user joins.
- **Leave Message** – Sends a farewell message when a user leaves.
- **Join Role Assignment** – Auto-assigns roles to new members.
- **Reaction Role System** – Supports both custom and standard emojis. Automatically detects type.
- **Birthday Notifications** – Sends a daily birthday message.\
  ➔ Even when no members are celebrating today, the bot will still notify the server that there are no birthdays.
- **Remove Member Data** – Cleans up Firebase when a user leaves.

---

## 🛠️ Manual Commands

### For All Users:

- `!-生日列表` – Shows all upcoming birthdays
- `!-生日查詢(成員) @user` – Search birthday by member
- `!-生日查詢(日期) MM-DD` – Search birthday by date
- `!-設定生日 @user MM-DD` – Set birthday via command
- `!-生日登記網址 @user` – Opens a web-based birthday setting page

### Admin Only:

- `!=AddWelcomeImg <image URL>` / `!=RemoveWelcomeImg <image URL>` / `!=WelcomeImgList`
- `!=AddLeaveImg <image URL>` / `!=RemoveLeaveImg <image URL>` / `!=LeaveImgList`
  > 🖼️ Multiple images can be set; a random one is chosen each time
- `!=SetJoinRole <role>` / `!=RemoveJoinRole <role>` / `!=JoinRoles`
- `!=SetClaimRole <emoji> <role>` / `!=RemoveClaimRole <emoji>` / `!=ClaimRoles`
  > Supports both custom and standard emojis. Auto-detects type.
- `!=RestartBot` – Reboot the bot

### Channel Binding Commands:

- `!=SetBDAlarmCH` – Set birthday alarm channel
- `!=SetBDSetCH` – Set birthday setting command channel
- `!=SetRoleClaimCH` – Set Reaction Role channel
- `!=SetWelcomeMsgCH` – Set Welcome Message channel
- `!=SetLeaveMsgCH` – Set Leave Message channel
- `!=ChannelList` – List all active push channels
- `!=help` – List all admin-only commands

---

## 🧰 Slash Commands (Admin Only)

- `/botrestart` – Reboot the bot
- `/ping` – Ping the bot
- `/setclaimrole` – Set a reaction role
- `/removeclaimrole` – Remove a reaction role

---

## 🧰 React Feature

- A web-based Birthday Setting Page (accessible via `!-生日登記網址`) was implemented using **React**, with form validation and communication with the backend via Express and Firebase.
- This is a single-page React application that uses client-side routing to display different views under the same domain.
- The bot generates the birthday page URL dynamically with the format: `http://<domain>/bd/:GuildID/:userID`, allowing the page to auto-fill the necessary context for birthday submission.
- Originally, there were plans to enhance this page with Discord OAuth2 login to improve security. However, this was not implemented before development ceased.
- The page was temporarily taken offline due to concerns about data security. However, the bot itself became inactive primarily because Heroku discontinued its free tier. While it was briefly hosted on Google Cloud, the free quota was used up and maintenance was stopped due to potential costs and the eventual shutdown of the original Discord server.
- Although the current version of the bot does not include the page directly, the birthday setting webpage continues to function independently.
- 🔗 [Birthday Setting Page (React Repo)](https://github.com/SigismundBT/RandomSharkBot-V14-React-Page)

---

## 📂 Database

- **Firebase Realtime Database** stores:

  - Member birthday records
  - Role/channel settings for auto commands
  - Reaction Role configurations
  - Welcome/Leave image URLs

- **AWS DynamoDB** was used in the earlier version of the bot (discord.js v12) to support additional data persistence and flexible querying beyond Firebase's structure.

---

## 🖼️ Banner System

- Welcome and Leave messages support banners generated with **Canva**, featuring the user's avatar and ID.

---

## ⏰ Scheduling

- **Birthday Notifications** are dispatched daily using **cron jobs** for timed automation.

---

## 🧰 Tech Stack

- Node.js (includes a single Express.js backend server that handles both uptime pings and routing for the birthday setting page)
- discord.js
- Firebase
- dotenv
- (Optional) Express for serving the birthday setting page

---

## 🔐 .env Example

```env
DISCORD_BOT_TOKEN=your_token_here
DISCORD_CLIENT_ID=your_client_id_here
FIREBASE_KEY_PATH=./json/2112.json
```

---

### discord.js v14

- Current version
- Slash command support
- Codebase cleanup and structure improvements

---

## 🚀 Deployment

Originally hosted on **Heroku**, but can be easily deployed to:

- Railway
- Render
- VPS (e.g. Linode, DigitalOcean)
- Raspberry Pi

---

## 🧭 Version History

### V12 (Legacy)
- Featured Reaction Role system (with support for standard and custom emojis)
- Included many features, but with a redundant and static structure
- Configuration was hardcoded or edited via fixed data files
- Used AWS DynamoDB for data storage
- Designed for a single Discord server (no dynamic multi-server support)

### V14 (Current & Final Version)
- Designed with the potential for future commercial-scale bots in mind
- Major technical overhaul with full multi-server support
- Simplified and streamlined structure based on lessons from V12
- All configuration done via in-Discord commands (message or slash commands)
- Added Welcome/Leave messages, auto role assignment, and birthday reminder system
- Migrated from DynamoDB to Firebase Realtime Database
- Introduced cron-based birthday notifications
- Added React-based birthday setting webpage

## 🤓 Author

Developed by [@SigismundBT](https://github.com/SigismundBT) (AKA E\_Phrygian) — Full-stack hobbyist with a passion for automation, music, and clean code.

