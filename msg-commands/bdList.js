module.exports = {
    prefix: "!-生日列表",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };
        const admin = require('firebase-admin');
        const db = admin.firestore();

        try {
            setTimeout(() => msg.delete(), 1000 * 7);

            const guildID = msg.guild.id;
            const getChannel = db.collection('RSBChannels').doc(guildID);

            getChannel.get().then(res => {
                if(!res.exists){
                    return
                };

                if(res.exists){
                    const channelID = res.data().BDSettingCh;
                    if (msg.channel.id !== channelID){
                        msg.reply(`此指令不允許使用在此頻道`)
                            .then(msg => {
                                setTimeout(() => msg.delete(), 1000 *10);
                            });
                        return
                    } else {
        
                        const dbdocname = (guildID);
                        const birthdaydata = db.collection('BDdata').doc(dbdocname);

                        birthdaydata
                        .get()
                        .then(res => {
                            if (!res.exists){
                                msg.reply({content: 
                                    '此伺服器沒有任何生日資料' 
                                })
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 1000 *10);
                                    });
                                return  
                            } else {
                                const rDate = res.data();
                                const dataarr = [];
                                
                                Object.entries(rDate).map(([key, value]) => {
                                    const resdate = `${value}`.split('-');
                                    const resmonth = resdate[0];
                                    const resday = resdate[1];

                                    if(key.length <= 0){
                                        return
                                    } else if (value.length <= 0){
                                        return 
                                    };
                                    
                                    dataarr.push(`<@${key}> → ${resmonth} 月 ${resday} 日`);


                                })

                                if(dataarr.length <= 0){
                                    msg.reply({content: 
                                        '此伺服器沒有任何生日資料' 
                                    })
                                        .then(msg => {
                                            setTimeout(() => msg.delete(), 1000 * 10);
                                        });
                                    return  
                                }

                                msg.reply({content: 
                                    '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                                    `本伺服器生日列表如下：\n\n` +
                                    dataarr.map(r => r, {split: true}).join('\n')
                                    
                                })
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 * 180);
                                });     
                            }
                        })

                        .catch((err) => {
                            console.error("An error has occurred: ", err);
                        });
                        return
                    };
                };
            });
        } catch (err) {
            console.error(err);
        };
        
    }
  };