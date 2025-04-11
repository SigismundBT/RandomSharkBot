🦈 RandomSharkBot

⚙️ This version is based on RandomSharkBot V12 with significant feature upgrades, improved structure, and updated libraries.

A fully featured Discord bot originally developed for a ~100-member gaming server, hosted on Heroku. Designed to automate birthday reminders, user onboarding, role management, and more — all backed by Firebase.

📌 Features

🤖 Auto Commands

Welcome Message – Sends a message (with optional image) when a user joins.

Leave Message – Sends a farewell message when a user leaves.

Join Role Assignment – Auto-assigns roles to new members.

Reaction Role System – Supports both custom and standard emojis. Automatically detects type.

Birthday Notifications – Sends a daily birthday message.➔ Even when no members are celebrating today, the bot will still notify the server that there are no birthdays.

Remove Member Data – Cleans up Firebase when a user leaves.

🛠️ Manual Commands

For All Users:

!-生日列表 – Shows all upcoming birthdays

!-生日查詢(成員) @user – Search birthday by member

!-生日查詢(日期) MM-DD – Search birthday by date

!-設定生日 @user MM-DD – Set birthday via command

!-生日登記網址 @user – Opens a web-based birthday setting page

Admin Only:

!=AddWelcomeImg <image URL> / !=RemoveWelcomeImg <image URL> / !=WelcomeImgList

!=AddLeaveImg <image URL> / !=RemoveLeaveImg <image URL> / !=LeaveImgList

🖼️ Multiple images can be set; a random one is chosen each time

!=SetJoinRole <role> / !=RemoveJoinRole <role> / !=JoinRoles

!=SetClaimRole <emoji> <role> / !=RemoveClaimRole <emoji> / !=ClaimRoles

Supports both custom and standard emojis. Auto-detects type.

!=RestartBot – Reboot the bot

Channel Binding Commands:

!=SetBDAlarmCH – Set birthday alarm channel

!=SetBDSetCH – Set birthday setting command channel

!=SetRoleClaimCH – Set Reaction Role channel

!=SetWelcomeMsgCH – Set Welcome Message channel

!=SetLeaveMsgCH – Set Leave Message channel

!=ChannelList – List all active push channels

!=help – List all admin-only commands

🧰 Slash Commands (Admin Only)

/botrestart – Reboot the bot

/ping – Ping the bot

/setclaimrole – Set a reaction role

/removeclaimrole – Remove a reaction role

🧰 React Feature

A web-based Birthday Setting Page (accessible via !-生日登記網址) was implemented using React, with form validation and communication with the backend via Express and Firebase.

This page allows users to set or update their birthday with a user-friendly interface.

Although the current version of the bot does not include the page directly, the birthday setting webpage continues to function independently.

🔗 Birthday Setting Page (React Repo)

📂 Database

Firebase Realtime Database stores:

Member birthday records

Role/channel settings for auto commands

Reaction Role configurations

Welcome/Leave image URLs

AWS DynamoDB was used in the earlier version of the bot (discord.js v12) to support additional data persistence and flexible querying beyond Firebase's structure.

🖼️ Banner System

Welcome and Leave messages support banners generated with Canva, featuring the user's avatar and ID.

⏰ Scheduling

Birthday Notifications are dispatched daily using cron jobs for timed automation.

🧰 Tech Stack

Node.js (includes an Express.js backend server used for uptime pings and previously for the birthday setting page)

discord.js

Firebase

dotenv

(Optional) Express for serving the birthday setting page

🔐 .env Example

DISCORD_BOT_TOKEN=your_token_here
FIREBASE_KEY_PATH=./json/2112.json
BIRTHDAY_WEBPAGE_URL=https://your-webpage.example.com

discord.js v14

Current version

Slash command support

Codebase cleanup and structure improvements

🚀 Deployment

Originally hosted on Heroku, but can be easily deployed to:

Railway

Render

VPS (e.g. Linode, DigitalOcean)

Raspberry Pi

🤓 Author

Developed by @SigismundBT (AKA E_Phrygian) — Full-stack hobbyist with a passion for automation, music, and clean code.

