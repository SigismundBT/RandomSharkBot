module.exports = {
    prefix: "!-生日查詢(日期)",
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
                        const args = msg.content.split(' ');
                        if (!args[1]) {
                            msg.reply({ content: '指令格式錯誤，請重新輸入'})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return     
                        };

                        const date = args[1];
                        const dateargs = date.split('-');
                        const dbmonth = Number(dateargs[0]);
                        const dbday =  Number(dateargs[1]);

                        if (!dbday) {
                            msg.reply({ content: '日期格式錯誤，請重新輸入'})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return     
                        };

                        //#region Date Filter
                        const monthsWith31days = [1,3,5,7,8,10,12];
                        const monthsWith30days = [4,6,9,11];

                        if (dbmonth == 0 || dbmonth > 12){
                            msg.reply({ content: '月份輸入錯誤，一年有幾個月來著？'})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return     
                        } 
                        
                        else if (monthsWith31days.includes(dbmonth) && (dbday == 0 || dbday > 31)){
                            msg.reply({ content: `日期輸入錯誤，你輸入的月份是 ${dbmonth} 月，要不要確定一下這個月有沒有這個日子？`})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return
                        }
                        
                        
                        else if (monthsWith30days.includes(dbmonth) && (dbday == 0 || dbday > 30)){
                            msg.reply({ content: `日期輸入錯誤，你輸入的月份是 ${dbmonth} 月，要不要確定一下這個月有沒有這個日子？`})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return
                        }


                        else if (dbmonth == 2 && (dbday == 0 || dbday > 29)){
                            msg.reply({ content: `日期輸入錯誤，你輸入的月份是 2 月，要不要確定一下2月有沒有超過你輸入的日子？`})
                                .then(msg => {
                                    setTimeout(() => msg.delete(), 1000 *10);
                                });
                            return
                        } 

                        //#endregion 

                        else {
                            const birthdaydata = db.collection('BDdata').doc(guildID);
                            birthdaydata
                            .get().then(res => {
                                if(!res.exists){
                                    msg.reply({content: 
                                        '此伺服器沒有任何生日資料' 
                                    })
                                        .then(msg => {
                                            setTimeout(() => msg.delete(), 1000 *10);
                                        });
                                    return  
                                } else {
                                    const resdata = res.data();
                                    const searchdate = `${dbmonth}-${dbday}`;
                                    const uidarr = []
                                    for (const [key, value] of Object.entries(resdata)) {
                                        if(value.includes(searchdate)){
                                            uidarr.push(key)
                                        }
                                    }
                                
                                    if(uidarr.length > 0){
                                        msg.reply({
                                            content: (
                                                '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                                                ` ${dbmonth} 月 ${dbday} 生日的成員如下： \n\n` + 
                                                uidarr.map(r => '<@'+ `${r}` + '>' , {split: true}).join('\n')) , 
                                            allowedMentions: { repliedUser: false }
                                        })
                                            .then(msg => {
                                                setTimeout(() => msg.delete(), 1000 * 60 * 3);
                                            });
                                            return
                                    } else {
                                        msg.reply({content: 
                                            '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                                            `此日期（${dbmonth} 月 ${dbday}日）沒有生日紀錄` 
                                        })
                                            .then(msg => {
                                                setTimeout(() => msg.delete(), 1000 * 10);
                                            });
                                        return
                                    };
                                }
                            })

                            .catch((err) => {
                                console.error("An error has occurred: ", err);
                            });

                            return 
                        };          
                    };
                };
            });
        } catch (err) {
            console.error(err);
        };
    }
  };