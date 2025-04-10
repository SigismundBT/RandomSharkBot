module.exports = {
  prefix: "!=SetWelcomeMsgCH",
  fn: (msg) =>{
    if(msg.author.bot){
      return
    };

    setTimeout(() => msg.delete(), 100);

    const admin = require('firebase-admin');

    try {
      const { PermissionsBitField } = require('discord.js');
      if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        
        const guildID = msg.guild.id;
        const channelID =  msg.channel.id;

        const db = admin.firestore();
        const WelcomeMsgCh = db.collection('RSBChannels').doc(guildID);

        WelcomeMsgCh.get().then(res => {
          if(res.exists){
            WelcomeMsgCh.update({
              'WelcomeCh': channelID}
            );
          };
          
          if (!res.exists){
            WelcomeMsgCh.set({
              'WelcomeCh': channelID}
            );
          };
        })

        .then(
          msg.channel.send({content: `設置歡迎訊息頻道至 <#${channelID}>`})
            .then(msg => {
              setTimeout(() => msg.delete(), 7000);
            })  
        )

        .catch((err) => {
          console.error("An error has occurred: ", err);
        });
        
        return

      } else {
         msg.channel.send({content:'這個指令只能由管理員使用'})
        .then(r => {
          setTimeout(() => r.delete(), 7000);
        });
        return
      };
    } catch (err) {
      console.error(err);
    };
  }
};