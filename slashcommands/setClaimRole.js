const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setclaimrole')
        .setDescription('設定Reaction Role')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option.setName('表情符號')
                .setDescription('選擇ReactionRole的表情符號')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('身分組')
                .setDescription('ReactionRole使用的身分組')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('頻道')
                .setDescription('ReactionRole使用的訊息頻道')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('訊息id')
                .setDescription('ReactionRole使用的訊息ID')
                .setRequired(true)),
                
    async execute(interaction) {
        const options = interaction.options;
        const guild = interaction.guild;
        const guildID = guild.id;

        const emojiinput = options.getString('表情符號');
        const emojiargs = emojiinput.split(':');
        const emoji = emojiargs[1];
        
        const role = options.getRole('身分組');
        const roleID = role.id ;
        const channel = options.getChannel('頻道');
        const channelID = channel.id;
        const msgID = options.getString('訊息id');

        const admin = require('firebase-admin');
        const db = admin.firestore();
        const dbCollection = db.collection('ClaimRoles');
        const dbdoc = dbCollection.doc(guildID);
        const chdoc = dbdoc.collection('ReactionRoleCH').doc(channelID);
        const msgdoc = chdoc.collection('ReactionRoleMSG').doc(msgID);

        try {
            const msgcheck = channel.messages.fetch(msgID)
            await Promise.all([msgcheck])

            const guildemojichecker = guild.emojis.cache.find(e => e.name === emoji) 
            if(guildemojichecker === undefined){
                const emojiRegex = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu;
                const unicodeemojitest = emojiRegex.test(emojiinput)
                if(unicodeemojitest === false )
                return interaction.reply({
                    content:`表情符號有誤，請重新確認。 \n\n表情符號: ${emojiinput} \n身分組：${role} \n頻道：${channel} \n頻道ID： ${channelID} \n訊息ID：${msgID}`,
                    ephemeral: true,
                });
            };

            const setclaimrole = async () => {
                const guildres = await dbdoc.get();
                const chres = await chdoc.get();
                const msgres =  await msgdoc.get();

                if (!guildres.exists){
                    if (emoji === undefined){
                        msgdoc.set({
                            [emojiinput]: roleID
                        });
                        dbdoc.set({dummy:'dummy'});
                        chdoc.set({dummy:'dummy'});
                    } else {
                        msgdoc.set({
                            [emoji]: roleID
                        });
                        dbdoc.set({dummy:'dummy'});
                        chdoc.set({dummy:'dummy'});
                    };
                }

                if (guildres.exists && !chres.exists){
                    if(emoji === undefined){
                        msgdoc.set({
                            [emojiinput]: roleID
                        });
                        dbdoc.set({dummy:'dummy'});
                        chdoc.set({dummy:'dummy'});
                    } else {
                        msgdoc.set({
                            [emoji]: roleID
                        });
                        dbdoc.set({dummy:'dummy'});
                        chdoc.set({dummy:'dummy'});
                    };
                }

                if(guildres.exists && chres.exists && !msgres.exists){
                    if(emoji === undefined){
                        msgdoc.set({
                            [emojiinput]: roleID
                        });
                    } else {
                        msgdoc.set({
                            [emoji]: roleID
                        });
                    };
                }
                if(guildres.exists && chres.exists && msgres.exists){
                    if(emoji === undefined){
                        msgdoc.update({
                            [emojiinput]: roleID
                        });
                    } else {
                        msgdoc.update({
                            [emoji]: roleID
                        });
                    };
                };
            }
            await setclaimrole();

            await interaction.reply({
                content:`Reaction Role新增成功！ \n\n表情符號: ${emojiinput} \n身分組：${role} \n頻道：${channel} \n頻道ID： ${channelID} \n訊息ID：${msgID}`,
                ephemeral: true,
            });

            return
        }
        catch (err) {
            if(err.code == 10008){
                return interaction.reply({
                    content:`訊息不存在。 \n\n訊息ID: ${msgID} \n嘗試呼叫頻道: ${channel}`,
                    ephemeral: true,
                });
            } else if (err.code == 50035){
                return interaction.reply({
                    content:`訊息ID必須要是數字。 \n\n訊息ID: ${msgID} \n嘗試呼叫頻道: ${channel}`,
                    ephemeral: true,
                });
            } else {
                return console.error('An Error occurred when trying to remove a Reaction Role: ' + err);
            };
        };
    },
};