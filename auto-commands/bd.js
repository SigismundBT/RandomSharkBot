const CronJob = require('cron').CronJob;

module.exports = (client) => {  
    new CronJob ('0 0 0 * * *',  function(){
        try {
            const admin = require('firebase-admin');
            client.guilds.cache.forEach(async r => {
                const guildID = r.id;

                const db = admin.firestore();
                const bdChdata = db.collection('RSBChannels').doc(guildID);
                const bcChdatar = await bdChdata.get();
                if(!bcChdatar.exists){
                    return
                };
                
                if(bcChdatar.exists){
                    const bdch = bcChdatar.data().BDAlarmCh;
                    const channel = client.channels.cache.get(bdch);

                    const now = new Date();
                    const twTZ = 'Asia/Taipei';
                    const {format,utcToZonedTime} = require('date-fns-tz');
                    const twDate = utcToZonedTime(now,twTZ) ;

                    const date = format(twDate,'MM-dd', {timeZone: 'Asia/Taipei'});
                    const dateargs = date.split('-');
                    const dateMM = Number(dateargs[0]);
                    const dateDD = Number(dateargs[1]);

                    const docname = guildID;
                    
                    const bdData = db.collection('BDdata').doc(docname);
                    const bdDatar = await bdData.get();
                    
                    const resdata = bdDatar.data();
                    const uidarr = []
                    if(resdata === undefined){
                        channel.send({ content: (
                            '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                            `今天是 **${dateMM}** 月 **${dateDD}** 日！\n\n` + 
                            '今天沒人生日！\n\n' +
                            '🎊 耶！(？'
                        )});

                        return console.log('There is no any data in guild No. ' + guildID);
                    };

                    for (const [key, value] of Object.entries(resdata)) {
                        if(value.includes(`${dateMM}-${dateDD}`)){
                            uidarr.push(key);
                        };
                    };

                    if(uidarr.length > 0){
                        return channel.send({ content: (
                            '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                            `今天是 **${dateMM}** 月 **${dateDD}** 日！\n\n` +
                            '今天生日的成員有： \n\n' +
                            uidarr.map(r => '<@'+ `${r}` + '>' , {split: true}).join('\n') +
                            '\n\n'+
                            '🎁🎁🎁 🎂 **生日快樂！！！！**🎂 🎁🎁🎁'
                        )});
                    } else {
                        return channel.send({ content: (
                            '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n' +
                            `今天是 **${dateMM}** 月 **${dateDD}** 日！\n\n` + 
                            '今天沒人生日！\n\n' +
                            '🎊 耶！(？'
                        )});
                    };
                };
            });
        } catch(err) {
            return console.error(err);
        };
    },null,true);
};