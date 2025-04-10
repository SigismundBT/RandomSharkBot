module.exports = {
  prefix: "!=SetLeaveMsgCH",
  fn: (msg) =>{
    if(msg.author.bot){
      return
    };

    const admin = require('firebase-admin');

    setTimeout(() => msg.delete(), 100);

    try {
      const { PermissionsBitField } = require('discord.js');
      if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        
        const guildID = msg.guild.id;
        const channelID =  msg.channel.id;

        const db = admin.firestore();
        const leaveMsgCh = db.collection('RSBChannels').doc(guildID);

        leaveMsgCh.get().then(res => {
          if(res.exists){
            leaveMsgCh.update({
              'LeaveCh': channelID}
            );
          };
          
          if (!res.exists){
            leaveMsgCh.set({
              'LeaveCh': channelID}
            );
          };
        })

        .then(
          msg.channel.send({content: `設置離開訊息頻道至 <#${channelID}>`})
            .then(msg => {
              setTimeout(() => msg.delete(), 7000);
            })
        )

        .catch((err) => {
          console.error("An error has occurred: ", err);
        });
        return
        
      } else {
        return msg.channel.send({content:'這個指令只能由管理員使用' })
          .then(msg => {
            setTimeout(() => msg.delete(), 7000);
          }) 
      };
    } catch (err) {
      console.error(err);
    };
  }
};