module.exports = (client) => {
    try {
        const admin = require('firebase-admin');
        client.guilds.cache.forEach(r => {
            const guildID = r.id;
            const guildName = r.name

            const reactionroles = async () => {
                const db = admin.firestore();
                const dbCollection = db.collection('ClaimRoles');
                const dbdoc = dbCollection.doc(guildID);
                const chcollection = dbdoc.collection('ReactionRoleCH');
                
                const dbdocr = await chcollection.get();
                dbdocr.docs.forEach(async chdocs => {
                    const channelID = chdocs.id
                    const chdoc = chcollection.doc(channelID);
                    const getEmoji = (emojiName) =>
                    client.emojis.cache.find((emoji) => emoji.name === emojiName);

                    const msgcollection = chdoc.collection('ReactionRoleMSG');
                    const msgcr = await msgcollection.get()
                    msgcr.docs.forEach(msgdocs => {
                        const msgID = msgdocs.id;
                        
                        const msgdoc = msgcollection.doc(msgID);
                        const emojis = msgdocs.data();

                        const reactions = [];
                        const keylength = Object.keys(emojis).length;

                        if(keylength <= 0){
                            return
                        };
                        
                        for (const key in emojis){
                            const emoji = getEmoji(key);
                            if(emoji === undefined){
                                reactions.push(key);
                            } else {
                                reactions.push(emoji);
                            };
                        };

                        const botAddReactions = (msg, reactions) => {
                            msg.react(reactions[0]).catch(err => {
                                if(err.code !== 10041){
                                    console.error(`Can\'t find certain emoji(s) in server name: ${guildName}, server ID: ${guildID}, Channel ID: ${channelID}, Message ID: ${msgID}`)
                                    return 
                                }

                                console.error('reaction error ' + err)
                            });
                            reactions.shift();
                            if (reactions.length > 0) {
                                setTimeout(() => botAddReactions(msg, reactions), 750);
                            };
                        };

                        const channel = client.channels.cache.get(channelID);
                        const message = channel.messages.fetch(msgID);
    
                        message.then((msg) => {
                            botAddReactions(msg, reactions);
                        })

                        .catch (err => {
                            if(err.code == 10008){
                                return console.error(`Catch Message fail, MSG ID: ${msgID} at CH: ${channel.name}, server: ${guildName}`)
                            } else {
                                return console.error('BAR error: ' + err)
                            }
                            
                        });

                        client.on('messageReactionAdd', (reaction, user) => {
                            if (user.bot) {
                                return
                            };

                            if (reaction.message.channel.id === channelID) {
                                const emoji = reaction._emoji.name;
                                const { guild } = reaction.message;
                                const roleID = emojis[emoji];
                                const member = guild.members.cache.find((member) => member.id === user.id);
                                const userRoles = member._roles;
                                
                                if(!roleID){
                                    return
                                };

                                if(!member){
                                    return
                                };

                                if (userRoles.includes(roleID)){
                                    member.roles.remove(roleID);
                                    reaction.users.remove(member);
                                } else {
                                    member.roles.add(roleID);
                                    reaction.users.remove(member);
                                };
                            };
                        });

                    })
                })
            }

            reactionroles();

        });
    }

    catch(err){
        console.error(err);
    };
};